"use client"

import Link from "next/link"
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <AppWrapper>
      <main className="relative min-h-screen pb-20 overflow-x-hidden">
        <TopographicBackground />

        {/* Back Button */}
        <div className="relative z-20 max-w-3xl mx-auto px-6 pt-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-sans uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <article className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-32">
          {/* Header */}
          <header className="mb-16">
            <h1 className="font-display text-5xl md:text-7xl mb-6 text-[#2F3E46]">
              Rooted
            </h1>
            <p className="text-xl italic font-display text-[#2F3E46]/70">
              An In-Person Belonging Engine for a Digital World.
            </p>
          </header>

          {/* The Narrative */}
          <div className="space-y-8 font-sans text-lg leading-relaxed text-[#2F3E46]/90">
            <section className="space-y-6">
              <p>
                I’ve grown to dislike being asked where I’m from – because I don’t have 
                the answer, or even a good answer. I’ve moved so many times, participated 
                on the sidelines of so many cultures, but am never quite from one… one place, 
                one community. 

              </p>
              
              <p>
                This year, reading Isabelle Allende’s <em className="italic">My Invented Country</em>, 
                I realized this feeling —belonging everywhere and nowhere— is a shared experience. 
                When home is no longer guaranteed by cultural tradition or geography, it must be built 
                deliberately through connection, shared meaning, and chosen community. 
                <strong> Home is not just a place, but a **feeling* *, and one you can build.</strong>
              </p>
            </section>

            <section className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl border border-white/20 my-12">
              <h2 className="font-display text-2xl mb-4 italic">The Project</h2>
              <p>
                I’ve tried, I’ve failed, I’ve made friends, I’ve lost them, 
                I’ve moved across the country and done it again... and again. 
                Now, I’m working again on building a place that feels like home. 
                It takes time, effort, and emotional resilience. 
                I want to create a boilerplate that expedites this process for others. 
                I aspire to build a platform that helps us spend more time feeling inspired and connected—the comforts 
                of a like minded community, feeling a part of something, like we belong. 
              </p>
            </section>

            <section className="space-y-6">
              <p>
                Technology (social media) and AI have inadvertently pulled us apart. We hesitate to drive 
                thirty minutes when we could just call; we lean away from asking for human help, and instead 
                bare our questions (and sometimes soul) to an unfeeling AI. Though these actions are more efficient, 
                yes, but are they human? Do they fill our need to belong?

              </p>
              <p className="font-display text-2xl text-center py-8">
                "What if this very same tech stack—with a different intention—could help us 
                return to connecting in person?"
              </p>
            </section>

            <section className="space-y-6">
            <p>
                As we move through 2026, the cultural tide is turning toward a <strong>slow dopamine lifestyle</strong>. 
                We are trading digital noise for intentional movement and <strong>in-person wellness challenges</strong>. 
                From the community driven energy of  <strong>ice baths & saunas</strong>,  
                to the social rhythm of <strong>pickleball and racket sports</strong>, fitness is becoming our new 
                shared language. In a world of doomscrolling, and the 9/9/6 lifestyle, sleep has become the new status symbol, 
                and <strong>offline fitness culture is the anchor of our social identity</strong>. Rooted is built to help you find your path in this 
                movement, facilitating the real world connections that a screen simply can't achieve.
            </p>
            </section>

            {/* Purpose/Scope Section */}
            <section className="pt-12 border-t border-[#2F3E46]/10 space-y-6">
              <h3 className="font-sans font-bold uppercase tracking-tighter text-sm">The Mission</h3>
              <p>
                Rooted is designed by humans and curated by friendly AI to solve the 
                growing epidemic of loneliness. We have more mobility than our ancestors ever 
                dreamed of, but that freedom has left a void. As we shift away from traditional 
                institutions, we are searching for purpose defined via relationships 
                and shared spaces.
              </p>
              <p>
                Rooted is not an event app; it is a **belonging engine**. We connect those in 
                fringe, creative, and mindful spaces, from plant based living to mahjong nights to run clubs.
              </p>
            </section>
          </div>

          <section className="mt-16 pt-8 border-t border-[#2F3E46]/10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <p className="font-display italic text-[#2F3E46]/60">
                This site was made for you.
              </p>
              <div className="h-px w-12 bg-[#2F3E46]/20" />
              
              {/* Linked Signature */}
              <a 
                href="https://www.linkedin.com/in/kavya2024/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <span className="font-sans text-sm uppercase tracking-[0.3em] text-[#2F3E46] transition-all group-hover:tracking-[0.4em]">
                  Kavya 
                </span>
                <span className="h-[1px] w-0 bg-[#2F3E46]/30 transition-all group-hover:w-full mt-1" />
              </a>
            </div>
          </section>

          <footer className="mt-20 text-center space-y-8">
            <Link 
              href="/signup" 
              className="inline-block bg-[#2F3E46] text-[#F4F1EA] px-10 py-4 rounded-full font-sans uppercase tracking-widest text-sm hover:bg-[#3d4f59] transition-all shadow-xl hover:-translate-y-1"
            >
              Join the Community
            </Link>
            
            <div className="pt-8">
              <Link 
                href="/login" 
                className="text-xs font-sans uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Already have a key? Login
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </AppWrapper>
  )
}