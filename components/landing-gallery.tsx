"use client"

import { motion } from "framer-motion"

function PlaceholderSlot({
  label,
  color,
  className = "",
}: {
  label: string
  color: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl flex items-end p-4 md:p-5 ${className}`}
      style={{ backgroundColor: color }}
    >
      <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/30">
        {label}
      </p>
    </div>
  )
}

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.12 },
  }),
}

export function LandingGallery() {
  return (
    <section className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 pb-24">

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
        className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#2F3E46]/35 text-center mb-5"
      >
        Houston, Connecting
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">

        {/* Large landscape — left */}
        <motion.div custom={0} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} variants={fadeUp}
          className="md:col-span-7 aspect-[16/9]"
        >
          <PlaceholderSlot label="The Collective" color="#D4CEBE" className="w-full h-full" />
        </motion.div>

        {/* Square — right */}
        <motion.div custom={1} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} variants={fadeUp}
          className="md:col-span-5 aspect-square"
        >
          <PlaceholderSlot label="Community Meetup" color="#C8CBBB" className="w-full h-full" />
        </motion.div>

        {/* Wide banner — full width */}
        <motion.div custom={2} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} variants={fadeUp}
          className="md:col-span-12 aspect-[4/1]"
        >
          <PlaceholderSlot label="Slow Dopamine" color="#C0C4BB" className="w-full h-full" />
        </motion.div>

      </div>
    </section>
  )
}
