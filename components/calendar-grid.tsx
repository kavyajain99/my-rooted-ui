"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface CalendarGridProps {
  year: number
  month: number          // 0 = January … 11 = December
  onEventClick: (event: any) => void
  events: any[]
}

const DAYS_OF_WEEK  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES   = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

function getVibeFromEnergy(energyData: any): string {
  const label = typeof energyData === "string" ? energyData : (energyData?.label || "")
  const e = label.toLowerCase()
  if (e.includes("kinetic") || e.includes("athletic") || e.includes("festive")) return "kinetic"
  if (e.includes("introspective") || e.includes("spiritual") || e.includes("mindful") || e.includes("chill")) return "introspective"
  if (e.includes("cocreative") || e.includes("creative") || e.includes("culinary")) return "cocreative"
  return "parallel"
}

const VIBE_CHIP: Record<string, { bg: string; text: string }> = {
  introspective: { bg: "rgba(122,139,124,0.15)", text: "#4a5e4c" },
  parallel:      { bg: "rgba(212,163,115,0.18)", text: "#7a5a2a" },
  cocreative:    { bg: "rgba(179,139,109,0.18)", text: "#6b4a2a" },
  kinetic:       { bg: "rgba(196,120,92,0.18)",  text: "#7a3a1e" },
}

const VIBE_CELL_BG: Record<string, string> = {
  introspective: "bg-[#7A8B7C]/8",
  parallel:      "bg-[#D4A373]/8",
  cocreative:    "bg-[#B38B6D]/8",
  kinetic:       "bg-[#C4785C]/8",
}

const VIBE_LEGEND = [
  { key: "introspective", label: "Introspective",  dot: "#7A8B7C" },
  { key: "cocreative",    label: "Co-creative",    dot: "#B38B6D" },
  { key: "kinetic",       label: "Kinetic",        dot: "#C4785C" },
  { key: "parallel",      label: "Social / Mixed", dot: "#D4A373" },
]

const MAX_VISIBLE = 2

export function CalendarGrid({ year, month, onEventClick, events = [] }: CalendarGridProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDay    = new Date(year, month, 1).getDay()
  const totalCells  = Math.ceil((startDay + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - startDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end px-1">
        <h2 className="font-display text-5xl capitalize text-[#2F3E46] tracking-tighter">
          {MONTH_NAMES[month]} <span className="opacity-30">{year}</span>
        </h2>
        <span className="text-[10px] uppercase font-bold text-[#2F3E46]/30 tracking-[0.2em] pb-2">
          Houston, TX
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
        {VIBE_LEGEND.map(({ key, label, dot }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2F3E46]/40">{label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-hidden rounded-[2rem] border border-white/30 bg-white/30 backdrop-blur-sm shadow-sm">

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-black/5 bg-white/20">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#2F3E46]/40">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayEvents = day
              ? events.filter(e => {
                  const src = e.event_date || e.raw_json?.event_date || e.raw_json?.date
                  if (!src) return false
                  const d = new Date(src)
                  return d.getUTCDate() === day && d.getUTCMonth() === month && d.getUTCFullYear() === year
                })
              : []

            const visible  = dayEvents.slice(0, MAX_VISIBLE)
            const overflow = dayEvents.length - MAX_VISIBLE
            const vibe     = visible.length > 0
              ? getVibeFromEnergy(visible[0].social_energy || visible[0].raw_json?.social_energy)
              : null

            const isLastRow = idx >= totalCells - 7
            const isLastCol = (idx + 1) % 7 === 0

            return (
              <div
                key={idx}
                className={[
                  "min-h-[130px] p-3 transition-colors duration-200",
                  !isLastRow ? "border-b border-black/5" : "",
                  !isLastCol ? "border-r border-black/5" : "",
                  day && vibe ? VIBE_CELL_BG[vibe] : day ? "bg-white/10" : "bg-black/[0.02]",
                ].join(" ")}
              >
                {day && (
                  <div className="flex flex-col h-full gap-2">
                    <div className="flex flex-col items-start gap-1 leading-none">
                      <span
                        className="font-display text-sm font-bold leading-none transition-opacity duration-200"
                        style={{ color: "#2F3E46", opacity: dayEvents.length > 0 ? 0.7 : 0.2 }}
                      >
                        {day}
                      </span>
                      {dayEvents.length > 0 && vibe && (
                        <span
                          className="block w-1 h-1 rounded-full"
                          style={{ backgroundColor: VIBE_CHIP[vibe].text, opacity: 0.6 }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                      {visible.map(event => {
                        const v    = getVibeFromEnergy(event.social_energy || event.raw_json?.social_energy)
                        const chip = VIBE_CHIP[v]
                        const data = event.raw_json || event
                        const tip  = data.vibe_check || data.description || null
                        return (
                          <Tooltip key={event.id}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onEventClick(event)}
                                className="w-full text-left rounded-lg px-2.5 py-2 transition-all duration-150 hover:brightness-95 active:scale-[0.98] cursor-pointer"
                                style={{ backgroundColor: chip.bg }}
                              >
                                <span
                                  className="block text-[11px] font-bold leading-snug line-clamp-2"
                                  style={{ color: chip.text }}
                                >
                                  {event.title}
                                </span>
                              </button>
                            </TooltipTrigger>
                            {tip && (
                              <TooltipContent
                                side="top"
                                className="max-w-[220px] rounded-xl px-3 py-2.5 text-[11px] leading-snug bg-[#2F3E46] text-[#F4F1EA] border-0 shadow-xl"
                              >
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Why this for you</p>
                                {tip}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        )
                      })}

                      {overflow > 0 && (
                        <button
                          onClick={() => onEventClick(dayEvents[MAX_VISIBLE])}
                          className="w-full text-left px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2F3E46]/40 hover:text-[#2F3E46]/70 transition-colors"
                        >
                          +{overflow} more
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
