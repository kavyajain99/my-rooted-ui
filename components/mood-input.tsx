"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

interface RootedProfile {
  gender: string
  age: string
  neighborhood: string
  traits: string[]
  intent: string
}

interface MoodInputProps {
  onResultsFound: (events: any[]) => void
  profile?: RootedProfile | null
}

export function MoodInput({ onResultsFound, profile }: MoodInputProps) {
  const [mood, setMood] = useState(profile?.intent || "")
  const [isListening, setIsListening] = useState(false)

  const handleDiscover = async () => {
    if (!mood.trim()) return
    setIsListening(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentText: mood,
          demographics: {
            gender: profile?.gender,
            age: profile?.age,
            neighborhood: profile?.neighborhood,
          },
          traits: profile?.traits || [],
        }),
      })

      const data = await response.json()
      if (data.events) {
        onResultsFound(data.events)
      } else {
        console.error("Search error:", data.error)
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsListening(false)
    }
  }

  return (
    <div className="space-y-5 bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-sm">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50">
          What kind of connection are you seeking?
        </label>
        <textarea
          value={mood}
          onChange={e => setMood(e.target.value)}
          placeholder="e.g. I want to be around creative people without too much pressure…"
          rows={4}
          className="w-full rounded-xl bg-white/60 border border-white/40 px-4 py-3 text-sm text-[#2F3E46] placeholder:text-[#2F3E46]/30 focus:outline-none focus:ring-2 focus:ring-[#2F3E46]/20 resize-none transition-all"
        />
      </div>

      <Button
        onClick={handleDiscover}
        disabled={isListening || !mood.trim()}
        className="w-full bg-[#2F3E46] text-[#F4F1EA] py-6 rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#3d4f59] transition-all shadow-lg disabled:opacity-40"
      >
        {isListening ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning the Vault…</>
        ) : (
          <><Search className="mr-2 h-4 w-4" /> Discover Events</>
        )}
      </Button>
    </div>
  )
}
