"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const SAGE = "#2C6B5F"

const VIBE_OPTIONS = [
  { emoji: "🌿", label: "Forager",   color: "#5C7A5C" },
  { emoji: "📖", label: "Bookish",   color: "#5C7A8B" },
  { emoji: "🧵", label: "Handmade",  color: "#8B6D5C" },
  { emoji: "✊", label: "Rooted",    color: "#2F3E46" },
  { emoji: "🫙", label: "Fermented", color: "#7A8B5C" },
  { emoji: "🕯️", label: "Ritualist", color: "#6D5C7A" },
  { emoji: "🎵", label: "Tuned",     color: "#B36A3A" },
  { emoji: "🧘", label: "Embodied",  color: "#7A8B7C" },
]

interface ProfilePanelProps {
  open: boolean
  onClose: () => void
  profile: { traits: string[] } | null
  onVibesChange: (vibes: string[]) => void
}

export function ProfilePanel({ open, onClose, profile, onVibesChange }: ProfilePanelProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [radius, setRadius] = useState(10)
  const [selectedVibes, setSelectedVibes] = useState<string[]>(profile?.traits || [])

  // Load saved prefs
  useEffect(() => {
    const dm = localStorage.getItem("rootedDarkMode") === "true"
    const r = Number(localStorage.getItem("rootedRadius") || 10)
    setDarkMode(dm)
    setRadius(r)
    if (dm) document.documentElement.classList.add("dark")
  }, [])

  // Sync vibes from profile prop
  useEffect(() => {
    if (profile?.traits) setSelectedVibes(profile.traits)
  }, [profile?.traits])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem("rootedDarkMode", String(next))
    document.documentElement.classList.toggle("dark", next)
  }

  const toggleVibe = (label: string) => {
    const next = selectedVibes.includes(label)
      ? selectedVibes.filter(v => v !== label)
      : [...selectedVibes, label]
    setSelectedVibes(next)
    onVibesChange(next)
  }

  const handleRadius = (val: number) => {
    setRadius(val)
    localStorage.setItem("rootedRadius", String(val))
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[90vw] z-50 bg-[#F4F1EA]/95 backdrop-blur-xl shadow-2xl border-l border-white/30 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50">Profile Settings</p>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-[#2F3E46]/40 hover:text-[#2F3E46]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">

              {/* Dark mode toggle */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40 mb-3">Appearance</p>
                <div className="flex items-center justify-between bg-white/40 rounded-xl px-4 py-3 border border-white/20">
                  <span className="text-sm font-medium text-[#2F3E46]">Dark Mode</span>
                  <button
                    onClick={toggleDark}
                    className="relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0"
                    style={{ backgroundColor: darkMode ? SAGE : "rgba(47,62,70,0.15)" }}
                  >
                    <motion.div
                      animate={{ x: darkMode ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>

              {/* Radius slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40">Travel Radius</p>
                  <span className="text-xs font-bold text-[#2F3E46]/60">{radius} mi</span>
                </div>
                <input
                  type="range" min={1} max={25} value={radius}
                  onChange={e => handleRadius(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: SAGE }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px] text-[#2F3E46]/30 font-bold uppercase tracking-wide">1 mi</span>
                  <span className="text-[9px] text-[#2F3E46]/30 font-bold uppercase tracking-wide">25 mi</span>
                </div>
              </div>

              {/* Vibe selections */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40 mb-3">Your Vibe</p>
                <div className="grid grid-cols-2 gap-2">
                  {VIBE_OPTIONS.map(({ emoji, label, color }) => {
                    const active = selectedVibes.includes(label)
                    return (
                      <button
                        key={label}
                        onClick={() => toggleVibe(label)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-150"
                        style={active
                          ? { backgroundColor: color, borderColor: color, color: "#F4F1EA" }
                          : { backgroundColor: "rgba(255,255,255,0.4)", borderColor: "rgba(47,62,70,0.10)", color: "#2F3E46" }
                        }
                      >
                        <span className="text-base flex-shrink-0">{emoji}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wide leading-tight">{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
