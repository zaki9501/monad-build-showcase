-- Core Database Tables for Monad Build Showcase
-- This creates the fundamental tables needed for the application

-- =============================================================================
-- PROJECTS TABLE - Main projects data
-- =============================================================================

CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  builder_name TEXT NOT NULL,
  builder_discord TEXT NOT NULL,
  builder_twitter TEXT,
  thumbnail TEXT,
  github_url TEXT,
  live_url TEXT,
  tags TEXT[] DEFAULT '{}',
  mission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- ENGAGEMENT TABLES - Likes, Views, Ratings
-- =============================================================================

-- Project likes
CREATE TABLE public.project_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL, -- Using IP as user identifier since no auth yet
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_ip) -- Prevent duplicate likes from same IP
);

-- Project views
CREATE TABLE public.project_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project ratings
CREATE TABLE public.project_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_ip) -- One rating per IP per project
);

-- URL verification cache
CREATE TABLE public.url_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_safe BOOLEAN NOT NULL DEFAULT true,
  last_checked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_verifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECURITY POLICIES - Public read access, controlled write access
-- =============================================================================

-- Projects policies
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.projects FOR UPDATE USING (true);

-- Engagement policies  
CREATE POLICY "Anyone can view likes" ON public.project_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can like projects" ON public.project_likes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view views" ON public.project_views FOR SELECT USING (true);
CREATE POLICY "Anyone can view projects" ON public.project_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view ratings" ON public.project_ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can rate projects" ON public.project_ratings FOR INSERT WITH CHECK (true);

-- URL verification policies
CREATE POLICY "Anyone can view url verifications" ON public.url_verifications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert url verifications" ON public.url_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update url verifications" ON public.url_verifications FOR UPDATE USING (true);

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Function to get project stats
CREATE OR REPLACE FUNCTION get_project_stats(project_uuid UUID)
RETURNS TABLE(
  likes_count BIGINT,
  views_count BIGINT,
  avg_rating NUMERIC,
  rating_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*) FROM public.project_likes WHERE project_id = project_uuid), 0) as likes_count,
    COALESCE((SELECT COUNT(*) FROM public.project_views WHERE project_id = project_uuid), 0) as views_count,
    COALESCE((SELECT ROUND(AVG(rating), 1) FROM public.project_ratings WHERE project_id = project_uuid), 0) as avg_rating,
    COALESCE((SELECT COUNT(*) FROM public.project_ratings WHERE project_id = project_uuid), 0) as rating_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle project like
CREATE OR REPLACE FUNCTION toggle_project_like(project_uuid UUID, user_ip_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM public.project_likes 
    WHERE project_id = project_uuid AND user_ip = user_ip_address
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Remove like
    DELETE FROM public.project_likes 
    WHERE project_id = project_uuid AND user_ip = user_ip_address;
    RETURN false;
  ELSE
    -- Add like
    INSERT INTO public.project_likes (project_id, user_ip) 
    VALUES (project_uuid, user_ip_address);
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit rating
CREATE OR REPLACE FUNCTION submit_project_rating(
  project_uuid UUID, 
  rating_value INTEGER, 
  user_ip_address TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.project_ratings (project_id, rating, user_ip)
  VALUES (project_uuid, rating_value, user_ip_address)
  ON CONFLICT (project_id, user_ip) 
  DO UPDATE SET 
    rating = rating_value,
    created_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user liked project
CREATE OR REPLACE FUNCTION check_user_liked_project(project_uuid UUID, user_ip_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.project_likes 
    WHERE project_id = project_uuid AND user_ip = user_ip_hash
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user rating for project
CREATE OR REPLACE FUNCTION check_user_rated_project(project_uuid UUID, user_ip_hash TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_rating INTEGER;
BEGIN
  SELECT rating INTO user_rating
  FROM public.project_ratings 
  WHERE project_id = project_uuid AND user_ip = user_ip_hash;
  
  RETURN COALESCE(user_rating, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for projects
CREATE INDEX idx_projects_mission ON public.projects(mission);
CREATE INDEX idx_projects_builder_name ON public.projects(builder_name);
CREATE INDEX idx_projects_builder_discord ON public.projects(builder_discord);
CREATE INDEX idx_projects_created_at ON public.projects(created_at);
CREATE INDEX idx_projects_tags ON public.projects USING GIN(tags);

-- Indexes for engagement
CREATE INDEX idx_project_likes_project_id ON public.project_likes(project_id);
CREATE INDEX idx_project_views_project_id ON public.project_views(project_id);
CREATE INDEX idx_project_ratings_project_id ON public.project_ratings(project_id);

-- Indexes for URL verification
CREATE INDEX idx_url_verifications_url ON public.url_verifications(url);

-- =============================================================================
-- AUTO-UPDATE TIMESTAMPS
-- =============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for projects table
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SAMPLE DATA INSERT
-- =============================================================================

-- Insert a few sample projects to test the system
INSERT INTO public.projects (name, description, builder_name, builder_discord, builder_twitter, thumbnail, github_url, live_url, tags, mission) VALUES

-- Sample Farcaster projects
('P1x3lz', 'P1x3lz - r/place style game on Farcaster', 'shirumo_lab', 'shirumo_lab', 'https://x.com/Shirumo_lab', '/placeholder.svg', 'https://github.com/shirumo-lab/p1x3lz', 'https://farcaster.xyz/miniapps/L1SuwsoofH7Q/p1x3lz', ARRAY['Miniapp', 'Pixel Art', 'Winner'], 'Break Monad v2: Farcaster Edition'),

('Flappy Trump', 'A Flappy Bird-inspired game on Monad Testnet', 'Kshitij Gajapure', 'kshitij', 'https://x.com/KshitijGajapure', '/placeholder.svg', 'https://github.com/kshitij/flappy-trump', 'https://farcaster.xyz/miniapps/v21qItMnSK7y/flappy-trump', ARRAY['Game', 'Miniapp', 'Runner-up'], 'Break Monad v2: Farcaster Edition'),

('Chog vs CatGirls', 'Chog vs CatGirls Fight Meow, or Die Ugly', 'zekeosborn', 'zekeosborn', 'https://x.com/zekeosborn', '/placeholder.svg', 'https://github.com/zekeosborn/chog-vs-catgirls', 'https://farcaster.xyz/miniapps/8izMbIunWy2Y/chog-vs-cat-girls', ARRAY['Game', 'Miniapp', 'Third Place'], 'Break Monad v2: Farcaster Edition'),

-- Sample Mission 4 projects
('DevHub', 'Monad Visualizer and winner of Mission 4', '0xkadzu', '0xkadzu', 'https://x.com/0xkadzu', '/placeholder.svg', 'https://github.com/0xkadzu/devhub', 'https://devhub.kadzu.dev/', ARRAY['Visualizer', 'Winner', 'Mission 4'], 'Visualizer & Dashboard (Mission 4)'),

('Testnet Explorer', 'Monad Testnet Dashboard, winner of Mission 4', 'solodanETH', 'daniel_6773', 'https://x.com/solodanETH', '/placeholder.svg', 'https://github.com/solodanETH/testnet-explorer', 'https://flipsidecrypto.xyz/solodan_/monad-testnet-explorer-xDbcKc', ARRAY['Dashboard', 'Winner', 'Mission 4'], 'Visualizer & Dashboard (Mission 4)'),

-- Sample Mission 5 projects
('NFThing', 'Comprehensive NFT tooling platform', 'gabriell_santi', 'gabriell_santi', 'https://x.com/gabriell_santi', '/placeholder.svg', 'https://github.com/gabriell-santi/nfthing', 'https://nfthing-beta.vercel.app/', ARRAY['NFT', 'Tooling', 'Winner', 'Mission 5'], 'Make NFTs Great Again (Mission 5)'),

('MoNFT', 'NFT tools and utilities platform', 'rosinxyz', 'rosinxyz', 'https://x.com/rosinxyz', '/placeholder.svg', 'https://github.com/rosinxyz/monft', 'https://www.monft.tools/', ARRAY['NFT', 'Tooling', 'Runner-up', 'Mission 5'], 'Make NFTs Great Again (Mission 5)');

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Core database tables created successfully!';
  RAISE NOTICE 'Tables created: projects, project_likes, project_views, project_ratings, url_verifications';
  RAISE NOTICE 'Sample projects inserted: %', (SELECT COUNT(*) FROM public.projects);
  RAISE NOTICE 'Ready for Achievement System!';
END $$;
