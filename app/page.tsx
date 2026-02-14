"use client"

import Link from "next/link"
import { TopographicBackground } from "@/components/topographic-background"
import { AppWrapper } from "@/components/app-wrapper"

export default function LandingPage() {
  return (
    <AppWrapper>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0">
          <TopographicBackground />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="font-display text-6xl tracking-tight text-foreground md:text-8xl lg:text-9xl">
            Rooted
          </h1>
          <p className="mt-6 font-display text-xl text-foreground/80 md:text-2xl">
            A belonging engine for Houston.
          </p>

          {/* the login button */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-sans text-base font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl md:text-lg"
            >
              <span>Enter the Vault</span>
            </Link>
            
            {/* the about button */}
            <Link 
              href="/about" 
              className="text-sm font-sans uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-all border-b border-transparent hover:border-foreground"
            >
              Read the Manifesto
            </Link>
          </div>
        </div>
      </main>
    </AppWrapper>
  )
}