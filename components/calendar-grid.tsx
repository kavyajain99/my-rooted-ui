"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Moon, Palette, Activity, Coffee, ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarGridProps {
  year: number
  month: number          // 0 = January … 11 = December
  onEventClick: (event: any) => void
  events: any[]
  onPrev?: () => void
  onNext?: () => void
}

const DAYS_OF_WEEK  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAYS_SHORT    = ["S", "M", "T", "W", "T", "F", "S"]
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

// Higher-contrast chip colors for dark mode
const VIBE_CHIP_DARK: Record<string, { bg: string; text: string }> = {
  introspective: { bg: "rgba(122,139,124,0.28)", text: "#B8CDB8" },
  parallel:      { bg: "rgba(212,163,115,0.28)", text: "#D4A877" },
  cocreative:    { bg: "rgba(179,139,109,0.28)", text: "#C49870" },
  kinetic:       { bg: "rgba(196,120,92,0.32)",  text: "#D4906E" },
}

const VIBE_DOT: Record<string, string> = {
  introspective: "#7A8B7C",
  parallel:      "#D4A373",
  cocreative:    "#B38B6D",
  kinetic:       "#C4785C",
}

const VIBE_CELL_BG: Record<string, string> = {
  introspective: "bg-[#7A8B7C]/8",
  parallel:      "bg-[#D4A373]/8",
  cocreative:    "bg-[#B38B6D]/8",
  kinetic:       "bg-[#C4785C]/8",
}

const VIBE_LEGEND = [
  { key: "introspective", label: "Introspective", dot: "#7A8B7C", icon: Moon,     description: "Quieter, personal events — meditation, journaling, or intimate gatherings." },
  { key: "cocreative",    label: "Co-creative",   dot: "#B38B6D", icon: Palette,  description: "Hands-on collaboration — art, music, cooking, or making things together." },
  { key: "kinetic",       label: "Kinetic",        dot: "#C4785C", icon: Activity, description: "High-energy movement — sports, dance, or outdoor adventures." },
  { key: "parallel",      label: "Social / Mixed", dot: "#D4A373", icon: Coffee,   description: "Easy connection — community events and gatherings with no agenda." },
]

const MAX_VISIBLE = 2

function getEventsForDay(events: any[], day: number, month: number, year: number) {
  return events.filter(e => {
    const src = e.event_date || e.raw_json?.event_date || e.raw_json?.date
    if (!src) return false
    const d = new Date(src)
    return d.getUTCDate() === day && d.getUTCMonth() === month && d.getUTCFullYear() === year
  })
}

export function CalendarGrid({ year, month, onEventClick, events = [], onPrev, onNext }: CalendarGridProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('list')
    }
    // Track dark mode changes reactively
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDay    = new Date(year, month, 1).getDay()
  const totalCells  = Math.ceil((startDay + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - startDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  const selectedDayEvents = selectedDay
    ? getEventsForDay(events, selectedDay, month, year)
    : []

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="font-display text-3xl md:text-5xl capitalize text-[#2F3E46] dark:text-[#EAE0D0] tracking-tighter">
            {MONTH_NAMES[month]} <span className="opacity-30 dark:opacity-40">{year}</span>
          </h2>
          <span className="text-[10px] uppercase font-bold text-[#2F3E46]/30 dark:text-[#68605A] tracking-[0.2em]">
            Houston, TX
          </span>
        </div>
        {(onPrev || onNext) && (
          <div className="flex items-center gap-1 pb-1">
            <button
              onClick={onPrev}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-white/6 border border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/12 transition-all text-[#2F3E46]/60 dark:text-[#A89880] hover:text-[#2F3E46] dark:hover:text-[#EAE0D0] shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Prev</span>
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-white/6 border border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/12 transition-all text-[#2F3E46]/60 dark:text-[#A89880] hover:text-[#2F3E46] dark:hover:text-[#EAE0D0] shadow-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Legend — desktop only */}
      <div className="hidden md:flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
        {VIBE_LEGEND.map(({ key, label, dot, icon: Icon, description }) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-default">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                <Icon className="w-3 h-3 text-[#2F3E46]/40 dark:text-[#A89880]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2F3E46]/50 dark:text-[#A89880]">{label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px] rounded-xl px-3 py-2 text-[11px] leading-snug bg-[#2F3E46] text-[#F4F1EA] border-0 shadow-xl">
              {description}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Mobile: view toggle */}
      <div className="md:hidden flex items-center gap-2 px-1">
        <button
          onClick={() => setViewMode('grid')}
          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
          style={viewMode === 'grid'
            ? { backgroundColor: "#2F3E46", color: "#F4F1EA" }
            : { backgroundColor: "rgba(47,62,70,0.08)", color: "rgba(47,62,70,0.4)" }}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode('list')}
          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
          style={viewMode === 'list'
            ? { backgroundColor: "#2F3E46", color: "#F4F1EA" }
            : { backgroundColor: "rgba(47,62,70,0.08)", color: "rgba(47,62,70,0.4)" }}
        >
          List
        </button>
      </div>

      {/* Mobile: list view */}
      <div className={viewMode === 'list' ? 'md:hidden' : 'hidden'}>
        {(() => {
          const monthEvents = events
            .filter(e => {
              const src = e.event_date || e.raw_json?.event_date || e.raw_json?.date
              if (!src) return false
              const d = new Date(src)
              return d.getUTCMonth() === month && d.getUTCFullYear() === year
            })
            .sort((a, b) => {
              const sa = a.event_date || a.raw_json?.event_date || a.raw_json?.date || ""
              const sb = b.event_date || b.raw_json?.event_date || b.raw_json?.date || ""
              return sa < sb ? -1 : sa > sb ? 1 : 0
            })

          if (monthEvents.length === 0) {
            return <p className="text-sm text-[#2F3E46]/40 text-center py-8">No events this month.</p>
          }

          // Group by day
          const byDay: Record<number, any[]> = {}
          monthEvents.forEach(e => {
            const src = e.event_date || e.raw_json?.event_date || e.raw_json?.date
            const day = new Date(src).getUTCDate()
            if (!byDay[day]) byDay[day] = []
            byDay[day].push(e)
          })

          return (
            <div className="rounded-2xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/8 backdrop-blur-md overflow-hidden divide-y divide-black/5 dark:divide-white/5">
              {Object.entries(byDay).map(([dayStr, dayEvts]) => {
                const dayNum = Number(dayStr)
                return (
                  <div key={dayNum}>
                    <div className="px-4 py-2 bg-white/20 dark:bg-white/4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2F3E46]/40 dark:text-[#E8E3D8]/40">
                        {MONTH_NAMES[month]} {dayNum}
                      </p>
                    </div>
                    {dayEvts.map(event => {
                      const v = getVibeFromEnergy(event.social_energy || event.raw_json?.social_energy)
                      const data = event.raw_json || event
                      const time = data.time || data.event_time || null
                      return (
                        <button
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/40 transition-colors active:scale-[0.99]"
                        >
                          <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: VIBE_DOT[v] }} />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#2F3E46] dark:text-[#E8E3D8] leading-snug">{event.title}</p>
                            {time && <p className="text-[11px] text-[#2F3E46]/40 dark:text-[#E8E3D8]/40 mt-0.5 font-medium">{time}</p>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* Grid */}
      <div className={viewMode === 'grid' ? '' : 'hidden md:block'}>
      {events.length > 0 && cells.every((day) => !day || getEventsForDay(events, day, month, year).length === 0) && (
        <div className="rounded-2xl bg-[#F4F1EA]/60 dark:bg-white/5 border border-white/30 dark:border-white/8 px-6 py-5 mb-4 flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">🌱</span>
          <div>
            <p className="text-sm font-bold text-[#2F3E46]/70 dark:text-[#EAE0D0]/70 mb-1">Nothing planted here yet.</p>
            <p className="text-xs text-[#2F3E46]/40 dark:text-[#A89880]/60 leading-relaxed">
              Try April 2026 to explore what's growing in Houston.
            </p>
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/30 dark:border-white/10 bg-white/30 dark:bg-[#18232A] backdrop-blur-sm shadow-sm dark:shadow-black/40">

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-black/5 dark:border-white/10 bg-white/20 dark:bg-[#1F2E36]">
          {DAYS_OF_WEEK.map((d, i) => (
            <div key={d} className="py-2.5 md:py-4 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#2F3E46]/40 dark:text-[#A89880]">
              <span className="md:hidden">{DAYS_SHORT[i]}</span>
              <span className="hidden md:inline">{d}</span>
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayEvents = day ? getEventsForDay(events, day, month, year) : []
            const visible  = dayEvents.slice(0, MAX_VISIBLE)
            const overflow = dayEvents.length - MAX_VISIBLE
            const vibe     = visible.length > 0
              ? getVibeFromEnergy(visible[0].social_energy || visible[0].raw_json?.social_energy)
              : null

            const isLastRow   = idx >= totalCells - 7
            const isLastCol   = (idx + 1) % 7 === 0
            const isSelected  = selectedDay === day

            return (
              <div
                key={idx}
                className={[
                  // Mobile: compact tap targets; Desktop: full cells
                  "min-h-[44px] md:min-h-[130px] p-1.5 md:p-3 transition-colors duration-200",
                  !isLastRow ? "border-b border-black/5 dark:border-white/8" : "",
                  !isLastCol ? "border-r border-black/5 dark:border-white/8" : "",
                  day && vibe ? VIBE_CELL_BG[vibe] : day ? "bg-white/10 dark:bg-white/[0.03]" : "bg-black/[0.02] dark:bg-black/20",
                  day && dayEvents.length > 0 ? "cursor-pointer" : "",
                ].join(" ")}
                onClick={() => {
                  if (!day) return
                  setSelectedDay(isSelected ? null : day)
                }}
              >
                {day && (
                  <div className="flex flex-col h-full">

                    {/* Day number */}
                    <div className="flex flex-col items-center md:items-start gap-0.5 md:gap-1 leading-none">
                      {/* Mobile: circle highlight when selected */}
                      <span
                        className={[
                          "font-display text-xs md:text-sm font-bold leading-none transition-all duration-150",
                          "md:bg-transparent md:w-auto md:h-auto md:rounded-none md:p-0",
                          isSelected
                            ? "w-6 h-6 rounded-full flex items-center justify-center text-[#F4F1EA] text-[11px]"
                            : "w-6 h-6 flex items-center justify-center text-[11px] md:w-auto md:h-auto text-[#2F3E46] dark:text-[#C8BBAB]",
                        ].join(" ")}
                        style={{
                          opacity: isSelected ? 1 : dayEvents.length > 0 ? 0.8 : 0.3,
                          backgroundColor: isSelected ? "#2C6B5F" : "transparent",
                        }}
                      >
                        {day}
                      </span>

                      {/* Dot indicator on desktop */}
                      {dayEvents.length > 0 && vibe && (
                        <span className="hidden md:block w-1 h-1 rounded-full" style={{ backgroundColor: VIBE_DOT[vibe], opacity: 0.6 }} />
                      )}
                    </div>

                    {/* Mobile: event dots */}
                    {dayEvents.length > 0 && (
                      <div className="md:hidden flex justify-center gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((e, i) => {
                          const v = getVibeFromEnergy(e.social_energy || e.raw_json?.social_energy)
                          return <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: VIBE_DOT[v] }} />
                        })}
                      </div>
                    )}

                    {/* Desktop: event chips */}
                    <div className="hidden md:flex flex-col gap-1.5 flex-1 mt-2">
                      {visible.map(event => {
                        const v    = getVibeFromEnergy(event.social_energy || event.raw_json?.social_energy)
                        const chip = isDark ? VIBE_CHIP_DARK[v] : VIBE_CHIP[v]
                        const data = event.raw_json || event
                        const tip  = data.vibe_check || data.description || null
                        return (
                          <Tooltip key={event.id}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={e => { e.stopPropagation(); onEventClick(event) }}
                                className="group w-full text-left rounded-lg px-2.5 py-2 transition-all duration-150 hover:shadow-md hover:-translate-y-px active:scale-[0.98] active:translate-y-0"
                                style={{ backgroundColor: chip.bg }}
                              >
                                <div className="flex items-start justify-between gap-0.5">
                                  <span className="block text-[11px] font-bold leading-snug line-clamp-2" style={{ color: chip.text }}>
                                    {event.title}
                                  </span>
                                  <ChevronRight className="w-2.5 h-2.5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: chip.text }} />
                                </div>
                              </button>
                            </TooltipTrigger>
                            {tip && (
                              <TooltipContent side="top" className="max-w-[220px] rounded-xl px-3 py-2.5 text-[11px] leading-snug bg-[#2F3E46] text-[#F4F1EA] border-0 shadow-xl">
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Why this for you</p>
                                {tip}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        )
                      })}
                      {overflow > 0 && (
                        <button
                          onClick={e => { e.stopPropagation(); onEventClick(dayEvents[MAX_VISIBLE]) }}
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

      {/* Mobile: day detail panel */}
      <AnimatePresence>
        {selectedDay !== null && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden rounded-2xl bg-white/50 dark:bg-[#1F2E36] border border-white/30 dark:border-white/8 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-black/5 dark:border-white/8 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2F3E46]/50 dark:text-[#A89880]">
                {MONTH_NAMES[month]} {selectedDay}
              </p>
              <button onClick={() => setSelectedDay(null)} className="text-[10px] text-[#2F3E46]/30 dark:text-[#68605A] hover:text-[#2F3E46]/60 dark:hover:text-[#A89880] transition-colors font-bold uppercase tracking-widest">
                Close
              </button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <p className="px-4 py-5 text-sm text-[#2F3E46]/40 text-center">No events this day.</p>
            ) : (
              <div className="divide-y divide-black/5">
                {selectedDayEvents.map(event => {
                  const v    = getVibeFromEnergy(event.social_energy || event.raw_json?.social_energy)
                  const data = event.raw_json || event
                  const time = data.time || data.event_time || null
                  const chip = isDark ? VIBE_CHIP_DARK[v] : VIBE_CHIP[v]
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-white/10 dark:hover:bg-white/5 transition-colors active:scale-[0.99]"
                    >
                      <span className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: VIBE_DOT[v] }} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#2F3E46] dark:text-[#EAE0D0] leading-snug">{event.title}</p>
                        {time && <p className="text-[11px] text-[#2F3E46]/40 dark:text-[#A89880] mt-0.5 font-medium">{time}</p>}
                        {data.vibe_check && <p className="text-[11px] italic text-[#2F3E46]/40 dark:text-[#A89880] mt-0.5 leading-snug line-clamp-2">{data.vibe_check}</p>}
                      </div>
                      <span className="ml-auto text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0 self-center" style={{ backgroundColor: chip.bg, color: chip.text }}>
                        {v}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: legend at bottom */}
      <div className="md:hidden flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1">
        {VIBE_LEGEND.map(({ key, label, dot, icon: Icon }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
            <Icon className="w-3 h-3 text-[#2F3E46]/40 dark:text-[#A89880]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#2F3E46]/50 dark:text-[#A89880]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
