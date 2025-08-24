
-- Insert Solodan NFT Launchpad project
INSERT INTO projects (
  name,
  description,
  builder_name,
  builder_discord,
  builder_twitter,
  github_url,
  live_url,
  tags,
  mission
) VALUES (
  'Solodan NFT Launchpad',
  'NFT launchpad on Monad chain',
  'solodanETH',
  'daniel_6773',
  'https://x.com/solodanETH',
  'https://github.com/Denend/monadLaunchpadFrontEnd',
  'https://launchpad.solodan.xyz',
  ARRAY['NFT', 'Launchpad', 'Mission 5'],
  'Make NFTs Great Again (Mission 5)'
);

-- Insert Monagayanimals project
INSERT INTO projects (
  name,
  description,
  builder_name,
  builder_discord,
  builder_twitter,
  github_url,
  live_url,
  tags,
  mission
) VALUES (
  'Monagayanimals',
  'Monad GAY animals shooter',
  'solodanETH',
  'daniel_6773',
  'https://x.com/solodanETH',
  'https://github.com/Denend/Monagaynanimas-farcaster-miniapp',
  'https://monagaynanimals.xyz/',
  ARRAY['Game', 'Shooter', 'Mission 3'],
  'Mission 3'
);
