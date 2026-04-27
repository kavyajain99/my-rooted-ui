"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Wind, Leaf, Activity, Users, Wifi, MapPin, ArrowRight } from "lucide-react"
import { TopographicBackground } from "@/components/topographic-background"
import { AppWrapper } from "@/components/app-wrapper"
import { LandingGallery } from "@/components/landing-gallery"

// ── Typography scale (reference, enforced throughout)
// H1:      font-display text-4xl md:text-6xl lg:text-7xl tracking-tight
// H2:      font-display text-3xl md:text-4xl tracking-tight
// Body:    font-sans text-base md:text-lg leading-relaxed
// Small:   font-sans text-sm leading-relaxed
// Caption: font-sans text-xs font-bold uppercase tracking-[0.2em]

// ── CTA button class (shared, never drifts)
const CTA_CLASS =
  "inline-flex items-center justify-center rounded-full bg-[#2C6B5F] px-8 py-4 font-sans text-sm font-semibold tracking-wide text-[#F4F1EA] shadow-lg transition-all duration-300 hover:bg-[#2C6B5F]/90 hover:shadow-xl"

// ── Card shell (shared across all card components)
const CARD_BASE =
  "rounded-2xl border p-5 md:p-6 transition-colors duration-300"

// ── Fade-up animation
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.08 },
  }),
}

// ── Sample Houston events (shown before sign-up wall) ────────────────────────
const PREVIEW_EVENTS = [
  {
    title: "Slow Sunday Book Club",
    tag: "Bookish",
    neighborhood: "Montrose",
    when: "Sun, Apr 19 · 11am",
    desc: "Bring a book you loved. Leave with three more recommendations and at least one new friend.",
    color: "#5C7A8B",
  },
  {
    title: "Community Fermentation Workshop",
    tag: "Fermented",
    neighborhood: "Heights",
    when: "Sat, Apr 18 · 2pm",
    desc: "Learn to make your own kimchi. Bring a jar. Leave with a full one.",
    color: "#7A8B5C",
  },
  {
    title: "Sunrise Trail Run — Memorial Park",
    tag: "Kinetic",
    neighborhood: "Memorial",
    when: "Sat, Apr 18 · 6:30am",
    desc: "A run that turns into coffee. All paces welcome, seriously.",
    color: "#C4785C",
  },
  {
    title: "Vinyl & Conversation Night",
    tag: "Tuned",
    neighborhood: "EaDo",
    when: "Fri, Apr 17 · 7pm",
    desc: "Bring a record. We'll listen to one side. Talk about the rest.",
    color: "#B36A3A",
  },
]

// ── Longevity cards ───────────────────────────────────────────────────────────
const LONGEVITY_CARDS = [
  { icon: Wind,     label: "Clean Air",          impact: 5,  description: "Reduces cardiovascular and respiratory disease risk.", highlight: false },
  { icon: Leaf,     label: "Healthy Diet",        impact: 10, description: "Whole foods and anti-inflammatory patterns extend lifespan.", highlight: false },
  { icon: Activity, label: "Physical Exercise",   impact: 20, description: "Regular movement is one of the most studied longevity interventions.", highlight: false },
  { icon: Users,    label: "Close Relationships", impact: 50, description: "The #1 predictor of a long, healthy life, above all else.", highlight: true, sub: "The Modern Moai" },
]

// ── Contrast table ────────────────────────────────────────────────────────────
const CONTRAST_ROWS = [
  {
    metric: "Depression risk",
    digital: "+70% among heavy social media users",
    inperson: "–29% with strong in-person ties",
  },
  {
    metric: "Longevity impact",
    digital: "Linked to early mortality at heavy use",
    inperson: "+50% survival odds with close relationships",
  },
  {
    metric: "Wellbeing",
    digital: "Passive scrolling worsens mood within minutes",
    inperson: "Face-to-face contact releases oxytocin within seconds",
  },
]

// ── Values ────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: "🚫",
    label: "No algorithm curating your world",
    body: "You see what exists, not what keeps you clicking. No ranking, no feed, no black box.",
  },
  {
    icon: "🚫",
    label: "No engagement metrics",
    body: "We don't optimize for time-on-app. We optimize for time with people you actually like.",
  },
  {
    icon: "✅",
    label: "Real events, real people, real places",
    body: "Every listing is a physical place in Houston. Hosted by humans. Attended in person.",
  },
]

// ── LongevityCard component ───────────────────────────────────────────────────
function LongevityCard({
  icon: Icon, label, impact, description, highlight, sub,
}: typeof LONGEVITY_CARDS[0]) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={[
        CARD_BASE,
        "flex flex-col items-center text-center gap-3 cursor-default overflow-hidden",
        highlight
          ? "bg-[#2C6B5F]/8 border-[#2C6B5F]/25 dark:bg-[#2C6B5F]/18 dark:border-[#2C6B5F]/40 hover:bg-[#2C6B5F]/13 hover:border-[#2C6B5F]/40 hover:shadow-lg"
          : "bg-white/25 border-white/20 dark:bg-white/6 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-md",
      ].join(" ")}
    >
      <Icon
        className={["w-5 h-5 flex-shrink-0", highlight ? "text-[#2C6B5F]/85" : "text-[#2F3E46]/40 dark:text-[#EAE0D0]/50"].join(" ")}
        strokeWidth={1.5}
      />
      <div className="space-y-0.5 flex-shrink-0">
        <p className={["text-xs font-bold uppercase tracking-[0.2em] leading-tight", highlight ? "text-[#2C6B5F]" : "text-[#2F3E46]/60 dark:text-[#EAE0D0]/70"].join(" ")}>
          {label}
        </p>
        {sub && (
          <p className="text-xs font-medium tracking-wide text-[#2C6B5F]/55">
            {sub}
          </p>
        )}
      </div>
      <p className={["font-display text-3xl md:text-4xl leading-none flex-shrink-0", highlight ? "text-[#2C6B5F]" : "text-[#2F3E46]/70 dark:text-[#EAE0D0]/80"].join(" ")}>
        +{impact}%
      </p>
      <div className="w-full h-1 rounded-full flex-shrink-0 bg-[#2F3E46]/8 dark:bg-white/10">
        <motion.div
          className={["h-full rounded-full", highlight ? "bg-[#2C6B5F]/70" : "bg-[#2F3E46]/25 dark:bg-[#EAE0D0]/25"].join(" ")}
          initial={{ width: 0 }}
          whileInView={{ width: `${impact}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <p className={["text-xs leading-relaxed flex-shrink-0", highlight ? "text-[#2C6B5F]/70" : "text-[#2F3E46]/45 dark:text-[#EAE0D0]/55"].join(" ")}>
        {description}
      </p>
    </motion.div>
  )
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
        <section className="relative z-10 mx-auto w-full max-w-3xl text-center pt-24 pb-12 md:pt-36 md:pb-16 px-6">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2C6B5F]/60"
          >
            Houston · Community · Belonging
          </motion.p>

          {/* H1 hook */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-[#2F3E46] dark:text-[#EAE0D0] leading-tight tracking-tight"
          >
            You know who you are.{" "}
            <br className="hidden md:block" />
            You just don't know where your people are yet.
          </motion.h1>

          {/* Visceral subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="mt-5 font-sans text-base md:text-lg text-[#2F3E46]/60 dark:text-[#EAE0D0]/65 max-w-lg mx-auto leading-relaxed"
          >
            It's Friday. You know nobody yet. Here's where to start.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <Link href="/login" className={CTA_CLASS}>
              Join Rooted
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-[#2F3E46]/25 dark:border-[#EAE0D0]/20 px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/60 dark:text-[#EAE0D0]/60 hover:border-[#2F3E46]/50 dark:hover:border-[#EAE0D0]/40 hover:text-[#2F3E46] dark:hover:text-[#EAE0D0] transition-all duration-200"
            >
              Read the Manifesto <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

        </section>

        {/* ── Event preview (above the fold / early) ───────────────────────── */}
        <section className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-20 md:pb-24">

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/35 dark:text-[#EAE0D0]/45 text-center mb-6"
          >
            Happening this week in Houston
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PREVIEW_EVENTS.map((ev, i) => (
              <motion.div
                key={ev.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                className={[CARD_BASE, "bg-white/25 border-white/25 dark:bg-white/6 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-md"].join(" ")}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className="font-sans text-xs font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${ev.color}18`, color: ev.color }}
                  >
                    {ev.tag}
                  </span>
                  <span className="font-sans text-xs text-[#2F3E46]/40 dark:text-[#EAE0D0]/45 whitespace-nowrap">{ev.neighborhood}</span>
                </div>
                <p className="font-display text-lg md:text-xl text-[#2F3E46] dark:text-[#EAE0D0] leading-snug mb-1">{ev.title}</p>
                <p className="font-sans text-xs font-bold text-[#2C6B5F]/60 dark:text-[#7AAF9F]/80 mb-2 tracking-wide">{ev.when}</p>
                <p className="font-sans text-sm text-[#2F3E46]/50 dark:text-[#EAE0D0]/55 leading-relaxed">{ev.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Unlock nudge */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            className="mt-6 text-center font-sans text-xs text-[#2F3E46]/35 dark:text-[#EAE0D0]/40"
          >
            Create a profile to see full details, RSVP, and find your people.{" "}
            <Link href="/login" className="text-[#2C6B5F]/70 hover:text-[#2C6B5F] border-b border-[#2C6B5F]/30 transition-colors">
              Join Rooted
            </Link>
          </motion.p>
        </section>

        {/* ── Social proof ─────────────────────────────────────────────────── */}
        <section className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-20 md:pb-24">
          <motion.blockquote
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className={[CARD_BASE, "bg-[#2C6B5F]/6 border-[#2C6B5F]/15 dark:bg-[#2C6B5F]/15 dark:border-[#2C6B5F]/30 text-center"].join(" ")}
          >
            <p className="font-display italic text-xl md:text-2xl text-[#2F3E46]/80 dark:text-[#EAE0D0]/85 leading-relaxed mb-5">
              "I moved here from Chicago not knowing a single person. Two weeks in I had a standing Sunday hike and a group chat that actually gets used. I genuinely did not expect it to happen that fast."
            </p>
            <footer className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2C6B5F]/60">
              Mia R. · Heights
            </footer>
          </motion.blockquote>
        </section>

        {/* ── The Silent Malnutrition ───────────────────────────────────────── */}
        <section className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-20 md:pb-24 text-center">

          <motion.h2
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={0}
            className="font-display text-3xl md:text-4xl text-[#2F3E46] dark:text-[#EAE0D0] mb-8 tracking-tight"
          >
            The Silent Malnutrition
          </motion.h2>

          {/* First-person quote leads */}
          <motion.blockquote
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={1}
            className={[CARD_BASE, "bg-white/20 border-white/20 dark:bg-white/5 dark:border-white/10 mb-8 text-left"].join(" ")}
          >
            <p className="font-display italic text-lg md:text-xl text-[#2F3E46]/65 dark:text-[#EAE0D0]/70 leading-relaxed mb-3">
              "On paper my life looked great. Good job, nice apartment, neighborhood I actually chose. But I kept going home on Friday nights to nobody. That specific kind of quiet gets heavy after a while."
            </p>
            <footer className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/35 dark:text-[#EAE0D0]/40">
              Anonymous · Montrose
            </footer>
          </motion.blockquote>

          {/* Cacioppo research */}
          <motion.p
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={2}
            className="font-sans text-base md:text-lg leading-relaxed text-[#2F3E46]/65 dark:text-[#EAE0D0]/65 mb-12"
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
                custom={i + 3}
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
            viewport={{ once: true }} variants={fadeUp} custom={7}
            className="font-sans text-xs text-[#2F3E46]/30 dark:text-[#EAE0D0]/35 leading-relaxed max-w-lg mx-auto"
          >
            Source: The 80-Year Harvard Study of Adult Development &amp; Holt-Lunstad Meta-analysis.
            Close relationships are the #1 predictor of longevity.
          </motion.p>
        </section>

        {/* ── Two Kinds of Connection ───────────────────────────────────────── */}
        <section className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-20 md:pb-28">

          <motion.h2
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={0}
            className="font-display text-3xl md:text-4xl text-[#2F3E46] dark:text-[#EAE0D0] mb-3 tracking-tight text-center"
          >
            Two kinds of connection
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={1}
            className="font-sans text-sm md:text-base text-[#2F3E46]/50 dark:text-[#EAE0D0]/60 text-center mb-10 max-w-lg mx-auto leading-relaxed"
          >
            Not all connection is equal. The research is clear on which kind actually sustains us.
          </motion.p>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1.6fr_1.6fr] gap-x-3 mb-3 px-1">
            <div />
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-[#B05C5C]/70 flex-shrink-0" strokeWidth={1.5} />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#B05C5C]/70">Digital / Social Media</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#2C6B5F]/70 flex-shrink-0" strokeWidth={1.5} />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C6B5F]/70">In-Person Community</span>
            </div>
          </div>

          <div className="space-y-3">
            {CONTRAST_ROWS.map((row, i) => (
              <motion.div
                key={row.metric}
                custom={i + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="grid grid-cols-[1fr_1.6fr_1.6fr] gap-x-3 items-stretch"
              >
                <div className={[CARD_BASE, "bg-white/20 border-white/20 dark:bg-white/5 dark:border-white/10 flex items-center"].join(" ")}>
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50 dark:text-[#EAE0D0]/55 leading-snug">
                    {row.metric}
                  </span>
                </div>
                <div className={[CARD_BASE, "bg-[#B05C5C]/6 border-[#B05C5C]/12 dark:bg-[#B05C5C]/12 dark:border-[#B05C5C]/20"].join(" ")}>
                  <p className="font-sans text-xs md:text-sm text-[#8B3A3A]/80 dark:text-[#E8A8A8] leading-relaxed mb-2.5">{row.digital}</p>
                  <div className="w-full h-0.5 rounded-full bg-[#B05C5C]/10">
                    <motion.div
                      className="h-full rounded-full bg-[#B05C5C]/35"
                      initial={{ width: 0 }}
                      whileInView={{ width: i === 0 ? "70%" : i === 1 ? "55%" : "65%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                </div>
                <div className={[CARD_BASE, "bg-[#2C6B5F]/6 border-[#2C6B5F]/12 dark:bg-[#2C6B5F]/15 dark:border-[#2C6B5F]/25"].join(" ")}>
                  <p className="font-sans text-xs md:text-sm text-[#1E4D44]/80 dark:text-[#8AC5B8] leading-relaxed mb-2.5">{row.inperson}</p>
                  <div className="w-full h-0.5 rounded-full bg-[#2C6B5F]/10">
                    <motion.div
                      className="h-full rounded-full bg-[#2C6B5F]/50"
                      initial={{ width: 0 }}
                      whileInView={{ width: i === 0 ? "29%" : i === 1 ? "50%" : "80%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp} custom={5}
            className="font-sans text-xs text-[#2F3E46]/30 dark:text-[#EAE0D0]/35 leading-relaxed mt-5 text-center"
          >
            Sources: Twenge et al. (2018) · Holt-Lunstad meta-analysis · Harvard Study of Adult Development
          </motion.p>
        </section>

        {/* ── How Rooted is different ───────────────────────────────────────── */}
        <section className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-20 md:pb-24">

          <motion.h2
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={0}
            className="font-display text-3xl md:text-4xl text-[#2F3E46] dark:text-[#EAE0D0] mb-3 tracking-tight text-center"
          >
            How Rooted is different
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp} custom={1}
            className="font-sans text-sm md:text-base text-[#2F3E46]/50 dark:text-[#EAE0D0]/60 text-center mb-10 max-w-md mx-auto leading-relaxed"
          >
            We made specific choices about what not to build.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.label}
                custom={i + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className={[CARD_BASE, "bg-white/25 border-white/25 dark:bg-white/6 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-md"].join(" ")}
              >
                <p className="text-2xl mb-4">{v.icon}</p>
                <p className="font-sans text-sm font-bold text-[#2F3E46]/80 dark:text-[#EAE0D0]/85 leading-snug mb-2">{v.label}</p>
                <p className="font-sans text-sm text-[#2F3E46]/45 dark:text-[#EAE0D0]/55 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp} custom={5}
            className="mt-14 text-center flex flex-col items-center gap-4"
          >
            <p className="font-display text-3xl md:text-4xl text-[#2F3E46] dark:text-[#EAE0D0] tracking-tight">
              Are you ready to branch out with Rooted?
            </p>
            <Link href="/login" className={CTA_CLASS}>
              Join Rooted
            </Link>
            <p className="font-sans text-xs text-[#2F3E46]/35 dark:text-[#EAE0D0]/40 max-w-xs leading-relaxed">
              Free to join. No algorithmic feed. No follower count. Just Houston.
            </p>
          </motion.div>
        </section>

        {/* ── Gallery ──────────────────────────────────────────────────────── */}
        <LandingGallery />

      </main>
    </AppWrapper>
  )
}
