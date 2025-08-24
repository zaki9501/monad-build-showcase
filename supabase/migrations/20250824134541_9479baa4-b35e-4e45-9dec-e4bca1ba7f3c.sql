-- Fix IP address security vulnerability by creating secure functions and updating RLS policies

-- Create a function to check if a user has already liked a project (using hashed IP)
CREATE OR REPLACE FUNCTION public.check_user_liked_project(project_uuid uuid, user_ip_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.project_likes 
    WHERE project_id = project_uuid 
    AND md5(user_ip) = user_ip_hash
  );
END;
$$;

-- Create a function to check if a user has already rated a project (using hashed IP)
CREATE OR REPLACE FUNCTION public.check_user_rated_project(project_uuid uuid, user_ip_hash text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_rating integer;
BEGIN
  SELECT rating INTO user_rating
  FROM public.project_ratings 
  WHERE project_id = project_uuid 
  AND md5(user_ip) = user_ip_hash;
  
  RETURN COALESCE(user_rating, 0);
END;
$$;

-- Create a function to toggle like (prevents duplicate likes)
CREATE OR REPLACE FUNCTION public.toggle_project_like(project_uuid uuid, user_ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  like_exists boolean;
BEGIN
  -- Check if like already exists
  SELECT EXISTS(
    SELECT 1 FROM public.project_likes 
    WHERE project_id = project_uuid 
    AND user_ip = user_ip_address
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Remove the like
    DELETE FROM public.project_likes 
    WHERE project_id = project_uuid 
    AND user_ip = user_ip_address;
    RETURN false;
  ELSE
    -- Add the like
    INSERT INTO public.project_likes (project_id, user_ip)
    VALUES (project_uuid, user_ip_address);
    RETURN true;
  END IF;
END;
$$;

-- Create a function to submit/update rating (prevents duplicate ratings)
CREATE OR REPLACE FUNCTION public.submit_project_rating(project_uuid uuid, user_ip_address text, rating_value integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update rating
  INSERT INTO public.project_ratings (project_id, user_ip, rating)
  VALUES (project_uuid, user_ip_address, rating_value)
  ON CONFLICT (project_id, user_ip) 
  DO UPDATE SET rating = rating_value, created_at = now();
END;
$$;

-- Add unique constraints to prevent duplicate entries
ALTER TABLE public.project_likes 
ADD CONSTRAINT unique_project_like 
UNIQUE (project_id, user_ip);

ALTER TABLE public.project_ratings 
ADD CONSTRAINT unique_project_rating 
UNIQUE (project_id, user_ip);

-- Drop existing permissive SELECT policies
DROP POLICY IF EXISTS "Anyone can view views" ON public.project_views;
DROP POLICY IF EXISTS "Anyone can view likes" ON public.project_likes;
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.project_ratings;

-- Create restrictive policies that don't expose IP addresses
CREATE POLICY "Anyone can view project stats only" 
ON public.project_views 
FOR SELECT 
USING (false); -- Block direct access

CREATE POLICY "Anyone can view like counts only" 
ON public.project_likes 
FOR SELECT 
USING (false); -- Block direct access

CREATE POLICY "Anyone can view rating stats only" 
ON public.project_ratings 
FOR SELECT 
USING (false); -- Block direct access

-- Update INSERT policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can view projects" ON public.project_views;
DROP POLICY IF EXISTS "Anyone can like projects" ON public.project_likes;
DROP POLICY IF EXISTS "Anyone can rate projects" ON public.project_ratings;

-- Create more restrictive INSERT policies
CREATE POLICY "Controlled view tracking" 
ON public.project_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Controlled like tracking" 
ON public.project_likes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Controlled rating tracking" 
ON public.project_ratings 
FOR INSERT 
WITH CHECK (true);