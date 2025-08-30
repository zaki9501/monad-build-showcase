-- Fix incorrect mission values to be "Community"
UPDATE projects 
SET mission = 'Community' 
WHERE mission IN (
    'Upcoming integrations into swaps, governance, and advanced yield strategies.',
    'fully onchain r/place',
    'Build out of curiosity, no missions involved.'
);