-- Fitness and Statistics schema
-- All tables use user_id with RLS; order respects FK dependencies.

-- 1. gym_exercises
CREATE TABLE gym_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT,
  comments TEXT,
  body_part TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_gym_exercises_user_id ON gym_exercises USING btree (user_id);
ALTER TABLE gym_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gym_exercises" ON gym_exercises FOR SELECT TO authenticated USING ( (select auth.uid()) = user_id);
CREATE POLICY "Users can create own gym_exercises" ON gym_exercises FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can update own gym_exercises" ON gym_exercises FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id) WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can delete own gym_exercises" ON gym_exercises FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id);

-- 2. activities
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT,
  time_minutes INTEGER,
  calories INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_activities_user_id ON activities USING btree (user_id);
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activities" ON activities FOR SELECT TO authenticated USING ( (select auth.uid()) = user_id);
CREATE POLICY "Users can create own activities" ON activities FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can update own activities" ON activities FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id) WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can delete own activities" ON activities FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id);

-- 3. routines
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_routines_user_id ON routines USING btree (user_id);
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own routines" ON routines FOR SELECT TO authenticated USING ( (select auth.uid()) = user_id);
CREATE POLICY "Users can create own routines" ON routines FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can update own routines" ON routines FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id) WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can delete own routines" ON routines FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id);

-- 4. routine_exercises (routine + gym_exercise with optional overrides)
CREATE TABLE routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  gym_exercise_id UUID NOT NULL REFERENCES gym_exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  sets_override INTEGER,
  reps_override INTEGER,
  weight_override NUMERIC,
  comments_override TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_routine_exercises_routine_id ON routine_exercises USING btree (routine_id);
ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view routine_exercises for own routines"
  ON routine_exercises FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM routines r WHERE r.id = routine_id AND r.user_id = (select auth.uid())));
CREATE POLICY "Users can insert routine_exercises for own routines"
  ON routine_exercises FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM routines r WHERE r.id = routine_id AND r.user_id = (select auth.uid())));
CREATE POLICY "Users can update routine_exercises for own routines"
  ON routine_exercises FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM routines r WHERE r.id = routine_id AND r.user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM routines r WHERE r.id = routine_id AND r.user_id = (select auth.uid())));
CREATE POLICY "Users can delete routine_exercises for own routines"
  ON routine_exercises FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM routines r WHERE r.id = routine_id AND r.user_id = (select auth.uid())));

-- 5. daily_statistics (one row per user per day)
CREATE TABLE daily_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  date DATE NOT NULL,
  calories_ingested NUMERIC,
  proteins NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  steps INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);
CREATE INDEX idx_daily_statistics_user_id ON daily_statistics USING btree (user_id);
CREATE INDEX idx_daily_statistics_date ON daily_statistics USING btree (date);
ALTER TABLE daily_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own daily_statistics" ON daily_statistics FOR SELECT TO authenticated USING ( (select auth.uid()) = user_id);
CREATE POLICY "Users can create own daily_statistics" ON daily_statistics FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can update own daily_statistics" ON daily_statistics FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id) WITH CHECK ( (select auth.uid()) = user_id);
CREATE POLICY "Users can delete own daily_statistics" ON daily_statistics FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id);

-- 6. daily_routine_entries ("this routine was done on this day")
CREATE TABLE daily_routine_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_statistic_id UUID NOT NULL REFERENCES daily_statistics(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_daily_routine_entries_daily_statistic_id ON daily_routine_entries USING btree (daily_statistic_id);
ALTER TABLE daily_routine_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view daily_routine_entries for own daily_statistics"
  ON daily_routine_entries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can insert daily_routine_entries for own daily_statistics"
  ON daily_routine_entries FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can update daily_routine_entries for own daily_statistics"
  ON daily_routine_entries FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can delete daily_routine_entries for own daily_statistics"
  ON daily_routine_entries FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));

-- 7. daily_routine_entry_exercises (exercises performed for that routine on that day)
CREATE TABLE daily_routine_entry_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_routine_entry_id UUID NOT NULL REFERENCES daily_routine_entries(id) ON DELETE CASCADE,
  gym_exercise_id UUID NOT NULL REFERENCES gym_exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  weight NUMERIC,
  comments TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_daily_routine_entry_exercises_entry_id ON daily_routine_entry_exercises USING btree (daily_routine_entry_id);
ALTER TABLE daily_routine_entry_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view daily_routine_entry_exercises for own entries"
  ON daily_routine_entry_exercises FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM daily_routine_entries dre
    JOIN daily_statistics ds ON ds.id = dre.daily_statistic_id
    WHERE dre.id = daily_routine_entry_id AND ds.user_id = (select auth.uid())
  ));
CREATE POLICY "Users can insert daily_routine_entry_exercises for own entries"
  ON daily_routine_entry_exercises FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM daily_routine_entries dre
    JOIN daily_statistics ds ON ds.id = dre.daily_statistic_id
    WHERE dre.id = daily_routine_entry_id AND ds.user_id = (select auth.uid())
  ));
CREATE POLICY "Users can update daily_routine_entry_exercises for own entries"
  ON daily_routine_entry_exercises FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM daily_routine_entries dre
    JOIN daily_statistics ds ON ds.id = dre.daily_statistic_id
    WHERE dre.id = daily_routine_entry_id AND ds.user_id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM daily_routine_entries dre
    JOIN daily_statistics ds ON ds.id = dre.daily_statistic_id
    WHERE dre.id = daily_routine_entry_id AND ds.user_id = (select auth.uid())
  ));
CREATE POLICY "Users can delete daily_routine_entry_exercises for own entries"
  ON daily_routine_entry_exercises FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM daily_routine_entries dre
    JOIN daily_statistics ds ON ds.id = dre.daily_statistic_id
    WHERE dre.id = daily_routine_entry_id AND ds.user_id = (select auth.uid())
  ));

-- 8. daily_activity_entries
CREATE TABLE daily_activity_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_statistic_id UUID NOT NULL REFERENCES daily_statistics(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  time_minutes INTEGER,
  calories INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_daily_activity_entries_daily_statistic_id ON daily_activity_entries USING btree (daily_statistic_id);
ALTER TABLE daily_activity_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view daily_activity_entries for own daily_statistics"
  ON daily_activity_entries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can insert daily_activity_entries for own daily_statistics"
  ON daily_activity_entries FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can update daily_activity_entries for own daily_statistics"
  ON daily_activity_entries FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can delete daily_activity_entries for own daily_statistics"
  ON daily_activity_entries FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));

-- 9. daily_gym_exercise_entries (standalone exercises logged that day)
CREATE TABLE daily_gym_exercise_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_statistic_id UUID NOT NULL REFERENCES daily_statistics(id) ON DELETE CASCADE,
  gym_exercise_id UUID NOT NULL REFERENCES gym_exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  weight NUMERIC,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_daily_gym_exercise_entries_daily_statistic_id ON daily_gym_exercise_entries USING btree (daily_statistic_id);
ALTER TABLE daily_gym_exercise_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view daily_gym_exercise_entries for own daily_statistics"
  ON daily_gym_exercise_entries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can insert daily_gym_exercise_entries for own daily_statistics"
  ON daily_gym_exercise_entries FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can update daily_gym_exercise_entries for own daily_statistics"
  ON daily_gym_exercise_entries FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
CREATE POLICY "Users can delete daily_gym_exercise_entries for own daily_statistics"
  ON daily_gym_exercise_entries FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM daily_statistics ds WHERE ds.id = daily_statistic_id AND ds.user_id = (select auth.uid())));
