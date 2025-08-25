
-- Move the Monad GAY animals shooter project to Community category
UPDATE public.projects 
SET mission = 'Community'
WHERE name ILIKE '%Monad GAY animals%' 
   OR name ILIKE '%Monagayanimals%'
   OR name ILIKE '%shooter%';
