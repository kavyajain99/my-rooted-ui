"use client"

interface CalendarGridProps {
  month: "january" | "february"
  onEventClick: (event: any) => void
  events: any[]
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const MONTH_CONFIG = {
  january: { year: 2026, daysInMonth: 31, startDay: 4, monthIdx: 0 },
  february: { year: 2026, daysInMonth: 28, startDay: 0, monthIdx: 1 },
}

function getVibeFromEnergy(energyData: any): string {
  const label = typeof energyData === 'string' 
    ? energyData 
    : (energyData?.label || "");
    
  const e = label.toLowerCase();
  if (e.includes('kinetic')) return "kinetic";
  if (e.includes('introspective')) return "introspective";
  if (e.includes('cocreative')) return "cocreative";
  return "parallel";
}

function getVibeColor(vibe: string): string {
  switch (vibe) {
    case "introspective": return "bg-[#7A8B7C]";
    case "parallel": return "bg-[#D4A373]";
    case "cocreative": return "bg-[#B38B6D]";
    case "kinetic": return "bg-[#C4785C]";
    default: return "bg-primary";
  }
}

function getVibeBgColor(vibe: string): string {
  switch (vibe) {
    case "introspective": return "bg-[#7A8B7C]/10";
    case "parallel": return "bg-[#D4A373]/10";
    case "cocreative": return "bg-[#B38B6D]/10";
    case "kinetic": return "bg-[#C4785C]/10";
    default: return "bg-card";
  }
}

export function CalendarGrid({ month, onEventClick, events = [] }: CalendarGridProps) {
  const config = MONTH_CONFIG[month];
  const totalCells = Math.ceil((config.startDay + config.daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - config.startDay + 1;
    return dayNumber > 0 && dayNumber <= config.daysInMonth ? dayNumber : null;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end px-2">
        <h2 className="font-display text-5xl capitalize text-[#2F3E46] tracking-tighter">
          {month} <span className="opacity-30">2026</span>
        </h2>
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] pb-2">
          Houston, TX
        </span>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/40 backdrop-blur-md shadow-sm">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="px-2 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            const dayEvents = events.filter(e => {
              if (!day) return false;
              
              // Try to find the date in multiple possible locations
              const dateSource = e.event_date || e.raw_json?.event_date || e.raw_json?.date;
              if (!dateSource) return false;

              const dObj = new Date(dateSource);
              
              // Matching using UTC to prevent timezone shifts
              return (
                dObj.getUTCDate() === day && 
                dObj.getUTCMonth() === config.monthIdx
              );
            });

            const dominantVibe = dayEvents.length > 0 
              ? getVibeFromEnergy(dayEvents[0].social_energy || dayEvents[0].raw_json?.social_energy) 
              : null;
            
            return (
              <div
                key={index}
                className={`min-h-[120px] border-b border-r border-border p-3 transition-all duration-300 ${
                  day ? (dominantVibe ? getVibeBgColor(dominantVibe) : "bg-card/40") : "bg-muted/5"
                }`}
              >
                {day && (
                  <>
                    <span className="font-display text-xs font-bold opacity-20">{day}</span>
                    <div className="mt-3 space-y-2">
                      {dayEvents.map((event) => {
                        const vibe = getVibeFromEnergy(event.social_energy || event.raw_json?.social_energy);
                        return (
                          <button
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className="group flex w-full items-start gap-2 text-left"
                          >
                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getVibeColor(vibe)} shadow-sm transition-transform group-hover:scale-125`} />
                            <span className="text-[10px] leading-tight font-semibold line-clamp-2 text-[#2F3E46] group-hover:text-primary transition-colors uppercase tracking-tight">
                              {event.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}