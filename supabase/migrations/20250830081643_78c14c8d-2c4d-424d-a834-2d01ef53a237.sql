-- Standardize Mission 5 names to use consistent naming
UPDATE projects 
SET mission = 'Mission 5' 
WHERE mission = 'Make NFTs Great Again (Mission 5)';

-- Also standardize Mission 4 names to be consistent
UPDATE projects 
SET mission = 'Mission 4' 
WHERE mission = 'Visualizer & Dashboard (Mission 4)';

-- Standardize Mission 3 name
UPDATE projects 
SET mission = 'Mission 3' 
WHERE mission = 'Break Monad v2: Farcaster Edition';