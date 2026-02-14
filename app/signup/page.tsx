"use client"

import React, { useState } from "react"
import Link from "next/link"
import { createBrowserClient } from '@supabase/ssr'
import { AppWrapper } from "@/components/app-wrapper"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Initialize the modern SSR-friendly client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This ensures the user is sent back to your site after confirming email
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Success! Check your email to confirm your account.")
    }
    setIsLoading(false)
  }

  return (
    <AppWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl tracking-tight text-[#2F3E46] md:text-5xl">Rooted</h1>
            <p className="mt-3 font-sans text-base text-muted-foreground">Create your account to start your journey.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            {message && <p className="text-xs text-green-600 font-medium">{message}</p>}

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-[#2F3E46] py-6 text-white uppercase tracking-widest"
            >
              {isLoading ? "Creating Account..." : "Join the Vault"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-[#2F3E46] font-bold underline">Login here</Link>
          </p>
        </div>
      </main>
    </AppWrapper>
  )
}