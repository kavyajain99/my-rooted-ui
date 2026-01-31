"use client"

import { useState } from "react"
import { MoodInput } from "@/components/mood-input"
import { CalendarGrid } from "@/components/calendar-grid"
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"
import { EventCard } from "@/components/event-card"

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  const handleResults = (newEvents: any[]) => {
    // Map the Supabase data to the format the CalendarGrid expects
    const formatted = newEvents.map(e => ({
      ...e,
      // Map energy to vibe color keys
      vibe: e.social_energy?.toLowerCase().includes('high') ? 'kinetic' : 'parallel' 
    }))
    setEvents(formatted)
  }

  return (
    <AppWrapper>
      <main className="relative min-h-screen pb-20">
        <TopographicBackground />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <h1 className="font-display text-5xl mb-12 text-center">The Vault</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: AI Search */}
            <div className="lg:col-span-4 space-y-8">
              <MoodInput onResultsFound={handleResults} />
              
              {/* AI Results List */}
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border-l-4 border-primary cursor-pointer hover:bg-white/80 transition-all"
                  >
                    <h3 className="font-bold text-sm">{event.title}</h3>
                    <p className="text-xs italic opacity-70 mt-1 line-clamp-2">"{event.vibe_check}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Calendar */}
            <div className="lg:col-span-8">
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20">
                <CalendarGrid 
                  month="february" 
                  events={events} // This connects the dots!
                  onEventClick={(event) => setSelectedEvent(event)} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Popup Detail Card */}
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