"use client"

interface CalendarGridProps {
  month: "january" | "february"
  onEventClick: (event: any) => void
  events: any[]
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const MONTH_CONFIG = {
  january: { year: 2026, daysInMonth: 31, startDay: 4, monthIdx: 0 },
  february: { year: 2026, daysInMonth: 28, startDay: 0, monthIdx: 1 },
}

/**
 * Normalizes Supabase 'social_energy' to the vibe system
 */
function getVibeFromEnergy(energy: string = ""): string {
  const e = energy.toLowerCase()
  if (e.includes('kinetic') || e.includes('high')) return "kinetic"
  if (e.includes('introspective') || e.includes('meditation')) return "introspective"
  if (e.includes('cocreative') || e.includes('community')) return "cocreative"
  return "parallel"
}

function getVibeColor(vibe: string): string {
  switch (vibe) {
    case "introspective": return "bg-vibe-introspective"
    case "parallel": return "bg-vibe-parallel"
    case "cocreative": return "bg-vibe-cocreative"
    case "kinetic": return "bg-vibe-kinetic"
    default: return "bg-primary"
  }
}

function getVibeBgColor(vibe: string): string {
  switch (vibe) {
    case "introspective": return "bg-[#7A8B7C]/10"
    case "parallel": return "bg-[#D4A373]/10"
    case "cocreative": return "bg-[#B38B6D]/10"
    case "kinetic": return "bg-[#C4785C]/10"
    default: return "bg-card"
  }
}

export function CalendarGrid({ month, onEventClick, events = [] }: CalendarGridProps) {
  const config = MONTH_CONFIG[month]
  const totalCells = Math.ceil((config.startDay + config.daysInMonth) / 7) * 7
  
  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - config.startDay + 1
    return dayNumber > 0 && dayNumber <= config.daysInMonth ? dayNumber : null
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Month & City Header */}
      <div className="flex justify-between items-end px-2">
        <h2 className="font-display text-5xl capitalize text-[#2F3E46] tracking-tighter">
          {month} <span className="opacity-30">2026</span>
        </h2>
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] pb-2">
          Houston, TX
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/40 backdrop-blur-md shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="px-2 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            // THE FIX: We split the date string to get exact Year/Month/Day 
            // to prevent the "Missing 3rd Event" time-zone shift.
            const dayEvents = events.filter((e) => {
              if (!e.event_date || !day) return false

              // 1. Format the grid day to match DB format (YYYY-MM-DD)
              // We pad with a leading zero if the day/month is a single digit
              const year = config.year
              const monthStr = String(config.monthIdx + 1).padStart(2, '0')
              const dayStr = String(day).padStart(2, '0')
              const dateString = `${year}-${monthStr}-${dayStr}`

              // 2. Direct string comparison
              // This ignores time zones entirely. If the text matches, the event shows up.
              return e.event_date.startsWith(dateString)
            })

            const isWeekend = index % 7 === 0 || index % 7 === 6
            const dominantVibe = dayEvents.length > 0 ? getVibeFromEnergy(dayEvents[0].social_energy) : null
            
            return (
              <div
                key={index}
                className={`min-h-[110px] border-b border-r border-border p-3 transition-colors ${
                  day ? (dominantVibe ? getVibeBgColor(dominantVibe) : "bg-card/50") : "bg-muted/5"
                }`}
              >
                {day && (
                  <>
                    <span className="font-display text-sm opacity-30">{day}</span>
                    <div className="mt-3 space-y-2">
                      {dayEvents.map((event) => {
                        const vibe = getVibeFromEnergy(event.social_energy)
                        return (
                          <button
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className="group flex w-full items-start gap-2 text-left transition-transform hover:translate-x-1"
                          >
                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getVibeColor(vibe)} shadow-sm`} />
                            <span className="text-[11px] leading-tight font-medium line-clamp-2 text-[#2F3E46] group-hover:text-primary transition-colors">
                              {event.title}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}