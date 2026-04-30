"use client"

import { ReactNode } from "react"
import { SoftSignupDialog } from "@/components/soft-signup-dialog"

interface AppWrapperProps {
  children: ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <SoftSignupDialog />
    </div>
  )
}
