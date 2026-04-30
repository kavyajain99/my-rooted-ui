"use client"

export const dynamic = 'force-dynamic'

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"
import { Button } from "@/components/ui/button"

const SAGE = "#2C6B5F"

export default function SignUpPage() {
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]       = useState("")
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim(),
          onboarding_complete: false,
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    // Persist name so onboarding & calendar can read it immediately
    if (name.trim()) {
      sessionStorage.setItem("rootedName", name.trim())
    }

    router.push("/onboarding")
  }

  const inputClass = "w-full rounded-2xl border border-white/40 bg-white/60 backdrop-blur-sm px-5 py-3.5 text-sm text-[#2F3E46] placeholder:text-[#2F3E46]/30 focus:outline-none focus:ring-2 focus:ring-[#2C6B5F]/25 transition-all"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/50"

  return (
    <AppWrapper>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
        <TopographicBackground />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl tracking-tight text-[#2F3E46]">Rooted</h1>
            <p className="mt-2 text-sm text-[#2F3E46]/60 font-medium">Create your account to start your journey.</p>
          </div>

          <div className="bg-[#F4F1EA]/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl border border-white/40">
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <label className={labelClass}>Your Name</label>
                <input
                  type="text"
                  placeholder="First name or nickname"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
                {/* Whimsical annotation */}
                <div className="flex items-start gap-2 pt-0.5 pl-2">
                  <svg
                    width="30" height="36" viewBox="0 0 30 36"
                    fill="none" className="flex-shrink-0 mt-0.5 opacity-40"
                  >
                    <path
                      d="M4 34 C5 28, 1 24, 5 19 C9 14, 16 17, 18 12 C20 7, 21 4, 24 1"
                      stroke="#2C6B5F" strokeWidth="1.5" strokeLinecap="round"
                    />
                    <path
                      d="M24 1 L18 5 M24 1 L27 7"
                      stroke="#2C6B5F" strokeWidth="1.5" strokeLinecap="round"
                    />
                  </svg>
                  <p className="font-display italic text-[12px] text-[#2C6B5F]/50 leading-snug -rotate-1 select-none">
                    we'll send your weekly<br />Houston events here —<br />nothing else, promise 🌱
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="mt-2 flex w-full items-center justify-center rounded-2xl py-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all disabled:opacity-30"
                style={{ backgroundColor: SAGE }}
              >
                {isLoading ? "Creating account…" : "Join the Vault"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-[#2F3E46]/50">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#2F3E46] underline">
              Login here
            </Link>
          </p>
        </div>
      </main>
    </AppWrapper>
  )
}
