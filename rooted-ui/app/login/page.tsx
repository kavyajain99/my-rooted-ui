"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppWrapper } from "@/components/app-wrapper"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login - replace with actual auth logic
    setTimeout(() => {
      router.push("/calendar")
    }, 800)
  }

  return (
    <AppWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Back to Home */}
        <div className="absolute left-6 top-6">
          <Link 
            href="/"
            className="flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Back</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center">
            <Link href="/">
              <h1 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
                Rooted
              </h1>
            </Link>
            <p className="mt-3 font-sans text-base text-muted-foreground">
              Welcome back. Find your community.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block font-sans text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block font-sans text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button 
                type="button"
                className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary py-3 font-sans text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Entering...</span>
                </span>
              ) : (
                "Enter the Vault"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="font-sans text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="font-sans text-sm text-muted-foreground">
              New to Rooted?{" "}
              <button className="font-medium text-primary transition-colors hover:text-primary/80">
                Create an account
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-12 text-center font-sans text-xs text-muted-foreground/60">
            By continuing, you agree to our community guidelines.
          </p>
        </div>
      </main>
    </AppWrapper>
  )
}
