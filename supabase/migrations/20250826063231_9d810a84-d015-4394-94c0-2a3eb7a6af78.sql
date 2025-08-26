
-- Standardize all Mission 5 project names to use consistent naming
UPDATE public.projects 
SET mission = 'Make NFTs Great Again (Mission 5)'
WHERE mission = 'Mission 5' OR mission LIKE '%Mission 5%';
