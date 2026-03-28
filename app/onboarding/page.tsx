"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { createBrowserClient } from '@supabase/ssr'
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"

// ── Brand accent ──────────────────────────────────────────────────
const SAGE = "#2C6B5F"
const SAGE_LIGHT = `${SAGE}22`
const SAGE_RING  = `${SAGE}33`

// ── Data ──────────────────────────────────────────────────────────
const GENDER_OPTIONS      = ["Woman", "Man", "Non-binary", "Prefer not to say"]
const AGE_OPTIONS         = ["18–24", "25–34", "35–44", "45–59", "60+"]
const NEIGHBORHOOD_OPTIONS = [
  // Inner Loop
  "Montrose", "Heights", "Midtown", "Downtown", "East End",
  "Museum District", "River Oaks", "Upper Kirby", "EaDo",
  "Third Ward", "Neartown", "Greenway Plaza",
  // Inner suburbs
  "Galleria / Uptown", "Medical Center", "Bellaire", "West University",
  "Meyerland", "Spring Branch", "Garden Oaks", "Briargrove",
  // North
  "The Woodlands", "Cypress", "Tomball", "Kingwood", "Spring",
  "Humble", "Atascocita",
  // West / Southwest
  "Katy", "Sugar Land", "Missouri City", "Stafford",
  "Richmond", "Cinco Ranch",
  // South / Southeast
  "Pearland", "Friendswood", "League City", "Clear Lake", "Pasadena",
  // East
  "Baytown", "La Porte",
  // Other
  "Other",
]
const TRAIT_OPTIONS = [
  { label: "Curious",       color: "#C4785C", description: "Open-minded explorers who love learning and new ideas." },
  { label: "Reflective",    color: "#5C7A8B", description: "Deep thinkers who value introspection and meaningful conversation." },
  { label: "Adventurous",   color: "#B36A3A", description: "Drawn to nature, travel, or stepping outside comfort zones." },
  { label: "Mindful",       color: "#7A8B7C", description: "Seekers of meditation, presence, and emotional awareness." },
  { label: "Compassionate", color: "#B38B6D", description: "Empathetic, kind, and caring for people, planet, and animals." },
  { label: "Creative",      color: "#8B6D5C", description: "Makers, artists, writers, and DIY or fringe creatives." },
  { label: "Grounded",      color: "#5C7A5C", description: "Stable, calm presence connected to nature and roots." },
  { label: "Purposeful",    color: "#2F3E46", description: "Values-driven, advocacy-minded, and impact-focused." },
  { label: "Open-hearted",  color: "#C47A7A", description: "Warm, emotionally available, focused on authentic connection." },
  { label: "Resilient",     color: "#6D7A8B", description: "Rebuilt after transitions, moved often, or grown through change." },
]

// ── Reusable chip (demographics) ─────────────────────────────────
function ChipButton({
  label, selected, onClick, color,
}: { label: string; selected: boolean; onClick: () => void; color?: string }) {
  const active = selected
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-colors duration-200"
      style={
        active
          ? {
              backgroundColor: color || SAGE,
              color: "#F4F1EA",
              borderColor: color || SAGE,
              boxShadow: `0 0 0 3px ${SAGE_RING}, 0 2px 8px ${SAGE}30`,
            }
          : {
              backgroundColor: "rgba(255,255,255,0.5)",
              color: "#2F3E46",
              borderColor: "rgba(47,62,70,0.12)",
            }
      }
    >
      {label}
    </motion.button>
  )
}

// ── Trait card (personality, with description + check) ───────────
function TraitCard({
  label, description, selected, onClick, color,
}: { label: string; description: string; selected: boolean; onClick: () => void; color: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative w-full text-left rounded-2xl p-4 border transition-colors duration-200"
      style={
        selected
          ? {
              backgroundColor: color,
              borderColor: color,
              boxShadow: `0 0 0 3px ${color}33, 0 4px 12px ${color}30`,
            }
          : {
              backgroundColor: "rgba(255,255,255,0.55)",
              borderColor: "rgba(47,62,70,0.10)",
            }
      }
    >
      {/* Check badge */}
      {selected && (
        <span
          className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
        >
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
      )}
      <p
        className="text-xs font-bold tracking-wide mb-1 pr-5"
        style={{ color: selected ? "#F4F1EA" : "#2F3E46" }}
      >
        {label}
      </p>
      <p
        className="text-[11px] leading-snug"
        style={{ color: selected ? "rgba(244,241,234,0.75)" : "rgba(47,62,70,0.45)" }}
      >
        {description}
      </p>
    </motion.button>
  )
}

// ── 3-step progress indicator ─────────────────────────────────────
const STEPS = ["Your Identity", "Your Signal", "The Vault"]

function StepProgress({ step }: { step: number }) {
  // step 1 = first node active, step 2 = first two active
  const filled = step // nodes 0..step-1 are done
  return (
    <div className="mb-10">
      <div className="relative flex items-start justify-between">
        {/* Background track */}
        <div className="absolute top-[9px] left-[10%] right-[10%] h-[2px] bg-[#2C6B5F]/12 rounded-full" />
        {/* Filled track */}
        <motion.div
          className="absolute top-[9px] left-[10%] h-[2px] rounded-full"
          style={{ backgroundColor: SAGE }}
          animate={{ width: step === 1 ? "0%" : step === 2 ? "40%" : "80%" }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
        {STEPS.map((label, i) => {
          const done = i < filled
          const active = i === filled - 1
          return (
            <div key={label} className="relative flex flex-col items-center gap-2 z-10" style={{ width: "33.33%" }}>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: done ? SAGE : "#F4F1EA",
                  borderColor: done ? SAGE : active ? SAGE : `${SAGE}30`,
                  boxShadow: active ? `0 0 0 3px ${SAGE_RING}` : "none",
                }}
              >
                {done && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.12em] text-center leading-tight"
                style={{ color: done ? SAGE : "rgba(47,62,70,0.35)" }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const [gender, setGender]             = useState("")
  const [age, setAge]                   = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [traits, setTraits]             = useState<string[]>([])
  const [intent, setIntent]             = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Pre-fill name from sessionStorage (set during signup)
  useEffect(() => {
    const name = sessionStorage.getItem("rootedName")
    if (name) sessionStorage.setItem("rootedName", name) // ensure it stays
  }, [])

  const step1Complete = !!(gender && age)
  const step2Complete = traits.length > 0

  const toggleTrait = (label: string) =>
    setTraits(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label])

  const save = async (profile: Record<string, any>) => {
    sessionStorage.setItem("rootedProfile", JSON.stringify(profile))

    // Persist to Supabase so profile survives tab close / new device
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").upsert(
        { id: user.id, ...profile, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      )
    }
    await supabase.auth.updateUser({ data: { onboarding_complete: true } })
    router.push("/calendar")
  }

  const handleFinish = () => {
    const autoIntent = traits.length > 0
      ? `I'm drawn to ${traits.join(", ").toLowerCase()} experiences and want to find community in Houston.`
      : "Open to discovery"
    save({ gender, age, neighborhood, traits, intent: autoIntent })
  }

  const handleSkip = () =>
    save({ gender: "", age: "", neighborhood: "", traits: ["Curious"], intent: "Open to discovery" })

  return (
    <AppWrapper>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
        <TopographicBackground />

        <div className="relative z-10 w-full max-w-lg">
          {/* Logo */}
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl tracking-tight text-[#2F3E46]">Rooted</h1>
          </div>

          <StepProgress step={step} />

          {/* Card */}
          <div className="bg-[#F4F1EA]/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl border border-white/40 overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <h2 className="font-display text-3xl text-[#2F3E46] leading-tight">Tell us about yourself.</h2>
                    <p className="text-sm text-[#2F3E46]/60 font-medium">This helps us surface events that actually fit your life.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50">I identify as</label>
                    <div className="flex flex-wrap gap-2">
                      {GENDER_OPTIONS.map(opt => (
                        <ChipButton key={opt} label={opt} selected={gender === opt} onClick={() => setGender(opt)} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50">Age Range</label>
                    <div className="flex flex-wrap gap-2">
                      {AGE_OPTIONS.map(opt => (
                        <ChipButton key={opt} label={opt} selected={age === opt} onClick={() => setAge(opt)} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50">
                      My Neighborhood <span className="font-normal opacity-60">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {NEIGHBORHOOD_OPTIONS.map(opt => (
                        <ChipButton key={opt} label={opt} selected={neighborhood === opt} onClick={() => setNeighborhood(n => n === opt ? "" : opt)} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!step1Complete}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#F4F1EA] shadow-lg transition-all disabled:opacity-30"
                      style={{ backgroundColor: SAGE }}
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSkip}
                      className="w-full text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/35 hover:text-[#2F3E46]/60 transition-colors py-1"
                    >
                      Skip — I'm just curious
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <h2 className="font-display text-3xl text-[#2F3E46] leading-tight">What's your vibe?</h2>
                    <p className="text-sm text-[#2F3E46]/60 font-medium">Select all that speak to you — the more you share, the better we match.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50">I'm drawn to</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TRAIT_OPTIONS.map(({ label, color, description }) => (
                        <TraitCard
                          key={label}
                          label={label}
                          description={description}
                          selected={traits.includes(label)}
                          onClick={() => toggleTrait(label)}
                          color={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 rounded-2xl border border-[#2F3E46]/20 px-6 py-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/60 transition-all hover:border-[#2F3E46]/40 hover:text-[#2F3E46]"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handleFinish}
                      disabled={!step2Complete}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#F4F1EA] shadow-lg transition-all disabled:opacity-30"
                      style={{ backgroundColor: SAGE }}
                    >
                      Enter the Vault <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </AppWrapper>
  )
}
