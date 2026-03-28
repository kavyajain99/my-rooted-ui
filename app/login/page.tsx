"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
import { AppWrapper } from "@/components/app-wrapper"
import { TopographicBackground } from "@/components/topographic-background"

const SAGE = "#2C6B5F"

export default function LoginPage() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]       = useState("")
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    // Restore name to sessionStorage so calendar header works immediately
    const fullName = data.user?.user_metadata?.full_name
    if (fullName) sessionStorage.setItem("rootedName", fullName)

    // If they've already done onboarding, skip straight to the Vault
    const onboardingDone = data.user?.user_metadata?.onboarding_complete
    router.push(onboardingDone ? "/calendar" : "/onboarding")
    router.refresh()
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
            <p className="mt-2 text-sm text-[#2F3E46]/60 font-medium">Welcome back to the Vault.</p>
          </div>

          <div className="bg-[#F4F1EA]/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl border border-white/40">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center rounded-2xl py-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all disabled:opacity-30"
                style={{ backgroundColor: SAGE }}
              >
                {isLoading ? "Authenticating…" : "Enter the Vault"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-[#2F3E46]/50">
            New here?{" "}
            <Link href="/signup" className="font-bold text-[#2F3E46] underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </AppWrapper>
  )
}
