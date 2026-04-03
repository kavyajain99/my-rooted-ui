"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Wind, Leaf, Activity, Users } from "lucide-react"
import { TopographicBackground } from "@/components/topographic-background"
import { AppWrapper } from "@/components/app-wrapper"
import { LandingGallery } from "@/components/landing-gallery"

// ── Longevity card data ───────────────────────────────────────────────────────
const LONGEVITY_CARDS = [
  { icon: Wind,     label: "Clean Air",          impact: 5,  description: "Reduces cardiovascular and respiratory disease risk.", highlight: false },
  { icon: Leaf,     label: "Healthy Diet",        impact: 10, description: "Whole foods and anti-inflammatory patterns extend lifespan.", highlight: false },
  { icon: Activity, label: "Physical Exercise",   impact: 20, description: "Regular movement is one of the most studied longevity interventions.", highlight: false },
  { icon: Users,    label: "Close Relationships", impact: 50, description: "The #1 predictor of a long, healthy life, above all else.", highlight: true, sub: "The Modern Moai" },
]

function LongevityCard({
  icon: Icon, label, impact, description, highlight, sub,
}: typeof LONGEVITY_CARDS[0]) {
  const barPct = impact // already a real percentage — 50% fills half the bar

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={[
        "flex flex-col items-center text-center gap-3 px-4 py-7 md:py-9 rounded-2xl border cursor-default transition-colors duration-300 overflow-hidden",
        highlight ? "bg-[#2C6B5F]/8 border-[#2C6B5F]/25 hover:bg-[#2C6B5F]/13 hover:border-[#2C6B5F]/40 hover:shadow-lg"
                  : "bg-white/25 border-white/20 hover:bg-white/45 hover:border-white/40 hover:shadow-md",
      ].join(" ")}
    >
      {/* Icon */}
      <Icon
        className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
        style={{ color: highlight ? "#2C6B5F" : "#2F3E46", opacity: highlight ? 0.85 : 0.38 }}
        strokeWidth={1.5}
      />

      {/* Label */}
      <div className="space-y-1 flex-shrink-0">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] leading-tight"
           style={{ color: highlight ? "#2C6B5F" : "#2F3E46", opacity: highlight ? 1 : 0.6 }}>
          {label}
        </p>
        {sub && (
          <p className="text-[9px] font-medium tracking-wide" style={{ color: "#2C6B5F", opacity: 0.55 }}>
            {sub}
          </p>
        )}
      </div>

      {/* Impact % — the key number */}
      <p className="font-display text-3xl md:text-4xl leading-none flex-shrink-0"
         style={{ color: highlight ? "#2C6B5F" : "#2F3E46", opacity: highlight ? 1 : 0.7 }}>
        +{impact}%
      </p>

      {/* Proportional bar */}
      <div className="w-full h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(47,62,70,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: highlight ? "#2C6B5F" : "#2F3E46", opacity: highlight ? 0.7 : 0.25 }}
          initial={{ width: 0 }}
          whileInView={{ width: `${barPct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />
      </div>

      {/* Description — fixed, never causes overflow */}
      <p className="text-[10px] md:text-xs leading-relaxed flex-shrink-0"
         style={{ color: highlight ? "#2C6B5F" : "#2F3E46", opacity: 0.45 }}>
        {description}
      </p>
    </motion.div>
  )
}

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
  }),
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <AppWrapper>
      <main className="relative flex flex-col items-center overflow-hidden">

        {/* Fixed topographic background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <TopographicBackground />
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-3xl text-center pt-28 pb-16 md:pt-40 md:pb-20 px-6">
          <h1 className="font-display text-6xl tracking-tight text-foreground md:text-8xl lg:text-9xl">
            Rooted
          </h1>
          <p className="mt-6 font-display text-xl text-foreground/80 md:text-2xl">
            A belonging engine for Houston.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-sans text-base font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl md:text-lg"
            >
              <span>Enter the Vault</span>
            </Link>
            <Link
              href="/about"
              className="text-sm font-sans uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-all border-b border-transparent hover:border-foreground"
            >
              Read the Manifesto
            </Link>
          </div>

          {/* Aspiration quote */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
            className="mt-12 font-display italic text-lg md:text-xl text-[#2F3E46]/50 max-w-sm md:max-w-md mx-auto leading-relaxed"
          >
            "Home is not just a place, but a feeling, and one you can build."
          </motion.p>
        </section>

        {/* ── The Silent Malnutrition ───────────────────────────────────────── */}
        <section className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-16 pb-20 md:pt-20 md:pb-24 text-center">

          <motion.h2
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={0}
            className="font-display text-3xl md:text-4xl lg:text-5xl text-[#2F3E46] mb-6 md:mb-8 tracking-tight"
          >
            The Silent Malnutrition
          </motion.h2>

          <motion.p
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={1}
            className="font-sans text-base md:text-lg leading-relaxed text-[#2F3E46]/65 mb-12 md:mb-16 max-w-xl mx-auto"
          >
            Loneliness is not a character flaw. John Cacioppo's research found the brain
            processes social isolation in the same regions it processes physical pain. It is
            your system's biological thirst alarm. Despite being more connected than ever,
            we are living through a period of social malnutrition that impacts the body as
            severely as smoking 15 cigarettes a day.
          </motion.p>

          {/* Longevity cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {LONGEVITY_CARDS.map((card, i) => (
              <motion.div
                key={card.label}
                custom={i + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <LongevityCard {...card} />
              </motion.div>
            ))}
          </div>

          <motion.p
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp} custom={6}
            className="text-[10px] md:text-xs font-sans text-[#2F3E46]/30 leading-relaxed max-w-lg mx-auto"
          >
            Source: The 80-Year Harvard Study of Adult Development &amp; Holt-Lunstad Meta-analysis.
            Close relationships are the #1 predictor of longevity.
          </motion.p>
        </section>

        {/* ── Gallery ──────────────────────────────────────────────────────── */}
        <LandingGallery />

      </main>
    </AppWrapper>
  )
}
