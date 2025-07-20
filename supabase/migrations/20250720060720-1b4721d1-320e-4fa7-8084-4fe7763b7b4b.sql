
-- Add the Monad Nebula project to Mission 4
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
  'Monad Nebula',
  'A 3D Monad Blockchain Visualizer',
  'constkurays',
  'kurayss',
  'https://x.com/constkurays',
  'Visualizer & Dashboard (Mission 4)',
  ARRAY['Visualizer', 'Mission 4'],
  'https://monad-nebula.vercel.app',
  '/lovable-uploads/68e18743-5e62-4f81-af29-67815ee75517.png'
);
