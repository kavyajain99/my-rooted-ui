"use client"

import { X, MapPin, Calendar, Clock, Sparkles, CreditCard, ShoppingBag, Info } from "lucide-react"

interface EventCardProps {
  event: any
  onClose: () => void
}

export function EventCard({ event, onClose }: EventCardProps) {
  if (!event) return null

  // Use the rich JSON if it exists, otherwise fallback to top level
  const data = event.raw_json || event;
  const energy = data.social_energy || {}
  const logistics = data.logistics || {}
  const metadata = data.metadata || {}

  const dateDisplay = (data.event_date || data.date)
    ? new Date(data.event_date || data.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : "Date TBA"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#2F3E46]/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative h-full w-full max-w-xl overflow-y-auto rounded-[2.5rem] bg-[#F4F1EA] p-8 md:p-12 shadow-2xl animate-in slide-in-from-right duration-500">
        
        {/* Vibe Badge */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-2">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
              style={{ 
                color: energy.color || '#D4A373', 
                borderColor: energy.color || '#D4A373' 
              }}
            >
              <Sparkles className="w-3 h-3" />
              {energy.label || "Community"} Energy
            </div>
            {energy.description && (
              <p className="text-[10px] text-[#2F3E46]/40 font-bold uppercase tracking-tight">
                {energy.description}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <X className="w-6 h-6 text-[#2F3E46]" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-[#2F3E46] tracking-tight">
              {data.title}
            </h2>
            <div className="flex items-center gap-2 text-[#2F3E46]/60 font-semibold text-sm">
              <MapPin className="w-4 h-4 opacity-40" />
              <span>{data.place || "Houston"} • {metadata.neighborhood || "Local"}</span>
            </div>
          </div>

          <div className="bg-white/60 rounded-[2rem] p-8 border border-white/40 shadow-sm">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F3E46]/30 mb-4 flex items-center gap-2">
               <Info className="w-3 h-3" /> Vibe Check
             </h3>
             <p className="font-serif italic text-xl text-[#2F3E46] leading-relaxed">
               "{data.vibe_check || "A perfect match for your current intent."}"
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-black/5">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><Calendar className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">When</p>
                  <p className="text-sm font-bold text-[#2F3E46]">{dateDisplay}</p>
                  <p className="text-xs font-medium text-[#2F3E46]/60">{data.event_time}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><MapPin className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Where</p>
                  <p className="text-sm font-bold text-[#2F3E46] leading-tight">{data.address || "Check details for location"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><CreditCard className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Cost</p>
                  <p className="text-sm font-bold text-[#2F3E46]">{logistics.cost || "Free or Varies"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-white/50 text-[#2F3E46]/40"><ShoppingBag className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Bring</p>
                  <p className="text-sm font-bold text-[#2F3E46]">{logistics.to_bring || "Just yourself"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <a
              href={logistics.url || data.url || "#"}
              target="_blank"
              className="flex w-full items-center justify-center rounded-2xl py-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]"
              style={{ backgroundColor: energy.color || '#2F3E46' }}
            >
              Secure your spot
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}