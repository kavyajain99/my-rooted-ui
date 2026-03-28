"use client"

import { useState } from "react"
import { X, MapPin, Calendar, Clock, Sparkles, CreditCard, ShoppingBag, Info, CalendarPlus, ChevronDown } from "lucide-react"

function buildCalendarDates(eventDate: string, eventTime: string) {
  const baseDate = new Date(eventDate)

  const startMatch = eventTime?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  const startDate = new Date(baseDate)
  if (startMatch) {
    let h = parseInt(startMatch[1])
    const m = parseInt(startMatch[2])
    const ampm = startMatch[3].toUpperCase()
    if (ampm === "PM" && h !== 12) h += 12
    if (ampm === "AM" && h === 12) h = 0
    startDate.setHours(h, m, 0, 0)
  } else {
    startDate.setHours(12, 0, 0, 0)
  }

  const endMatch = eventTime?.match(/[-–]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  const endDate = new Date(startDate)
  if (endMatch) {
    let h = parseInt(endMatch[1])
    const m = parseInt(endMatch[2])
    const ampm = endMatch[3].toUpperCase()
    if (ampm === "PM" && h !== 12) h += 12
    if (ampm === "AM" && h === 12) h = 0
    endDate.setHours(h, m, 0, 0)
  } else {
    endDate.setTime(startDate.getTime() + 2 * 60 * 60 * 1000)
  }

  return { startDate, endDate }
}

function toGoogleFormat(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function hasRealTime(eventTime: string) {
  return !!(eventTime?.match(/\d{1,2}:\d{2}\s*(AM|PM)/i))
}

function toAllDayDate(rawDate: string) {
  const d = new Date(rawDate)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
}

function buildGoogleUrl(event: any, data: any) {
  const rawDate = data.event_date || data.date
  let dateStr: string
  if (hasRealTime(data.event_time)) {
    const { startDate, endDate } = buildCalendarDates(rawDate, data.event_time)
    dateStr = `${toGoogleFormat(startDate)}/${toGoogleFormat(endDate)}`
  } else {
    const d = toAllDayDate(rawDate)
    dateStr = `${d}/${d}`
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: data.title || "",
    dates: dateStr,
    details: data.vibe_check || data.description || "",
    location: data.address || data.place || "",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function buildOutlookUrl(event: any, data: any) {
  const rawDate = data.event_date || data.date
  let startStr: string
  let endStr: string
  if (hasRealTime(data.event_time)) {
    const { startDate, endDate } = buildCalendarDates(rawDate, data.event_time)
    startStr = startDate.toISOString()
    endStr = endDate.toISOString()
  } else {
    const d = new Date(rawDate)
    const iso = d.toISOString().split("T")[0]
    startStr = iso
    endStr = iso
  }
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: data.title || "",
    startdt: startStr,
    enddt: endStr,
    body: data.vibe_check || data.description || "",
    location: data.address || data.place || "",
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

function downloadIcal(event: any, data: any) {
  const rawDate = data.event_date || data.date
  let dtStartLine: string
  let dtEndLine: string

  if (hasRealTime(data.event_time)) {
    const { startDate, endDate } = buildCalendarDates(rawDate, data.event_time)
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    dtStartLine = `DTSTART:${fmt(startDate)}`
    dtEndLine = `DTEND:${fmt(endDate)}`
  } else {
    const dateStr = toAllDayDate(rawDate)
    const d = new Date(rawDate)
    d.setUTCDate(d.getUTCDate() + 1)
    const pad = (n: number) => String(n).padStart(2, "0")
    const nextDay = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
    dtStartLine = `DTSTART;VALUE=DATE:${dateStr}`
    dtEndLine = `DTEND;VALUE=DATE:${nextDay}`
  }

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rooted//Events//EN",
    "BEGIN:VEVENT",
    dtStartLine,
    dtEndLine,
    `SUMMARY:${(data.title || "").replace(/,/g, "\\,")}`,
    `DESCRIPTION:${(data.vibe_check || data.description || "").replace(/,/g, "\\,").replace(/\n/g, "\\n")}`,
    `LOCATION:${(data.address || data.place || "").replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([ics], { type: "text/calendar" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${(data.title || "event").replace(/\s+/g, "-")}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

interface EventCardProps {
  event: any
  onClose: () => void
}

export function EventCard({ event, onClose }: EventCardProps) {
  const [calOpen, setCalOpen] = useState(false)
  if (!event) return null

  // Use the rich JSON if it exists, otherwise fallback to top level
  const data = event.raw_json || event;
  const energy = data.social_energy || {}
  const logistics = data.logistics || {}
  const metadata = data.metadata || {}

  const dateDisplay = (data.event_date || data.date)
    ? new Date(data.event_date || data.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : "Date TBA"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#2F3E46]/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative h-full w-full max-w-xl overflow-y-auto rounded-[2.5rem] bg-[#F4F1EA] p-8 md:p-12 shadow-2xl animate-in slide-in-from-right duration-500">
        
        {/* Vibe Badge */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-2">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
              style={{ 
                color: energy.color || '#D4A373', 
                borderColor: energy.color || '#D4A373' 
              }}
            >
              <Sparkles className="w-3 h-3" />
              {energy.label || "Community"} Energy
            </div>
            {energy.description && (
              <p className="text-[10px] text-[#2F3E46]/40 font-bold uppercase tracking-tight">
                {energy.description}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <X className="w-6 h-6 text-[#2F3E46]" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-[#2F3E46] tracking-tight">
              {data.title}
            </h2>
            <div className="flex items-center gap-2 text-[#2F3E46]/60 font-semibold text-sm">
              <MapPin className="w-4 h-4 opacity-40" />
              <span>{data.place || "Houston"} • {metadata.neighborhood || "Local"}</span>
            </div>
          </div>

          <div className="bg-white/60 rounded-[2rem] p-8 border border-white/40 shadow-sm">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/30 mb-4 flex items-center gap-2">
               <Info className="w-3 h-3" /> Vibe Check
             </h3>
             <p className="font-serif italic text-xl text-[#2F3E46] leading-relaxed">
               "{data.vibe_check || "A perfect match for your current intent."}"
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-black/5">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><Calendar className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">When</p>
                  <p className="text-sm font-bold text-[#2F3E46]">{dateDisplay}</p>
                  <p className="text-xs font-medium text-[#2F3E46]/60">{data.event_time}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><MapPin className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Where</p>
                  <p className="text-sm font-bold text-[#2F3E46] leading-tight">{data.address || "Check details for location"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><CreditCard className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Cost</p>
                  <p className="text-sm font-bold text-[#2F3E46]">{logistics.cost || "Free or Varies"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><ShoppingBag className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Bring</p>
                  <p className="text-sm font-bold text-[#2F3E46]">{logistics.to_bring || "Just yourself"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <a
              href={logistics.url || data.event_url || event.url || data.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-2xl py-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]"
              style={{ backgroundColor: energy.color || '#2F3E46' }}
            >
              Secure your spot
            </a>

            {/* Add to Calendar */}
            <div className="relative">
              <button
                onClick={() => setCalOpen(o => !o)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] border-2 border-[#2F3E46]/15 text-[#2F3E46]/60 hover:border-[#2F3E46]/30 hover:text-[#2F3E46] transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Add to Calendar
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${calOpen ? "rotate-180" : ""}`} />
              </button>

              {calOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-10">
                  <a
                    href={buildGoogleUrl(event, data)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#2F3E46]/70 hover:bg-[#F4F1EA] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z" fill="#4285F4"/>
                      <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Google Calendar
                  </a>
                  <div className="h-px bg-black/5" />
                  <a
                    href={buildOutlookUrl(event, data)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#2F3E46]/70 hover:bg-[#F4F1EA] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <rect width="24" height="24" rx="4" fill="#0078D4"/>
                      <path d="M5 7h14v10H5z" fill="white" opacity="0.9"/>
                      <path d="M5 7l7 6 7-6" stroke="#0078D4" strokeWidth="1.5"/>
                    </svg>
                    Outlook
                  </a>
                  <div className="h-px bg-black/5" />
                  <button
                    onClick={() => { downloadIcal(event, data); setCalOpen(false) }}
                    className="flex w-full items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#2F3E46]/70 hover:bg-[#F4F1EA] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <rect width="24" height="24" rx="4" fill="#FF3B30"/>
                      <rect x="4" y="7" width="16" height="13" rx="1" fill="white"/>
                      <path d="M4 10h16" stroke="#FF3B30" strokeWidth="1.5"/>
                      <rect x="8" y="4" width="2" height="4" rx="1" fill="#FF3B30"/>
                      <rect x="14" y="4" width="2" height="4" rx="1" fill="#FF3B30"/>
                    </svg>
                    Apple / iCal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}