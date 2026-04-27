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

  // Compute slider fill percentage for the track gradient
  const sliderPct = ((radius - 1) / (25 - 1)) * 100

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
            className="fixed right-0 top-0 h-full w-80 max-w-[90vw] z-50 bg-[#F4F1EA]/97 dark:bg-[#1F2E36] backdrop-blur-xl shadow-2xl border-l border-black/8 dark:border-white/10 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/6 dark:border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50 dark:text-[#A89880]">
                Profile Settings
              </p>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/8 transition-colors text-[#2F3E46]/40 dark:text-[#A89880] hover:text-[#2F3E46] dark:hover:text-[#E8E3D8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">

              {/* Dark mode toggle */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40 dark:text-[#A89880] mb-3">
                  Appearance
                </p>
                <div className="flex items-center justify-between bg-white/50 dark:bg-[#263540] rounded-xl px-4 py-3 border border-black/8 dark:border-white/10">
                  <span className="text-sm font-medium text-[#2F3E46] dark:text-[#EAE0D0]">Dark Mode</span>
                  <button
                    onClick={toggleDark}
                    aria-label="Toggle dark mode"
                    className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C6B5F]"
                    style={{ backgroundColor: darkMode ? SAGE : "rgba(47,62,70,0.18)" }}
                  >
                    <motion.div
                      animate={{ x: darkMode ? 22 : 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                    />
                  </button>
                </div>
              </div>

              {/* Radius slider */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40 dark:text-[#A89880]">
                    Travel Radius
                  </p>
                  <span className="text-sm font-bold text-[#2C6B5F]">{radius} mi</span>
                </div>
                <input
                  type="range" min={1} max={25} value={radius}
                  onChange={e => handleRadius(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, ${SAGE} ${sliderPct}%, rgba(47,62,70,0.14) ${sliderPct}%)`,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-[#2F3E46]/35 dark:text-[#EAE0D0]/35 font-bold uppercase tracking-wide">1 mi</span>
                  <span className="text-[10px] text-[#2F3E46]/35 dark:text-[#EAE0D0]/35 font-bold uppercase tracking-wide">25 mi</span>
                </div>
              </div>

              {/* Vibe selections */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/40 dark:text-[#A89880] mb-3">
                  Your Roots
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {VIBE_OPTIONS.map(({ emoji, label, color }) => {
                    const active = selectedVibes.includes(label)
                    return (
                      <button
                        key={label}
                        onClick={() => toggleVibe(label)}
                        className={[
                          "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-150",
                          active
                            ? ""
                            : "bg-white/50 dark:bg-[#263540] border-black/8 dark:border-white/10 text-[#2F3E46] dark:text-[#EAE0D0]",
                        ].join(" ")}
                        style={active ? { backgroundColor: color, borderColor: color, color: "#F4F1EA" } : undefined}
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
