export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" rx="120" fill="url(#gradient)"/>
        <g transform="translate(256, 256)">
          <circle cx="-80" cy="0" r="45" fill="none" stroke="white" strokeWidth="12" opacity="0.4"/>
          <circle cx="0" cy="0" r="50" fill="none" stroke="white" strokeWidth="14"/>
          <circle cx="80" cy="0" r="45" fill="none" stroke="white" strokeWidth="12" opacity="0.6"/>
          <line x1="-35" y1="0" x2="-50" y2="0" stroke="white" strokeWidth="10" opacity="0.5"/>
          <line x1="35" y1="0" x2="50" y2="0" stroke="white" strokeWidth="10" opacity="0.5"/>
          <circle cx="0" cy="0" r="18" fill="white"/>
        </g>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#6366F1"}} />
            <stop offset="100%" style={{stopColor:"#8B5CF6"}} />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Sequencia
      </span>
    </div>
  );
}
