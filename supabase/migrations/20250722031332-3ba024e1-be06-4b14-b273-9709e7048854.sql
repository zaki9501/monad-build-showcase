
-- Add missing columns to url_verifications table for enhanced security checks
ALTER TABLE public.url_verifications 
ADD COLUMN IF NOT EXISTS risk_level text CHECK (risk_level IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS security_checks jsonb;

-- Set default values for existing records
UPDATE public.url_verifications 
SET risk_level = 'unknown', security_checks = '{}'::jsonb 
WHERE risk_level IS NULL OR security_checks IS NULL;
