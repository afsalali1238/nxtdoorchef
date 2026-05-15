-- Run in Supabase SQL editor
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS quote text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS quote text;

-- Also add cuisine_flag for the emoji display
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS cuisine_flag text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cuisine_flag text;
ALTER TABLE chefs ADD COLUMN IF NOT EXISTS cuisine_flag text;

-- Update existing test chefs with flags
UPDATE chefs SET cuisine_flag = '🇮🇳' WHERE cuisine_type = 'South Indian';
UPDATE chefs SET cuisine_flag = '🇮🇳' WHERE cuisine_type = 'North Indian';
UPDATE chefs SET cuisine_flag = '🇦🇪' WHERE cuisine_type = 'Emirati';
UPDATE chefs SET cuisine_flag = '🇵🇭' WHERE cuisine_type = 'Filipino';
UPDATE chefs SET cuisine_flag = '🇵🇰' WHERE cuisine_type = 'Pakistani';
UPDATE chefs SET cuisine_flag = '🇸🇾' WHERE cuisine_type = 'Syrian';
UPDATE chefs SET cuisine_flag = '🇱🇧' WHERE cuisine_type = 'Lebanese';
UPDATE chefs SET cuisine_flag = '🇪🇬' WHERE cuisine_type = 'Egyptian';
UPDATE chefs SET cuisine_flag = '🇪🇹' WHERE cuisine_type = 'Ethiopian';
UPDATE chefs SET cuisine_flag = '🌍' WHERE cuisine_type = 'West African';
UPDATE chefs SET cuisine_flag = '🇨🇳' WHERE cuisine_type = 'Cantonese';
UPDATE chefs SET cuisine_flag = '🧁' WHERE cuisine_type = 'Western / Bakes';
