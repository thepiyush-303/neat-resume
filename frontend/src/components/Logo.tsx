export default function Logo({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background document / paper */}
      <path 
        d="M10,20 C10,12 16,6 24,6 L66,6 L90,30 L90,100 C90,108 84,114 76,114 L24,114 C16,114 10,108 10,100 L10,20 Z" 
        fill="#E8EEF6" 
      />
      {/* Folded corner */}
      <path 
        d="M66,6 L66,24 C66,27 69,30 72,30 L90,30 L66,6 Z" 
        fill="#D4E0F0" 
      />
      {/* Short line right of avatar */}
      <rect x="52" y="44" width="22" height="6" rx="3" fill="#B9CEE6" />
      {/* Body of avatar */}
      <path 
        d="M26,50 C26,42 32,38 40,38 C48,38 54,42 54,50 L54,52 C54,55 51,58 48,58 L32,58 C29,58 26,55 26,52 L26,50 Z" 
        fill="#058FF0" 
      />
      {/* Head of avatar (overlapping a bit) */}
      <circle cx="40" cy="27" r="10" fill="#058FF0" />
      {/* Text lines */}
      <rect x="24" y="66" width="52" height="6" rx="3" fill="#B9CEE6" />
      <rect x="24" y="80" width="52" height="6" rx="3" fill="#B9CEE6" />
      <rect x="24" y="94" width="38" height="6" rx="3" fill="#B9CEE6" />
    </svg>
  );
}
