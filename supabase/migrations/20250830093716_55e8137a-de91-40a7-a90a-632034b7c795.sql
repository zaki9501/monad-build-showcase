-- Fix remaining invalid thumbnail paths and decode URLs
UPDATE projects 
SET thumbnail = CASE 
  -- Fix /src/assets/ paths that weren't caught before
  WHEN thumbnail LIKE '/src/assets/%' THEN 
    REPLACE(thumbnail, '/src/', '/lovable-uploads/')
  -- Handle lovable-uploads with encoded characters
  WHEN thumbnail LIKE '/lovable-uploads/%' THEN 
    REPLACE(REPLACE(thumbnail, '%20', ' '), '%', '')
  -- Keep valid external URLs as is
  ELSE thumbnail
END
WHERE thumbnail IS NOT NULL AND thumbnail != '';