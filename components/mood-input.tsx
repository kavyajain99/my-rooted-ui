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
  onSearchStart?: () => void
  profile?: RootedProfile | null
}

export function MoodInput({ onResultsFound, onSearchStart, profile }: MoodInputProps) {
  const [mood, setMood] = useState(profile?.intent || "")
  const [isListening, setIsListening] = useState(false)

  const handleDiscover = async () => {
    if (!mood.trim()) return
    setIsListening(true)
    onSearchStart?.()

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
      onResultsFound(data.events || [])
    } catch (error) {
      console.error("Connection failed:", error)
      onResultsFound([])
    } finally {
      setIsListening(false)
    }
  }

  return (
    <div className="space-y-5 bg-white/40 dark:bg-[#1F2E36] backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-white/10 shadow-sm dark:shadow-black/30">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50 dark:text-[#A89880]">
          Describe what you're looking for
        </label>
        <textarea
          value={mood}
          onChange={e => setMood(e.target.value)}
          placeholder={"Try: \"I want to feel more connected to people who are into slow living and being outside\" or \"something low-key where I might actually talk to someone\""}
          rows={6}
          className="w-full rounded-xl bg-white/60 dark:bg-[#263540] border border-white/40 dark:border-white/10 px-4 py-3 text-sm text-[#2F3E46] dark:text-[#EAE0D0] placeholder:text-[#2F3E46]/25 dark:placeholder:text-[#68605A] focus:outline-none focus:ring-2 focus:ring-[#2F3E46]/20 dark:focus:ring-[#C4785C]/30 resize-none transition-all"
        />
        <p className="text-[10px] text-[#2F3E46]/30 dark:text-[#68605A] leading-relaxed">
          Natural language works. Describe a feeling or a vibe, not a category.
        </p>
      </div>

      <Button
        onClick={handleDiscover}
        disabled={isListening || !mood.trim()}
        className="w-full bg-[#2F3E46] dark:bg-[#C4785C] text-[#F4F1EA] py-6 rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#3d4f59] dark:hover:bg-[#D4896C] transition-all shadow-lg disabled:opacity-60"
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
