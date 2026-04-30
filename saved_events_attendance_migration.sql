-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Adds attendance tracking to saved_events for the North Star metric

ALTER TABLE public.saved_events
  ADD COLUMN IF NOT EXISTS attendance_status text DEFAULT NULL,
  ADD CONSTRAINT saved_events_attendance_check
    CHECK (attendance_status IN ('attended', 'missed'));

-- Partial index: quickly find saved events that still need a follow-up prompt
CREATE INDEX IF NOT EXISTS saved_events_needs_followup_idx
  ON public.saved_events (user_id)
  WHERE attendance_status IS NULL;
