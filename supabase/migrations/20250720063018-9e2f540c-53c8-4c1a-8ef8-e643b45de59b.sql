
-- Add the Monsweeper community project
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
  'Monsweeper',
  'longer you survive, more mon you get.',
  'boba',
  'boba',
  'https://x.com/0xbobaa',
  'Community',
  ARRAY['Game', 'Casino'],
  'https://monsweeper.xyz/',
  '/lovable-uploads/b72fb5f1-c7e9-4c7c-b29a-6ca5099741d4.png'
);
