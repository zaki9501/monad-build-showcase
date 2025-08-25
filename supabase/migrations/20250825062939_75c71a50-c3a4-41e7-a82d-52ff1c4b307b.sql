
-- Move the Bombandak project to the standard Mission 5 category
UPDATE public.projects 
SET mission = 'Make NFTs Great Again (Mission 5)'
WHERE name ILIKE '%Bombandak%' 
   OR name ILIKE '%Evolutive NFT Game%'
   OR description ILIKE '%Bombandak%';
