export default function BotIcon({ className = 'w-6 h-6', faceColor = 'white' }: { className?: string; faceColor?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="8" r="4" fill="currentColor" />
      <rect x="30" y="11" width="4" height="8" rx="2" fill="currentColor" />
      <rect x="10" y="18" width="44" height="36" rx="14" fill="currentColor" />
      <ellipse cx="24" cy="35" rx="5" ry="5.5" fill={faceColor} />
      <ellipse cx="40" cy="35" rx="5" ry="5.5" fill={faceColor} />
      <rect x="24" y="44" width="16" height="3" rx="1.5" fill={faceColor} />
      <rect x="4" y="30" width="6" height="12" rx="3" fill="currentColor" />
      <rect x="54" y="30" width="6" height="12" rx="3" fill="currentColor" />
    </svg>
  )
}
