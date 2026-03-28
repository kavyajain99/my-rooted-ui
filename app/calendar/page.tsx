"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
import { MapPin, User, Sparkles, MessageSquare, Pencil, Check } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoodInput } from "@/components/mood-input"
import { CalendarGrid } from "@/components/calendar-grid"
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"
import { EventCard } from "@/components/event-card"



// ── Brand accent ──────────────────────────────────────────────────
const SAGE = "#2C6B5F"

interface RootedProfile {
  gender: string
  age: string
  neighborhood: string
  traits: string[]
  intent: string
}

const TRAIT_COLORS: Record<string, string> = {
  Curious:        "#C4785C",
  Reflective:     "#5C7A8B",
  Adventurous:    "#B36A3A",
  Mindful:        "#7A8B7C",
  Compassionate:  "#B38B6D",
  Creative:       "#8B6D5C",
  Grounded:       "#5C7A5C",
  Purposeful:     "#2F3E46",
  "Open-hearted": "#C47A7A",
  Resilient:      "#6D7A8B",
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

  const save = () => {
    onIntentChange(draft)
    setOpen(false)
  }

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40">Your Signal</p>
        <a
          href="/onboarding"
          className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2F3E46]/40 hover:text-[#2F3E46] transition-colors border-b border-transparent hover:border-[#2F3E46]/30"
        >
          Edit
        </a>
      </div>

      {(profile.gender || profile.age) && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30">
            <User className="w-3 h-3" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30 mb-0.5">I identify as</p>
            <p className="text-sm font-bold text-[#2F3E46]">
              {[profile.gender, profile.age].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {profile.neighborhood && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30">
            <MapPin className="w-3 h-3" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30 mb-0.5">Neighborhood</p>
            <p className="text-sm font-bold text-[#2F3E46]">{profile.neighborhood}</p>
          </div>
        </div>
      )}

      {profile.traits.length > 0 && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30">
            <Sparkles className="w-3 h-3" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30 mb-1.5">Vibe</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.traits.map(trait => (
                <span
                  key={trait}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: TRAIT_COLORS[trait] || "#2F3E46" }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editable intent via Popover */}
      {profile.intent && (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white/60 text-[#2F3E46]/30">
            <MessageSquare className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3E46]/30">About You</p>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button className="p-0.5 rounded hover:bg-black/5 transition-colors">
                    <Pencil className="w-2.5 h-2.5 text-[#2F3E46]/30 hover:text-[#2F3E46]/60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-4 rounded-2xl border border-white/30 bg-[#F4F1EA]/95 backdrop-blur-md shadow-xl"
                  align="start"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#2F3E46]/40 mb-3">Edit your intent</p>
                  <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl bg-white/70 border border-white/40 px-3 py-2.5 text-sm text-[#2F3E46] placeholder:text-[#2F3E46]/30 focus:outline-none resize-none"
                  />
                  <button
                    onClick={save}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all"
                    style={{ backgroundColor: SAGE }}
                  >
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
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [profile, setProfile] = useState<RootedProfile | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const stored = sessionStorage.getItem("rootedProfile")
    if (stored) setProfile(JSON.parse(stored))

    // Load name: sessionStorage first (fast), then Supabase as source of truth
    const cachedName = sessionStorage.getItem("rootedName")
    if (cachedName) {
      setUserName(cachedName)
    } else {
      supabase.auth.getUser().then(({ data }) => {
        const name = data.user?.user_metadata?.full_name
        if (name) {
          setUserName(name)
          sessionStorage.setItem("rootedName", name)
        }
      })
    }
  }, [])

  const handleIntentChange = (newIntent: string) => {
    if (!profile) return
    const updated = { ...profile, intent: newIntent }
    setProfile(updated)
    sessionStorage.setItem("rootedProfile", JSON.stringify(updated))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    sessionStorage.removeItem("rootedProfile")
    router.push("/")
    router.refresh()
  }

  return (
    <AppWrapper>
      <main className="relative min-h-screen pb-20">
        <TopographicBackground />

        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={handleLogout}
            className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#2F3E46]/60 hover:text-[#2F3E46] transition-all hover:tracking-[0.3em]"
          >
            Exit Vault — Logout
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <h1 className="font-display text-6xl mb-14 text-center text-[#2F3E46] tracking-wide">
            {userName ? `${userName}'s Vault` : "The Vault"}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {profile && (
                <UserSignalCard profile={profile} onIntentChange={handleIntentChange} />
              )}
              <MoodInput onResultsFound={setEvents} profile={profile} />
            </div>

            {/* Calendar */}
            <div className="lg:col-span-9">
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20">
                <CalendarGrid
                  month="april"
                  events={events}
                  onEventClick={(event) => setSelectedEvent(event)}
                />
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedEvent && (
            <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          )}
        </AnimatePresence>
      </main>
    </AppWrapper>
  )
}
