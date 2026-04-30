"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { X } from "lucide-react"

const DELAY_MS   = 3 * 60 * 1000
const SESSION_KEY = "rooted_signup_nudge_shown"

export function SoftSignupDialog() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const timer = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setShow(true)
        sessionStorage.setItem(SESSION_KEY, "1")
      }
    }, DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-[#2F3E46]/50 backdrop-blur-sm"
        onClick={() => setShow(false)}
      />
      <div className="relative w-full max-w-sm rounded-[2rem] bg-[#F4F1EA] p-8 shadow-2xl animate-in slide-in-from-bottom duration-400">
        <button
          onClick={() => setShow(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-[#2F3E46]/40" />
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2C6B5F]/70 mb-3">
          Houston · Community · Belonging
        </p>
        <h2 className="font-display text-2xl md:text-3xl text-[#2F3E46] leading-tight mb-3">
          Your people are here.
        </h2>
        <p className="font-sans text-sm text-[#2F3E46]/55 leading-relaxed mb-8">
          Trail runners, bookish types, fermenters, vinyl collectors — Rooted surfaces the events they're already going to. Save them, show up, and let the rest happen.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex items-center justify-center rounded-full bg-[#2C6B5F] px-8 py-4 font-sans text-sm font-semibold tracking-wide text-[#F4F1EA] shadow-lg transition-all hover:bg-[#2C6B5F]/90"
          >
            Join Rooted
          </Link>
          <button
            onClick={() => setShow(false)}
            className="font-sans text-xs text-[#2F3E46]/35 hover:text-[#2F3E46]/60 transition-colors py-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
