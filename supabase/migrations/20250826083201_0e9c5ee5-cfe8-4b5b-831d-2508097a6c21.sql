
-- Add columns to store Twitter profile data
ALTER TABLE public.projects 
ADD COLUMN twitter_profile_picture TEXT,
ADD COLUMN twitter_bio TEXT,
ADD COLUMN twitter_data_fetched_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN twitter_verified BOOLEAN DEFAULT FALSE;

-- Create an index for faster lookups by Twitter data fetch time
CREATE INDEX idx_projects_twitter_data_fetched 
ON public.projects(twitter_data_fetched_at);
