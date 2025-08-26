
-- Fix Twitter handles for Mission 5 projects to be proper URLs
UPDATE public.projects 
SET builder_twitter = 'https://x.com/' || REPLACE(builder_twitter, '@', '')
WHERE mission = 'Make NFTs Great Again (Mission 5)' 
  AND builder_twitter IS NOT NULL 
  AND builder_twitter != ''
  AND NOT builder_twitter LIKE 'http%';
