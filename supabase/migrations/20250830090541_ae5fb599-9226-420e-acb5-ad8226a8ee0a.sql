-- Update missing projects with proper tags
UPDATE projects SET tags = ARRAY['Swap', 'trending tokens', 'alerts'] 
WHERE name = 'NGLNad' AND tags IS NULL;

UPDATE projects SET tags = ARRAY['community tooling'] 
WHERE name = 'MonTools' AND tags IS NULL;

-- Insert missing projects if they don't exist
INSERT INTO projects (name, description, builder_name, builder_discord, builder_twitter, github_url, live_url, thumbnail, mission, tags)
SELECT 'Monad Swap', 'Get access to all Monad ecosystem tokens to swap in one click, set alerts for your favourite tokens, and check all trending tokens in your farcaster feed.', '', 'anikethpaul', 'https://x.com/Alphooor', 'https://github.com/anipaul2/MonadSwap', 'https://farcaster.xyz/miniapps/Sv3M9aLRLEjw/monadswap', NULL, 'Community', ARRAY['Swap', 'trending tokens', 'alerts']
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Monad Swap');

INSERT INTO projects (name, description, builder_name, builder_discord, builder_twitter, github_url, live_url, thumbnail, mission, tags)
SELECT 'Monbux', 'Monbux is a liquid staking platform built on the Monad Testnet. Users can stake their MON tokens and receive mMON, a transferable receipt token that represents their staked position.', '', '', '@Sukanto01874', 'https://github.com/Sukanto01899/monbux-lst-dapp', 'https://www.monbux.xyz/', 'https://i.ibb.co.com/S468CvdJ/Screenshot-20250828-045141-Telegram.jpg', 'Community', ARRAY['monad', 'stake', 'earn', 'liquidity']
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Monbux');

INSERT INTO projects (name, description, builder_name, builder_discord, builder_twitter, github_url, live_url, thumbnail, mission, tags)
SELECT 'Pixel Proto(cool)', 'create a community driven art board', '', '1134david', 'anon', 'private', 'https://www.pixelproto.cool/', NULL, 'Community', ARRAY['art', 'onchain', 'community', 'chaos']
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Pixel Proto(cool)');