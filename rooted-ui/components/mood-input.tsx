"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

// Define what the component expects to receive from the Parent
interface MoodInputProps {
  onResultsFound: (events: any[]) => void
}

export function MoodInput({ onResultsFound }: MoodInputProps) {
  const [mood, setMood] = useState("")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
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
          demographics: { gender, age } 
        }),
      })

      const data = await response.json()
      console.log("[v0] MoodInput API response:", data)
      console.log("[v0] MoodInput data.events:", data.events)

      if (data.events) {
        console.log("[v0] MoodInput calling onResultsFound with", data.events.length, "events")
        // This is the magic line that sends the data back up to the Calendar Page!
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

  const isFormComplete = gender && age && mood.trim().length > 0

  return (
    <div className="space-y-6 bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium opacity-70">I identify as</label>
          <div className="flex flex-wrap gap-2">
            {["Woman", "Man", "Non-binary", "Prefer not to say"].map((opt) => (
              <button
                key={opt}
                onClick={() => setGender(opt)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  gender === opt ? "bg-primary text-white" : "bg-white/50 hover:bg-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Age Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium opacity-70">Age Range</label>
          <div className="flex flex-wrap gap-2">
            {["18-24", "25-34", "35-44", "45+"].map((opt) => (
              <button
                key={opt}
                onClick={() => setAge(opt)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  age === opt ? "bg-primary text-white" : "bg-white/50 hover:bg-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium opacity-70">What kind of connection are you seeking?</label>
        <textarea
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Describe your ideal experience..."
          className="w-full bg-white/50 border-none rounded-xl p-4 h-32 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <Button 
        onClick={handleDiscover}
        disabled={isListening || !isFormComplete}
        className="w-full bg-[#2F3E46] text-[#F4F1EA] py-6 rounded-full font-medium hover:bg-[#3d4f59] transition-all shadow-lg disabled:opacity-50"
      >
        {isListening ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning the Vault...</>
        ) : (
          <><Search className="mr-2 h-4 w-4" /> Discover Events</>
        )}
      </Button>
    </div>
  )
}
