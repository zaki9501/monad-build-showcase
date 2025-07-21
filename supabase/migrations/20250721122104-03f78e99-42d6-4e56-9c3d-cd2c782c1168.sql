
-- Add Bombandak project for Mission 5
INSERT INTO public.projects (
  name,
  description,
  builder_name,
  builder_discord,
  builder_twitter,
  mission,
  tags,
  github_url,
  live_url
) VALUES (
  'Bombandak',
  'Evolutive NFT Game, keep your Bombandak alive a long as you can by transfering it!',
  'sifu_lam',
  'sifu0620',
  'https://x.com/sifu_lam',
  'Mission 5',
  ARRAY['nft'],
  'https://github.com/Sifu213/bombandak',
  'https://bombandak.vercel.app/'
);

-- Add Monad NFT MCPs project for Mission 2
INSERT INTO public.projects (
  name,
  description,
  builder_name,
  builder_discord,
  builder_twitter,
  mission,
  tags,
  github_url,
  live_url
) VALUES (
  'Monad NFT MCPs',
  'Monad NFT MCPs ofr Claude',
  'sifu_lam',
  'sifu0620',
  'https://x.com/sifu_lam',
  'Mission 2',
  ARRAY['mcp', 'nft'],
  'https://github.com/Sifu213/monad-mcp-magiceden',
  'https://github.com/Sifu213/monad-mcp-magiceden'
);
