-- ─────────────────────────────────────────────────────────────────────────────
-- Attendance Loop Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- Adds attendance_status to saved_events and a helper RPC that surfaces
-- "pending" events (past date, no response yet) for the nudge loop.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add attendance_status column to saved_events
--    NULL   = no response yet (default)
--    'attended' = user went
--    'missed'   = user did not go

ALTER TABLE saved_events
  ADD COLUMN IF NOT EXISTS attendance_status TEXT
    CHECK (attendance_status IN ('attended', 'missed'))
    DEFAULT NULL;

-- Index so the nudge query (status IS NULL AND event past) is fast
CREATE INDEX IF NOT EXISTS saved_events_attendance_idx
  ON saved_events (user_id, attendance_status)
  WHERE attendance_status IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RPC: get_pending_attendance(p_user_id)
--    Returns saved events where:
--      • the linked event's date has passed (event_date < TODAY)
--      • attendance_status is still NULL
--    Used by the frontend nudge prompt ("Did you make it to X?")
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_pending_attendance(p_user_id UUID)
RETURNS TABLE (
  saved_event_id  UUID,
  event_id        UUID,
  title           TEXT,
  event_date      DATE,
  place           TEXT,
  saved_at        TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    se.id            AS saved_event_id,
    e.id             AS event_id,
    e.title,
    e.event_date::DATE,
    e.place,
    se.saved_at
  FROM saved_events se
  JOIN events e ON e.id = se.event_id
  WHERE se.user_id           = p_user_id
    AND se.attendance_status IS NULL
    AND e.event_date::DATE   < CURRENT_DATE
  ORDER BY e.event_date DESC;
$$;

-- Allow authenticated users to call this RPC for their own data
GRANT EXECUTE ON FUNCTION get_pending_attendance(UUID) TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. RPC: get_attendance_stats(p_user_id)
--    Aggregate for the North Star dashboard:
--      total_saved, total_attended, total_missed, pending_response
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_attendance_stats(p_user_id UUID)
RETURNS TABLE (
  total_saved       BIGINT,
  total_attended    BIGINT,
  total_missed      BIGINT,
  pending_response  BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    COUNT(*)                                                         AS total_saved,
    COUNT(*) FILTER (WHERE se.attendance_status = 'attended')       AS total_attended,
    COUNT(*) FILTER (WHERE se.attendance_status = 'missed')         AS total_missed,
    COUNT(*) FILTER (
      WHERE se.attendance_status IS NULL
        AND e.event_date::DATE < CURRENT_DATE
    )                                                                AS pending_response
  FROM saved_events se
  JOIN events e ON e.id = se.event_id
  WHERE se.user_id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION get_attendance_stats(UUID) TO authenticated;
