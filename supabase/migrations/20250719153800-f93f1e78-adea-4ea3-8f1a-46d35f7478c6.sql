
-- Create table for URL verifications
CREATE TABLE public.url_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_safe BOOLEAN NOT NULL DEFAULT false,
  reason TEXT,
  last_checked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster URL lookups
CREATE INDEX idx_url_verifications_url ON public.url_verifications(url);
CREATE INDEX idx_url_verifications_last_checked ON public.url_verifications(last_checked);

-- Enable RLS (this table can be read by anyone since it's public safety info)
ALTER TABLE public.url_verifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read verification results
CREATE POLICY "Anyone can view URL verifications" 
  ON public.url_verifications 
  FOR SELECT 
  TO public 
  USING (true);

-- Only allow the service role to insert/update (edge function will use service role)
CREATE POLICY "Service role can manage URL verifications" 
  ON public.url_verifications 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
