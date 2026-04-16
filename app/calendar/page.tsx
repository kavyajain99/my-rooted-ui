"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
import { MapPin, User, Sparkles, MessageSquare, Pencil, Check, ChevronLeft, ChevronRight, SearchX, Settings } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoodInput } from "@/components/mood-input"
import { CalendarGrid } from "@/components/calendar-grid"
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"
import { EventCard } from "@/components/event-card"
import { ProfilePanel } from "@/components/profile-panel"

const SAGE = "#2C6B5F"

type SearchStatus = "idle" | "searching" | "empty" | "results"

interface RootedProfile {
  gender: string
  age: string
  neighborhood: string
  traits: string[]
  intent: string
}

const TRAIT_COLORS: Record<string, string> = {
  Forager:   "#5C7A5C",
  Bookish:   "#5C7A8B",
  Handmade:  "#8B6D5C",
  Rooted:    "#2F3E46",
  Fermented: "#7A8B5C",
  Ritualist: "#6D5C7A",
  Tuned:     "#B36A3A",
  Embodied:  "#7A8B7C",
}

// ── Editable "Your Signal" sidebar ───────────────────────────────
function UserSignalCard({
  profile,
  onIntentChange,
}: {
  profile: RootedProfile
  onIntentChange: (newIntent: string) => void
}) {
  const [draft, setDraft] = useState(profile.intent)
  const [open, setOpen] = useState(false)

  const save = () => { onIntentChange(draft); setOpen(false) }

  return (
    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/8 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40 dark:text-[#E8E3D8]/40">Your Signal</p>
        <a href="/onboarding" className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2F3E46]/40 hover:text-[#2F3E46] transition-colors border-b border-transparent hover:border-[#2F3E46]/30">
          Edit
        </a>
      </div>

      {(profile.gender || profile.age) && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30"><User className="w-3 h-3" /></div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30 mb-0.5">I identify as</p>
            <p className="text-sm font-bold text-[#2F3E46] dark:text-[#E8E3D8]">{[profile.gender, profile.age].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
      )}

      {profile.neighborhood && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30"><MapPin className="w-3 h-3" /></div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30 mb-0.5">Neighborhood</p>
            <p className="text-sm font-bold text-[#2F3E46] dark:text-[#E8E3D8]">{profile.neighborhood}</p>
          </div>
        </div>
      )}

      {profile.traits.length > 0 && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30"><Sparkles className="w-3 h-3" /></div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30 mb-1.5">Vibe</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.traits.map(trait => (
                <span key={trait} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: TRAIT_COLORS[trait] || "#2F3E46" }}>
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {profile.intent && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30"><MessageSquare className="w-3 h-3" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30">About You</p>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button className="p-0.5 rounded hover:bg-black/5 transition-colors">
                    <Pencil className="w-2.5 h-2.5 text-[#2F3E46]/30 hover:text-[#2F3E46]/60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 rounded-2xl border border-white/30 bg-[#F4F1EA]/95 backdrop-blur-md shadow-xl" align="start">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#2F3E46]/40 mb-3">Edit your intent</p>
                  <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl bg-white/70 border border-white/40 px-3 py-2.5 text-sm text-[#2F3E46] focus:outline-none resize-none"
                  />
                  <button onClick={save} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: SAGE }}>
                    <Check className="w-3 h-3" /> Save
                  </button>
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-xs italic text-[#2F3E46]/60 leading-relaxed">
              "{profile.intent.length > 100 ? profile.intent.slice(0, 100) + "…" : profile.intent}"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function CalendarPage() {
  const [events, setEvents]               = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [profile, setProfile]             = useState<RootedProfile | null>(null)
  const [userName, setUserName]           = useState<string | null>(null)
  const [searchStatus, setSearchStatus]   = useState<SearchStatus>("idle")
  const [profileOpen, setProfileOpen]     = useState(false)
  // Default to April 2026 where our seed data lives
  const [displayYear, setDisplayYear]     = useState(2026)
  const [displayMonth, setDisplayMonth]   = useState(3) // April = 3

  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // 1. Try sessionStorage first (instant)
    const stored = sessionStorage.getItem("rootedProfile")
    if (stored) {
      setProfile(JSON.parse(stored))
    }

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return

      // Restore name
      const cachedName = sessionStorage.getItem("rootedName")
      if (cachedName) {
        setUserName(cachedName)
      } else {
        const name = user.user_metadata?.full_name
        if (name) { setUserName(name); sessionStorage.setItem("rootedName", name) }
      }

      // 2. If sessionStorage was empty, load profile from Supabase
      if (!stored) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        if (data) {
          const p: RootedProfile = {
            gender:       data.gender       || "",
            age:          data.age          || "",
            neighborhood: data.neighborhood || "",
            traits:       data.traits       || [],
            intent:       data.intent       || "",
          }
          setProfile(p)
          sessionStorage.setItem("rootedProfile", JSON.stringify(p))
        }
      }
    })
  }, [])

  const handleSearchStart = () => setSearchStatus("searching")

  const handleResults = (newEvents: any[]) => {
    setEvents(newEvents)
    setSearchStatus(newEvents.length > 0 ? "results" : "empty")

    // Auto-navigate to the month with the most events
    if (newEvents.length > 0) {
      const counts: Record<string, { year: number; month: number; count: number }> = {}
      newEvents.forEach(e => {
        const src = e.event_date || e.raw_json?.event_date || e.raw_json?.date
        if (!src) return
        const d = new Date(src)
        const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`
        if (!counts[key]) counts[key] = { year: d.getUTCFullYear(), month: d.getUTCMonth(), count: 0 }
        counts[key].count++
      })
      const top = Object.values(counts).sort((a, b) => b.count - a.count)[0]
      if (top) { setDisplayYear(top.year); setDisplayMonth(top.month) }
    }
  }

  const handleIntentChange = async (newIntent: string) => {
    if (!profile) return
    const updated = { ...profile, intent: newIntent }
    setProfile(updated)
    sessionStorage.setItem("rootedProfile", JSON.stringify(updated))
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from("profiles").update({ intent: newIntent, updated_at: new Date().toISOString() }).eq("id", user.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    sessionStorage.removeItem("rootedProfile")
    sessionStorage.removeItem("rootedName")
    router.push("/")
    router.refresh()
  }

  const prevMonth = () => {
    if (displayMonth === 0) { setDisplayMonth(11); setDisplayYear(y => y - 1) }
    else setDisplayMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (displayMonth === 11) { setDisplayMonth(0); setDisplayYear(y => y + 1) }
    else setDisplayMonth(m => m + 1)
  }

  return (
    <AppWrapper>
      <main className="relative min-h-screen pb-20">
        <TopographicBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
          {/* Header row */}
          <div className="flex items-center justify-between mb-8 md:mb-14">
            {/* Profile settings button - left */}
            <button
              onClick={() => setProfileOpen(true)}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/8 transition-colors text-[#2F3E46]/40 dark:text-[#E8E3D8]/40 hover:text-[#2F3E46] dark:hover:text-[#E8E3D8]"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Title - centered */}
            <h1 className="font-display text-3xl md:text-5xl text-center text-[#2F3E46] dark:text-[#E8E3D8] tracking-wide flex-1 px-4">
              {userName ? `${userName}'s Vault` : "The Vault"}
            </h1>

            {/* Logout - right */}
            <button
              onClick={handleLogout}
              className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#2F3E46]/50 dark:text-[#E8E3D8]/50 hover:text-[#2F3E46] dark:hover:text-[#E8E3D8] transition-all whitespace-nowrap"
            >
              <span className="hidden sm:inline">Exit Vault — </span>Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">

            {/* Calendar — first on mobile, right on desktop */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 dark:border-white/8 space-y-4">

                {/* Empty state */}
                {searchStatus === "empty" && (
                  <div className="rounded-2xl bg-white/50 border border-white/30 p-6 flex items-start gap-4">
                    <SearchX className="w-5 h-5 text-[#2F3E46]/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-[#2F3E46]/70 mb-1">No events matched your search.</p>
                      <p className="text-xs text-[#2F3E46]/40 leading-relaxed">Try rephrasing — describe a feeling or mood rather than a specific activity. e.g. "I want to feel more connected" works better than "networking events."</p>
                    </div>
                  </div>
                )}

                {/* Month navigation */}
                <div className="flex items-center justify-end gap-2">
                  <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-[#2F3E46]/40 hover:text-[#2F3E46]">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-[#2F3E46]/40 hover:text-[#2F3E46]">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <CalendarGrid
                  year={displayYear}
                  month={displayMonth}
                  events={events}
                  onEventClick={setSelectedEvent}
                />
              </div>
            </div>

            {/* Sidebar — below calendar on mobile, left on desktop */}
            <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
              {profile && <UserSignalCard profile={profile} onIntentChange={handleIntentChange} />}
              <MoodInput onResultsFound={handleResults} onSearchStart={handleSearchStart} profile={profile} />
            </div>

          </div>
        </div>

        <AnimatePresence>
          {selectedEvent && (
            <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          )}
        </AnimatePresence>

        <ProfilePanel
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          profile={profile}
          onVibesChange={(vibes) => {
            if (profile) {
              const updated = { ...profile, traits: vibes }
              setProfile(updated)
              sessionStorage.setItem("rootedProfile", JSON.stringify(updated))
            }
          }}
        />
      </main>
    </AppWrapper>
  )
}
