"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // For redirecting
import { createBrowserClient } from '@supabase/ssr' // For signing out
import { MoodInput } from "@/components/mood-input"
import { CalendarGrid } from "@/components/calendar-grid"
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button" // Assuming you have a UI button

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const router = useRouter()

  // Initialize Supabase for the logout action
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // 1. Send user back to landing page
    router.push("/")
    // 2. Force a refresh so the Middleware realizes the session is GONE
    router.refresh()
  }

  const handleResults = (newEvents: any[]) => {
    const formatted = newEvents.map(e => ({
      ...e,
      vibe: e.social_energy?.toLowerCase().includes('high') ? 'kinetic' : 'parallel' 
    }))
    setEvents(formatted)
  }

  return (
    <AppWrapper>
      <main className="relative min-h-screen pb-20">
        <TopographicBackground />
        
        {/* Logout Button - Absolute positioned top right */}
        <div className="absolute top-6 right-6 z-50">
          <button 
            onClick={handleLogout}
            className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#2F3E46]/60 hover:text-[#2F3E46] transition-all hover:tracking-[0.3em]"
          >
            Exit Vault — Logout
          </button>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <h1 className="font-display text-5xl mb-12 text-center text-[#2F3E46]">The Vault</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <MoodInput onResultsFound={handleResults} />
              
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border-l-4 border-[#2F3E46] cursor-pointer hover:bg-white/80 transition-all shadow-sm"
                  >
                    <h3 className="font-bold text-sm text-[#2F3E46]">{event.title}</h3>
                    <p className="text-xs italic opacity-70 mt-1 line-clamp-2">"{event.vibe_check}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20">
                <CalendarGrid 
                  month="february" 
                  events={events}
                  onEventClick={(event) => setSelectedEvent(event)} 
                />
              </div>
            </div>
          </div>
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="max-w-lg w-full">
              <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            </div>
          </div>
        )}
      </main>
    </AppWrapper>
  )
}