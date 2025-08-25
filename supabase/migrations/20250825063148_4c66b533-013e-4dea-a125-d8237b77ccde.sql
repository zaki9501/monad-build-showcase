
-- Move the Monad GAY animals shooter project back to Mission 3
UPDATE public.projects 
SET mission = 'Break Monad v2: Farcaster Edition'
WHERE name ILIKE '%Monad GAY animals%' 
   OR name ILIKE '%Monagayanimals%'
   OR description ILIKE '%shooter%';
