
-- Create projects table to store project metadata
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

-- Create likes table
CREATE TABLE public.project_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL, -- Using IP as user identifier since no auth yet
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_ip) -- Prevent duplicate likes from same IP
);

-- Create views table
CREATE TABLE public.project_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ratings table
CREATE TABLE public.project_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_ip) -- One rating per IP per project
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required)
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can view likes" ON public.project_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can view views" ON public.project_views FOR SELECT USING (true);
CREATE POLICY "Anyone can view ratings" ON public.project_ratings FOR SELECT USING (true);

-- Create policies for public write access
CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can like projects" ON public.project_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view projects" ON public.project_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can rate projects" ON public.project_ratings FOR INSERT WITH CHECK (true);

-- Create functions to get project stats
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
    (SELECT COUNT(*) FROM public.project_likes WHERE project_id = project_uuid) as likes_count,
    (SELECT COUNT(*) FROM public.project_views WHERE project_id = project_uuid) as views_count,
    (SELECT ROUND(AVG(rating), 1) FROM public.project_ratings WHERE project_id = project_uuid) as avg_rating,
    (SELECT COUNT(*) FROM public.project_ratings WHERE project_id = project_uuid) as rating_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
