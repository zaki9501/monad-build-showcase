
INSERT INTO projects (
  id,
  name,
  description,
  builder_name,
  builder_discord,
  builder_twitter,
  thumbnail,
  github_url,
  live_url,
  tags,
  mission,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'MonGPT',
  'MonGPT is a next-generation AI assistant designed to operate natively within the Monad ecosystem. It leverages the synthesis of the world''s most powerful language models to provide unparalleled analysis for developers, security researchers, and users on the Monad blockchain. MonGPT is engineered with a specialized focus on the needs of the Web3 security and development community. It is powered by OPENAI''s GPT-4o for the Brain, and DALL·E 3 For the Image Generation. It is feed by Monad Public Knowledgebase so you can ask anything about Monad.',
  'marksocrates',
  '@marksocrates',
  'https://x.com/markweirdo11',
  '/lovable-uploads/mongpt-placeholder.png',
  'https://github.com/marksocrates1111/mongpt-dapp',
  NULL,
  ARRAY['AI', 'GPT', 'AGENT', 'CHATBOT'],
  'Community',
  NOW(),
  NOW()
);
