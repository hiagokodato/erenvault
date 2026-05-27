/** Ilustração minimalista do Eren — silhueta de gato no cofre (SVG inline). */
export function ErenMascot({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="100" cy="130" rx="70" ry="12" fill="rgb(var(--primary) / 0.08)" />
      <path
        d="M40 95 Q30 50 55 35 L70 55 L85 30 L100 50 L115 28 L130 52 L145 38 Q170 55 160 95 Q155 120 100 125 Q45 120 40 95 Z"
        fill="rgb(var(--card))"
        stroke="rgb(var(--primary) / 0.5)"
        strokeWidth="1.5"
      />
      <path d="M55 38 L48 18 L62 32 Z" fill="rgb(var(--card))" stroke="rgb(var(--primary) / 0.4)" />
      <path d="M145 38 L152 18 L138 32 Z" fill="rgb(var(--card))" stroke="rgb(var(--primary) / 0.4)" />
      <circle cx="82" cy="72" r="5" fill="rgb(var(--primary))" />
      <circle cx="118" cy="72" r="5" fill="rgb(var(--primary))" />
      <circle cx="84" cy="70" r="1.5" fill="rgb(var(--bg))" />
      <circle cx="120" cy="70" r="1.5" fill="rgb(var(--bg))" />
      <path
        d="M95 88 Q100 92 105 88"
        stroke="rgb(var(--primary) / 0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="60"
        y="100"
        width="80"
        height="28"
        rx="6"
        fill="rgb(var(--primary) / 0.12)"
        stroke="rgb(var(--border))"
      />
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fill="rgb(var(--muted))"
        fontSize="9"
        fontFamily="system-ui"
      >
        cofre
      </text>
    </svg>
  )
}
