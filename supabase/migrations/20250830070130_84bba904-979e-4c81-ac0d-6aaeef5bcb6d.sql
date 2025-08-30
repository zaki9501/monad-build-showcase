-- Remove the duplicate Monara NFT project (keeping the MONARA one with live URL)
DELETE FROM projects WHERE id = '0a3bebc4-1d77-4eb3-8efd-481e8ccce936';

-- Update the remaining MONARA project to ensure it has the correct GitHub URL
UPDATE projects 
SET github_url = 'https://github.com/Lesnak1/monara-nft'
WHERE id = '04b197f2-07bd-46f1-9b86-d00e96990116';