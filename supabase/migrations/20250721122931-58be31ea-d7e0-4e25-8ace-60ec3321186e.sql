
-- Add Retrieve NFT holders project for Community category
INSERT INTO public.projects (
  name,
  description,
  builder_name,
  builder_discord,
  builder_twitter,
  mission,
  tags,
  live_url,
  thumbnail
) VALUES (
  'Retrieve NFT holders',
  'Retrieve NFT holders easily with differents modes',
  'sifu_lam',
  'sifu0620',
  'https://x.com/sifu_lam',
  'Community',
  ARRAY['nft', 'holders'],
  'https://purplemint.xyz/nft-owners',
  'https://purplemint.xyz/img/purple-mint-white.svg'
);
