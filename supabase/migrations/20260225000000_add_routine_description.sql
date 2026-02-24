-- Add optional description to routines
ALTER TABLE routines ADD COLUMN IF NOT EXISTS description TEXT;
