-- Achievement & Badge System Database Migration
-- Creates tables and initial achievement data for the Monad Build Showcase

-- =============================================================================
-- ACHIEVEMENTS TABLE - Defines all available achievements/badges
-- =============================================================================

CREATE TABLE public.achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL, -- Emoji or icon identifier
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 4),
  requirements JSONB NOT NULL, -- Flexible requirements storage
  badge_color VARCHAR(20) DEFAULT 'blue',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- USER ACHIEVEMENTS TABLE - Tracks which achievements users have earned
-- =============================================================================

CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL, -- Could be IP, Discord, Twitter, etc.
  user_type VARCHAR(20) DEFAULT 'builder', -- 'builder', 'voter', 'visitor'
  achievement_id INTEGER NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress JSONB DEFAULT '{}', -- For tracking partial progress
  metadata JSONB DEFAULT '{}', -- Additional context about earning
  UNIQUE(user_identifier, achievement_id) -- Prevent duplicate achievements
);

-- =============================================================================
-- BUILDER STATS TABLE - Aggregated stats for quick achievement calculations
-- =============================================================================

CREATE TABLE public.builder_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_name TEXT NOT NULL,
  builder_discord TEXT,
  builder_twitter TEXT,
  user_identifier TEXT NOT NULL UNIQUE, -- Primary identifier for the builder
  
  -- Project Statistics
  total_projects INTEGER DEFAULT 0,
  projects_with_github INTEGER DEFAULT 0,
  projects_with_live_url INTEGER DEFAULT 0,
  projects_with_both INTEGER DEFAULT 0,
  
  -- Engagement Statistics  
  total_likes INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  
  -- Mission Participation
  missions_participated TEXT[] DEFAULT '{}', -- Array of mission names
  unique_mission_count INTEGER DEFAULT 0,
  
  -- Quality Metrics
  high_rated_projects INTEGER DEFAULT 0, -- Projects with 4+ rating
  trending_projects INTEGER DEFAULT 0, -- Projects that became trending
  winner_badges INTEGER DEFAULT 0, -- Mission wins/placements
  
  -- Timestamps
  first_project_at TIMESTAMP WITH TIME ZONE,
  last_project_at TIMESTAMP WITH TIME ZONE,
  stats_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_stats ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECURITY POLICIES - Allow public read access, controlled write access
-- =============================================================================

-- Achievements policies (read-only for everyone)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- User achievements policies  
CREATE POLICY "Anyone can view user achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Builder stats policies
CREATE POLICY "Anyone can view builder stats" ON public.builder_stats FOR SELECT USING (true);
CREATE POLICY "System can update builder stats" ON public.builder_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "System can modify builder stats" ON public.builder_stats FOR UPDATE USING (true);

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Function to get builder achievements
CREATE OR REPLACE FUNCTION get_builder_achievements(builder_identifier TEXT)
RETURNS TABLE(
  achievement_id INTEGER,
  name VARCHAR(100),
  description TEXT,
  icon VARCHAR(50),
  tier INTEGER,
  badge_color VARCHAR(20),
  earned_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.description,
    a.icon,
    a.tier,
    a.badge_color,
    ua.earned_at
  FROM public.achievements a
  JOIN public.user_achievements ua ON a.id = ua.achievement_id
  WHERE ua.user_identifier = builder_identifier
  ORDER BY ua.earned_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if builder has specific achievement
CREATE OR REPLACE FUNCTION has_achievement(builder_identifier TEXT, achievement_name VARCHAR(100))
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_achievements ua
    JOIN public.achievements a ON ua.achievement_id = a.id
    WHERE ua.user_identifier = builder_identifier 
    AND a.name = achievement_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievement to builder
CREATE OR REPLACE FUNCTION award_achievement(
  builder_identifier TEXT,
  achievement_name VARCHAR(100),
  user_type_param VARCHAR(20) DEFAULT 'builder',
  metadata_param JSONB DEFAULT '{}'
) RETURNS BOOLEAN AS $$
DECLARE
  achievement_id_var INTEGER;
BEGIN
  -- Get achievement ID
  SELECT id INTO achievement_id_var 
  FROM public.achievements 
  WHERE name = achievement_name AND is_active = true;
  
  -- If achievement doesn't exist, return false
  IF achievement_id_var IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Try to insert the user achievement (ignore if already exists)
  INSERT INTO public.user_achievements (user_identifier, user_type, achievement_id, metadata)
  VALUES (builder_identifier, user_type_param, achievement_id_var, metadata_param)
  ON CONFLICT (user_identifier, achievement_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- INITIAL ACHIEVEMENTS DATA
-- =============================================================================

INSERT INTO public.achievements (name, description, icon, tier, requirements, badge_color) VALUES

-- Tier 1: Participation Badges (Easy to get)
('First Launch', 'Submit your first project to the showcase', '🚀', 1, '{"type": "simple", "field": "total_projects", "operator": ">=", "value": 1}', 'green'),

('Code Warrior', 'Include a GitHub repository with your project', '💻', 1, '{"type": "simple", "field": "projects_with_github", "operator": ">=", "value": 1}', 'blue'),

('Go Live', 'Deploy your project with a live URL', '🌐', 1, '{"type": "simple", "field": "projects_with_live_url", "operator": ">=", "value": 1}', 'cyan'),

('Rated Builder', 'Receive your first rating on any project', '⭐', 1, '{"type": "simple", "field": "total_ratings", "operator": ">=", "value": 1}', 'yellow'),

-- Tier 2: Engagement Badges (Medium difficulty)
('Popular Creator', 'Earn 25+ total likes across all projects', '🔥', 2, '{"type": "simple", "field": "total_likes", "operator": ">=", "value": 25}', 'red'),

('High Quality', 'Maintain 4.0+ average rating across projects', '👑', 2, '{"type": "composite", "conditions": [{"field": "average_rating", "operator": ">=", "value": 4.0}, {"field": "total_ratings", "operator": ">=", "value": 5}], "logic": "AND"}', 'purple'),

('Multi-Platform', 'Submit projects to 3+ different mission categories', '📱', 2, '{"type": "simple", "field": "unique_mission_count", "operator": ">=", "value": 3}', 'indigo'),

('Community Loved', 'Get 100+ total views across all projects', '💖', 2, '{"type": "simple", "field": "total_views", "operator": ">=", "value": 100}', 'pink'),

-- Tier 3: Mastery Badges (Hard to get)
('Mission Master', 'Participate in 5+ different missions', '🏆', 3, '{"type": "simple", "field": "unique_mission_count", "operator": ">=", "value": 5}', 'gold'),

('Perfectionist', 'All projects have GitHub + Live URL + 4+ rating', '🎯', 3, '{"type": "composite", "conditions": [{"field": "projects_with_both", "operator": "=", "field_ref": "total_projects"}, {"field": "average_rating", "operator": ">=", "value": 4.0}], "logic": "AND"}', 'emerald'),

('Legend', 'Earn 100+ likes and 50+ ratings total', '🌟', 3, '{"type": "composite", "conditions": [{"field": "total_likes", "operator": ">=", "value": 100}, {"field": "total_ratings", "operator": ">=", "value": 50}], "logic": "AND"}', 'amber'),

('Monad Pioneer', 'Be among the first 50 builders on the platform', '👨‍💻', 3, '{"type": "special", "description": "Manually awarded to early contributors"}', 'slate'),

-- Tier 4: Special Badges (Very rare)
('Monad Champion', 'Win 1st place in any mission competition', '💎', 4, '{"type": "special", "description": "Manually awarded to mission winners"}', 'diamond'),

('Winner', 'Place in top 3 of any mission competition', '🥇', 4, '{"type": "special", "description": "Manually awarded to mission top 3"}', 'bronze'),

('Innovation Award', 'Create a project with unique technology or approach', '🎨', 4, '{"type": "special", "description": "Manually awarded for innovation"}', 'violet'),

('Trendsetter', 'Have a project become the most liked in its mission', '🚀', 4, '{"type": "simple", "field": "trending_projects", "operator": ">=", "value": 1}', 'orange');

-- =============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for fast lookups
CREATE INDEX idx_user_achievements_user_identifier ON public.user_achievements(user_identifier);
CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX idx_builder_stats_user_identifier ON public.builder_stats(user_identifier);
CREATE INDEX idx_builder_stats_builder_name ON public.builder_stats(builder_name);
CREATE INDEX idx_achievements_tier ON public.achievements(tier);
CREATE INDEX idx_achievements_active ON public.achievements(is_active);

-- =============================================================================
-- TRIGGER FUNCTIONS FOR AUTO-UPDATING TIMESTAMPS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for builder_stats table
CREATE TRIGGER update_builder_stats_updated_at
    BEFORE UPDATE ON public.builder_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- MIGRATION COMPLETION LOG
-- =============================================================================

-- Log this migration
INSERT INTO public.achievements (name, description, icon, tier, requirements, badge_color) 
VALUES ('Database Architect', 'Successfully deployed the Achievement System database schema', '🗄️', 1, '{"type": "special", "description": "Migration completed"}', 'blue')
ON CONFLICT (name) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Achievement System database migration completed successfully!';
  RAISE NOTICE 'Created tables: achievements, user_achievements, builder_stats';
  RAISE NOTICE 'Inserted % initial achievements', (SELECT COUNT(*) FROM public.achievements WHERE tier BETWEEN 1 AND 4);
END $$;
