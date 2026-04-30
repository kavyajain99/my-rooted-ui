"use client"

import { Leaf, X, ThumbsUp, ThumbsDown } from "lucide-react"

interface SavedLeavesCardProps {
  savedEvents: any[]
  onUnsave: (eventId: string) => void
  onEventClick: (event: any) => void
  onAttendance: (savedId: string, status: "attended" | "missed") => void
}

export function SavedLeavesCard({ savedEvents, onUnsave, onEventClick, onAttendance }: SavedLeavesCardProps) {
  const today = new Date()

  return (
    <div className="bg-white/40 dark:bg-[#1F2E36] backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-sm dark:shadow-black/30 space-y-4">
      <div className="flex items-center gap-2">
        <Leaf className="w-3 h-3 text-[#2C6B5F] dark:text-[#7AAF9F]" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40 dark:text-[#D4C8B8]">Your Leaves</p>
      </div>

      {savedEvents.length === 0 ? (
        <p className="text-xs text-[#2F3E46]/40 dark:text-[#C4B8A8] italic leading-relaxed">
          No events planted yet. Find something you love and tap "Plant This."
        </p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {savedEvents.map((event) => {
            const data       = event.raw_json || event
            const title      = data.title || event.title || "Untitled Event"
            const rawDate    = data.event_date || event.event_date
            const isPast     = rawDate ? new Date(rawDate) < today : false
            const status     = event._attendanceStatus as "attended" | "missed" | null | undefined
            const savedId    = event._savedId as string | undefined
            const dateDisplay = rawDate
              ? new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
              : null

            return (
              <div key={event.id} className="group space-y-1.5">
                <div className="flex items-center gap-2">
                  <Leaf className="w-3 h-3 text-[#2C6B5F] shrink-0 opacity-60" />
                  <button
                    onClick={() => onEventClick(event)}
                    className="flex-1 min-w-0 text-left text-xs font-semibold text-[#2F3E46] dark:text-[#EAE0D0] truncate hover:text-[#2C6B5F] dark:hover:text-[#2C6B5F] transition-colors"
                  >
                    {title}
                  </button>
                  {dateDisplay && (
                    <span className="text-[10px] text-[#2F3E46]/30 dark:text-[#A89880]/60 shrink-0 tabular-nums">
                      {dateDisplay}
                    </span>
                  )}
                  <button
                    onClick={() => onUnsave(event.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0"
                    title="Remove"
                  >
                    <X className="w-3 h-3 text-[#2F3E46]/40 dark:text-[#A89880]/60" />
                  </button>
                </div>

                {/* Post-event attendance prompt */}
                {isPast && savedId && !status && (
                  <div className="ml-5 flex items-center gap-2">
                    <span className="text-[10px] text-[#2F3E46]/35 dark:text-[#A89880]/60">Did you go?</span>
                    <button
                      onClick={() => onAttendance(savedId, "attended")}
                      className="p-1 rounded-lg hover:bg-[#2C6B5F]/10 transition-colors"
                      title="I went"
                    >
                      <ThumbsUp className="w-3 h-3 text-[#2C6B5F]/60 hover:text-[#2C6B5F]" />
                    </button>
                    <button
                      onClick={() => onAttendance(savedId, "missed")}
                      className="p-1 rounded-lg hover:bg-[#B05C5C]/10 transition-colors"
                      title="I missed it"
                    >
                      <ThumbsDown className="w-3 h-3 text-[#2F3E46]/30 hover:text-[#B05C5C]" />
                    </button>
                  </div>
                )}

                {/* Confirmed attendance badge */}
                {isPast && status === "attended" && (
                  <div className="ml-5 flex items-center gap-1.5">
                    <ThumbsUp className="w-3 h-3 text-[#2C6B5F]" />
                    <span className="text-[10px] font-bold text-[#2C6B5F]/70 uppercase tracking-[0.15em]">Attended</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
