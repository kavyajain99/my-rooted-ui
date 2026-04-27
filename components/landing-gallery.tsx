"use client"

import Image from "next/image"
import { motion } from "framer-motion"


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
        className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F3E46]/35 text-center mb-5"
      >
        Houston, Connecting
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">

        {/* Large landscape — left · Sound Bath Houston */}
        <motion.div custom={0} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} variants={fadeUp}
          className="md:col-span-7 aspect-[16/9] relative overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/sound-bath-houston.webp"
            alt="Sound Bath Houston"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-[10px] font-bold text-white/90 tracking-wide">Sound Bath · Houston</span>
          </div>
        </motion.div>

        {/* Square — right · Freaks Run Club photo */}
        <motion.div custom={1} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} variants={fadeUp}
          className="md:col-span-5 aspect-[3/2] md:aspect-auto relative overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/freaks-run-club.webp"
            alt="Freaks Run Club Houston"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
          {/* Attribution overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <svg className="w-3 h-3 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-[10px] font-bold text-white/90 tracking-wide">@baldyphotos</span>
            <span className="text-[10px] text-white/50 mx-0.5">·</span>
            <span className="text-[10px] text-white/70 tracking-wide">Freaks Run Club</span>
          </div>
        </motion.div>

        {/* Wide banner — full width · Houston Plant Con */}
        <motion.div custom={2} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} variants={fadeUp}
          className="md:col-span-12 aspect-[4/1] relative overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/houston-plant-con.webp"
            alt="Houston Plant Con"
            fill
            className="object-cover object-[center_15%]"
            sizes="100vw"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-[10px] font-bold text-white/90 tracking-wide">Houston Plant Con</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
