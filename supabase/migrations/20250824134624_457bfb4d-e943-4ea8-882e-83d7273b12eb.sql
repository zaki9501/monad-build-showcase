-- Fix function search path security warnings by setting search_path for all functions
CREATE OR REPLACE FUNCTION public.get_project_stats(project_uuid uuid)
 RETURNS TABLE(likes_count bigint, views_count bigint, avg_rating numeric, rating_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.project_likes WHERE project_id = project_uuid) as likes_count,
    (SELECT COUNT(*) FROM public.project_views WHERE project_id = project_uuid) as views_count,
    (SELECT ROUND(AVG(rating), 1) FROM public.project_ratings WHERE project_id = project_uuid) as avg_rating,
    (SELECT COUNT(*) FROM public.project_ratings WHERE project_id = project_uuid) as rating_count;
END;
$function$;

-- Fix search path for other functions
CREATE OR REPLACE FUNCTION public.check_user_liked_project(project_uuid uuid, user_ip_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.project_likes 
    WHERE project_id = project_uuid 
    AND md5(user_ip) = user_ip_hash
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_user_rated_project(project_uuid uuid, user_ip_hash text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.toggle_project_like(project_uuid uuid, user_ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.submit_project_rating(project_uuid uuid, user_ip_address text, rating_value integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update rating
  INSERT INTO public.project_ratings (project_id, user_ip, rating)
  VALUES (project_uuid, user_ip_address, rating_value)
  ON CONFLICT (project_id, user_ip) 
  DO UPDATE SET rating = rating_value, created_at = now();
END;
$$;