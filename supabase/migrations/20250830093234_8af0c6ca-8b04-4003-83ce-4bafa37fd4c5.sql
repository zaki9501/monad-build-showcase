-- Clean up newline characters and fix invalid thumbnail URLs
UPDATE projects 
SET 
  name = TRIM(REPLACE(name, E'\n', ' ')),
  thumbnail = CASE 
    WHEN thumbnail LIKE '/src/assets/projects/%' THEN 
      REPLACE(thumbnail, '/src/assets/projects/', '/lovable-uploads/')
    ELSE 
      TRIM(REPLACE(thumbnail, E'\n', ''))
  END
WHERE 
  thumbnail IS NOT NULL AND 
  (thumbnail LIKE '%' || E'\n' || '%' OR 
   name LIKE '%' || E'\n' || '%' OR 
   thumbnail LIKE '/src/assets/projects/%');