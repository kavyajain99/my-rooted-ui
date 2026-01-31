"use client"

import { Event, Vibe, vibeInfo } from "@/lib/events"
import { useEffect } from "react"

interface EventCardProps {
  event: Event
  onClose: () => void
}

function getVibeColor(vibe: Vibe): string {
  switch (vibe) {
    case "introspective":
      return "bg-vibe-introspective"
    case "parallel":
      return "bg-vibe-parallel"
    case "cocreative":
      return "bg-vibe-cocreative"
    case "kinetic":
      return "bg-vibe-kinetic"
  }
}

function getVibeBgColor(vibe: Vibe): string {
  // These are the vibe colors blended with white at 10% opacity
  switch (vibe) {
    case "introspective":
      return "#F0F2F0" // Sage tinted white
    case "parallel":
      return "#FCF7F1" // Mustard tinted white
    case "cocreative":
      return "#F8F3EF" // Clay tinted white
    case "kinetic":
      return "#F9F1ED" // Terracotta tinted white
  }
}

function formatDate(date: number, month: "january" | "february"): string {
  const monthName = month.charAt(0).toUpperCase() + month.slice(1)
  return `${monthName} ${date}, 2026`
}

function getVibeBgStyle(vibe: Vibe): string {
  return getVibeBgColor(vibe)
}

export function EventCard({ event, onClose }: EventCardProps) {
  const vibe = vibeInfo[event.vibe]

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-title"
    >
      <div 
        className="relative w-full max-w-lg rounded-xl p-8 shadow-xl md:p-10"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: getVibeBgStyle(event.vibe) }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground md:right-6 md:top-6"
          aria-label="Close event details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Event content */}
        <div className="space-y-6">
          {/* Title */}
          <h2 
            id="event-title"
            className="font-display text-2xl leading-tight text-foreground md:text-3xl"
          >
            {event.title}
          </h2>

          {/* Energy */}
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${getVibeColor(event.vibe)}`} />
            <span className="font-sans text-sm text-muted-foreground">
              {vibe.label} — {event.vibeDescriptor}
            </span>
          </div>

          {/* Match Narrative */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="font-sans text-sm italic leading-relaxed text-foreground/80">
              {event.matchNarrative}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4 border-t border-border pt-6">
            {/* Place & Address */}
            <div>
              <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Place
              </h3>
              <p className="mt-1 font-sans text-foreground">{event.place}</p>
              <p className="font-sans text-sm text-muted-foreground">{event.address}</p>
            </div>

            {/* Time */}
            <div>
              <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Time
              </h3>
              <p className="mt-1 font-sans text-foreground">
                {formatDate(event.date, event.month)}
              </p>
              <p className="font-sans text-sm text-muted-foreground">{event.time}</p>
            </div>

            {/* Cost */}
            <div>
              <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cost
              </h3>
              <p className="mt-1 font-sans text-foreground">{event.cost}</p>
            </div>

            {/* To Bring */}
            <div>
              <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
                To Bring
              </h3>
              <p className="mt-1 font-sans text-foreground">{event.toBring}</p>
            </div>
          </div>

          {/* Event Link */}
          <div className="border-t border-border pt-6">
            <a
              href={event.eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-sans text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90"
            >
              <span>View Event Page</span>
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
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" x2="21" y1="14" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
