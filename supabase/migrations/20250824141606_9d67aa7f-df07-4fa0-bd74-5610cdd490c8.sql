
-- Remove all Mission 2 projects from the database
DELETE FROM public.projects WHERE mission = 'Mission 2';

-- Also remove any projects that might have 'MCP' in their mission field
DELETE FROM public.projects WHERE mission ILIKE '%MCP%';
