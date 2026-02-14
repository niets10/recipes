-- 1. Create the recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Automatically grabs the logged-in user's ID
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create an index for performance 
CREATE INDEX idx_recipes_user_id 
ON recipes 
USING btree (user_id);

-- 3. Turn on Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- 4. Set up the Private Rules (Optimized Policies)

-- View: Only the author can see their own recipes
CREATE POLICY "Users can view their own recipes"
ON recipes FOR SELECT
TO authenticated
USING ( (select auth.uid()) = user_id );

-- Create: Only the author can create
CREATE POLICY "Users can create their own recipes"
ON recipes FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid()) = user_id );

-- Edit: Only the author can update
CREATE POLICY "Users can update their own recipes"
ON recipes FOR UPDATE
TO authenticated
USING ( (select auth.uid()) = user_id )
WITH CHECK ( (select auth.uid()) = user_id );

-- Delete: Only the author can delete
CREATE POLICY "Users can delete their own recipes"
ON recipes FOR DELETE
TO authenticated
USING ( (select auth.uid()) = user_id );