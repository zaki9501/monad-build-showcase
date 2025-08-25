
-- Update the project to move it from Mission 1 to Community category
UPDATE public.projects 
SET mission = 'Community'
WHERE name = 'Onchain AI assistant for Monad eco' 
   OR name ILIKE '%AI assistant%' 
   OR name ILIKE '%Monad AI%'
   OR mission = 'Mission 1';
