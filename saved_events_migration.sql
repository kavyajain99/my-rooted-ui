-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS saved_events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id   UUID        NOT NULL REFERENCES events(id)    ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS saved_events_user_id_idx ON saved_events(user_id);

-- Row-level security: users can only see and manage their own saved events
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own saved events"
  ON saved_events
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
