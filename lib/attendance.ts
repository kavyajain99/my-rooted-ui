import { createBrowserClient } from '@supabase/ssr'

export type AttendanceStatus = 'attended' | 'missed' | null

export interface PendingAttendanceRow {
  saved_event_id: string
  event_id: string
  title: string
  event_date: string   // YYYY-MM-DD
  place: string | null
  saved_at: string
}

export interface AttendanceStats {
  total_saved: number
  total_attended: number
  total_missed: number
  pending_response: number
}

function client() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** Events the user saved whose date has passed with no attendance response yet. */
export async function getPendingAttendance(userId: string): Promise<PendingAttendanceRow[]> {
  const { data, error } = await client().rpc('get_pending_attendance', { p_user_id: userId })
  if (error) throw error
  return (data ?? []) as PendingAttendanceRow[]
}

/** North Star aggregate: saved / attended / missed / pending counts. */
export async function getAttendanceStats(userId: string): Promise<AttendanceStats> {
  const { data, error } = await client().rpc('get_attendance_stats', { p_user_id: userId })
  if (error) throw error
  const row = (data as AttendanceStats[])?.[0]
  return row ?? { total_saved: 0, total_attended: 0, total_missed: 0, pending_response: 0 }
}

/** Mark a single saved_event as attended or missed. */
export async function markAttendance(
  savedEventId: string,
  status: 'attended' | 'missed'
): Promise<void> {
  const { error } = await client()
    .from('saved_events')
    .update({ attendance_status: status })
    .eq('id', savedEventId)
  if (error) throw error
}
