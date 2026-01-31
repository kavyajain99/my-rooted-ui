"use client"

export function TopographicBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      <svg
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Layer 1 - Cream/Oat (top) */}
        <path
          d="M0 180C120 160 240 200 360 180C480 160 600 120 720 140C840 160 960 200 1080 180C1200 160 1320 140 1440 160V400H0V180Z"
          fill="#F4F1EA"
        />
        
        {/* Layer 2 - Muted Sage */}
        <path
          d="M0 220C100 200 200 240 320 220C440 200 520 180 680 200C840 220 920 260 1080 240C1200 220 1320 200 1440 220V400H0V220Z"
          fill="#7A8B7C"
          fillOpacity="0.4"
        />
        
        {/* Layer 3 - Mustard/Gold */}
        <path
          d="M0 260C140 240 280 280 400 260C520 240 640 220 760 240C880 260 1000 300 1120 280C1240 260 1360 240 1440 260V400H0V260Z"
          fill="#D4A373"
          fillOpacity="0.5"
        />
        
        {/* Layer 4 - Clay */}
        <path
          d="M0 300C180 280 300 320 440 300C580 280 700 260 840 280C980 300 1100 340 1220 320C1340 300 1400 280 1440 300V400H0V300Z"
          fill="#B38B6D"
          fillOpacity="0.5"
        />
        
        {/* Layer 5 - Terracotta (bottom) */}
        <path
          d="M0 340C160 320 320 360 480 340C640 320 800 300 960 320C1120 340 1280 380 1440 360V400H0V340Z"
          fill="#C4785C"
          fillOpacity="0.4"
        />
        
        {/* Layer 6 - Deep Slate accent */}
        <path
          d="M0 370C200 350 400 390 600 370C800 350 1000 330 1200 350C1320 360 1400 380 1440 380V400H0V370Z"
          fill="#2F3E46"
          fillOpacity="0.2"
        />
      </svg>
    </div>
  )
}
