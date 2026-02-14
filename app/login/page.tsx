"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr' // Updated import
import { AppWrapper } from "@/components/app-wrapper"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Initialize the new modern client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push("/calendar")
      router.refresh()
    }
  }

  return (
    <AppWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl tracking-tight text-[#2F3E46] md:text-5xl">Rooted</h1>
            <p className="mt-3 font-sans text-base text-muted-foreground">Welcome back to the Vault.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full bg-[#2F3E46] py-6 text-white uppercase tracking-widest">
              {isLoading ? "Authenticating..." : "Enter the Vault"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New here? <Link href="/signup" className="text-[#2F3E46] font-bold underline">Create an account</Link>
          </p>
        </div>
      </main>
    </AppWrapper>
  )
}