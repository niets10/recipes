-- Relate recipes to daily_statistics
-- Junction table: which recipes were consumed on a given day (linked to daily_statistics).
-- Run after "Create Recipe table and RLS.sql" and "Create Fitness tables.sql".

-- daily_recipe_entries: recipes logged per day (for nutrition / meal tracking)
CREATE TABLE daily_recipe_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_statistic_id UUID NOT NULL REFERENCES daily_statistics(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL DEFAULT 'other' CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'other')),
  servings NUMERIC DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_recipe_entries_daily_statistic_id ON daily_recipe_entries USING btree (daily_statistic_id);
CREATE INDEX idx_daily_recipe_entries_recipe_id ON daily_recipe_entries USING btree (recipe_id);
CREATE INDEX idx_daily_recipe_entries_meal_type ON daily_recipe_entries (daily_statistic_id, meal_type);

ALTER TABLE daily_recipe_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view daily_recipe_entries for own daily_statistics"
  ON daily_recipe_entries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));

CREATE POLICY "Users can insert daily_recipe_entries for own daily_statistics"
  ON daily_recipe_entries FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));

CREATE POLICY "Users can update daily_recipe_entries for own daily_statistics"
  ON daily_recipe_entries FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));

CREATE POLICY "Users can delete daily_recipe_entries for own daily_statistics"
  ON daily_recipe_entries FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
