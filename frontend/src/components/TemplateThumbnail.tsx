/**
 * TemplateThumbnail — template preview thumbnails for resume cards.
 * Portfolio templates use real screenshot images.
 * Resume-editor templates use hand-crafted inline SVGs.
 */

type Props = { templateId: string; className?: string };

// Maps portfolio template IDs to their public screenshot images
const PORTFOLIO_IMAGES: Record<string, string> = {
  'portfolio-standard':   '/thumb-portfolio-standard.png',
  'portfolio-minimalist': '/thumb-portfolio-minimalist.png',
  'portfolio-bento':      '/thumb-portfolio-bento.png',
  'portfolio-creative':   '/thumb-portfolio-creative.png',
  'portfolio-corporate':  '/thumb-portfolio-corporate.png',
};

const PORTFOLIO_LABELS: Record<string, string> = {
  'portfolio-standard':   'Standard',
  'portfolio-minimalist': 'Minimalist',
  'portfolio-bento':      'Bento Grid',
  'portfolio-creative':   'Creative',
  'portfolio-corporate':  'Corporate',
};

export default function TemplateThumbnail({ templateId, className = '' }: Props) {
  // Portfolio templates → use real images
  if (templateId in PORTFOLIO_IMAGES) {
    return (
      <PortfolioImageThumb
        src={PORTFOLIO_IMAGES[templateId]}
        label={PORTFOLIO_LABELS[templateId]}
        bg={PORTFOLIO_BG[templateId]}
        className={className}
      />
    );
  }

  // Resume-editor templates → use SVG wireframes
  switch (templateId) {
    case 'minimal-clean':
      return <MinimalCleanThumb className={className} />;
    case 'tech-pro':
      return <TechProThumb className={className} />;
    case 'corporate':
      return <CorporateThumb className={className} />;
    case 'creative':
      return <CreativeThumb className={className} />;
    case 'terminal':
      return <TerminalThumb className={className} />;
    default:
      return <DefaultThumb className={className} />;
  }
}

// ── Portfolio image thumbnail ─────────────────────────────────────────────────

// Background colors that match each template so contain-letterboxing looks right
const PORTFOLIO_BG: Record<string, string> = {
  'portfolio-standard':   '#ffffff',
  'portfolio-minimalist': '#ffffff',
  'portfolio-bento':      '#0f172a',
  'portfolio-creative':   '#1a1a1a',
  'portfolio-corporate':  '#ffffff',
};

function PortfolioImageThumb({
  src, label, bg = '#ffffff', className = ''
}: { src: string; label: string; bg?: string; className?: string }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ backgroundColor: bg }}
    >
      <img
        src={src}
        alt={`${label} template preview`}
        className="h-full w-full object-contain object-top"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {/* Bottom gradient label */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent flex items-end px-3 pb-2 pointer-events-none">
        <span className="text-[10px] font-semibold text-white tracking-wide uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}


// ── Shared SVG helpers ────────────────────────────────────────────────────────

const W = 280;
const H = 180;

function Base({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect width={W} height={H} fill={bg} />
      {children}
    </svg>
  );
}

// ── 1. Minimal Clean ──────────────────────────────────────────────────────────
function MinimalCleanThumb({ className }: { className?: string }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Base bg="#ffffff">
        <rect x={0} y={0} width={W} height={5} fill="#6366f1" />
        <rect x={20} y={18} width={110} height={9} rx={2} fill="#1a1a2e" />
        <rect x={20} y={31} width={70} height={5} rx={2} fill="#a5b4fc" />
        <line x1={20} y1={44} x2={260} y2={44} stroke="#e5e7eb" strokeWidth={1} />
        <circle cx={245} cy={28} r={18} fill="#e0e7ff" />
        <circle cx={245} cy={23} r={7} fill="#a5b4fc" />
        <ellipse cx={245} cy={38} rx={11} ry={7} fill="#a5b4fc" />
        <rect x={20} y={52} width={50} height={5} rx={2} fill="#6366f1" />
        <rect x={20} y={62} width={180} height={4} rx={2} fill="#d1d5db" />
        <rect x={20} y={70} width={200} height={4} rx={2} fill="#d1d5db" />
        <rect x={20} y={78} width={160} height={4} rx={2} fill="#d1d5db" />
        <rect x={20} y={92} width={40} height={5} rx={2} fill="#6366f1" />
        {[0,1,2,3].map(i => (
          <rect key={i} x={20 + i * 55} y={102} width={48} height={14} rx={7} fill="#e0e7ff" />
        ))}
        <rect x={20} y={124} width={55} height={5} rx={2} fill="#6366f1" />
        <rect x={20} y={134} width={150} height={4} rx={2} fill="#d1d5db" />
        <rect x={20} y={142} width={130} height={4} rx={2} fill="#d1d5db" />
        <rect x={20} y={154} width={48} height={5} rx={2} fill="#6366f1" />
        <rect x={20} y={163} width={190} height={4} rx={2} fill="#d1d5db" />
        <rect x={20} y={171} width={140} height={4} rx={2} fill="#d1d5db" />
      </Base>
    </div>
  );
}

// ── 2. Tech Pro ───────────────────────────────────────────────────────────────
function TechProThumb({ className }: { className?: string }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Base bg="#0f172a">
        <rect x={0} y={0} width={80} height={H} fill="#0c1526" />
        <circle cx={40} cy={30} r={16} fill="#1e3a5f" />
        <circle cx={40} cy={25} r={7} fill="#38bdf8" />
        <ellipse cx={40} cy={41} rx={11} ry={7} fill="#38bdf8" />
        <rect x={10} y={52} width={60} height={5} rx={2} fill="#38bdf8" />
        <rect x={15} y={61} width={50} height={4} rx={2} fill="#334155" />
        <line x1={10} y1={73} x2={70} y2={73} stroke="#1e3a5f" strokeWidth={1} />
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={10} y={78 + i * 14} width={60} height={10} rx={2} fill="#1e3a5f" />
        ))}
        <rect x={80} y={0} width={200} height={16} fill="#0369a1" />
        <rect x={90} y={5} width={80} height={6} rx={2} fill="#e0f2fe" />
        <rect x={90} y={24} width={55} height={5} rx={2} fill="#38bdf8" />
        <rect x={90} y={34} width={170} height={4} rx={2} fill="#1e3a5f" />
        <rect x={90} y={42} width={180} height={4} rx={2} fill="#1e3a5f" />
        <rect x={90} y={50} width={150} height={4} rx={2} fill="#1e3a5f" />
        <rect x={90} y={62} width={50} height={5} rx={2} fill="#38bdf8" />
        <rect x={90} y={72} width={170} height={4} rx={2} fill="#1e3a5f" />
        <rect x={90} y={80} width={160} height={4} rx={2} fill="#1e3a5f" />
        <rect x={90} y={92} width={55} height={5} rx={2} fill="#38bdf8" />
        <rect x={90} y={102} width={140} height={4} rx={2} fill="#1e3a5f" />
        <rect x={90} y={110} width={120} height={4} rx={2} fill="#1e3a5f" />
        {[0,1,2].map(i => (
          <rect key={i} x={90 + i * 60} y={122} width={52} height={12} rx={6} fill="#0c4a6e" />
        ))}
      </Base>
    </div>
  );
}

// ── 3. Corporate ──────────────────────────────────────────────────────────────
function CorporateThumb({ className }: { className?: string }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Base bg="#f8fafc">
        <rect x={0} y={0} width={W} height={48} fill="#1e3a5f" />
        <circle cx={36} cy={24} r={16} fill="#2d5986" />
        <circle cx={36} cy={19} r={7} fill="#93c5fd" />
        <ellipse cx={36} cy={35} rx={11} ry={7} fill="#93c5fd" />
        <rect x={62} y={12} width={110} height={8} rx={2} fill="#ffffff" />
        <rect x={62} y={24} width={80} height={5} rx={2} fill="#93c5fd" />
        <rect x={62} y={33} width={110} height={4} rx={2} fill="#60a5fa" opacity={0.6} />
        <rect x={0} y={48} width={W} height={3} fill="#2563eb" />
        <rect x={12} y={58} width={50} height={5} rx={2} fill="#1e3a5f" />
        <rect x={12} y={68} width={88} height={4} rx={2} fill="#cbd5e1" />
        <rect x={12} y={76} width={80} height={4} rx={2} fill="#cbd5e1" />
        <rect x={12} y={84} width={88} height={4} rx={2} fill="#cbd5e1" />
        <rect x={12} y={96} width={45} height={5} rx={2} fill="#1e3a5f" />
        {[0,1,2,3].map(i => (
          <rect key={i} x={12} y={106 + i * 12} width={88} height={8} rx={2} fill="#dbeafe" />
        ))}
        <line x1={110} y1={56} x2={110} y2={H - 8} stroke="#e2e8f0" strokeWidth={1} />
        <rect x={120} y={58} width={60} height={5} rx={2} fill="#1e3a5f" />
        <rect x={120} y={68} width={148} height={4} rx={2} fill="#cbd5e1" />
        <rect x={120} y={76} width={140} height={4} rx={2} fill="#cbd5e1" />
        <rect x={120} y={84} width={130} height={4} rx={2} fill="#cbd5e1" />
        <rect x={120} y={96} width={55} height={5} rx={2} fill="#1e3a5f" />
        <rect x={120} y={106} width={148} height={4} rx={2} fill="#cbd5e1" />
        <rect x={120} y={114} width={130} height={4} rx={2} fill="#cbd5e1" />
        <rect x={120} y={122} width={140} height={4} rx={2} fill="#cbd5e1" />
        <rect x={120} y={134} width={60} height={5} rx={2} fill="#1e3a5f" />
        <rect x={120} y={144} width={148} height={4} rx={2} fill="#cbd5e1" />
        <rect x={120} y={152} width={120} height={4} rx={2} fill="#cbd5e1" />
      </Base>
    </div>
  );
}

// ── 4. Creative ───────────────────────────────────────────────────────────────
function CreativeThumb({ className }: { className?: string }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Base bg="#fdf4ff">
        <defs>
          <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={52} fill="url(#cg)" />
        <rect x={20} y={12} width={120} height={10} rx={3} fill="#ffffff" />
        <rect x={20} y={26} width={80} height={6} rx={2} fill="rgba(255,255,255,0.6)" />
        <circle cx={248} cy={26} r={20} fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth={2} />
        <circle cx={248} cy={21} r={8} fill="#ffffff" opacity={0.8} />
        <ellipse cx={248} cy={37} rx={13} ry={8} fill="#ffffff" opacity={0.8} />
        <rect x={0} y={52} width={W} height={4} fill="#f0abfc" />
        <rect x={20} y={64} width={45} height={6} rx={2} fill="#a855f7" />
        <rect x={20} y={74} width={240} height={3.5} rx={1.5} fill="#e9d5ff" />
        <rect x={20} y={81} width={220} height={3.5} rx={1.5} fill="#e9d5ff" />
        {[0,1,2,3].map(i => (
          <rect key={i} x={20 + i * 60} y={92} width={52} height={13} rx={6.5} fill="#f3e8ff" stroke="#d8b4fe" strokeWidth={1} />
        ))}
        <rect x={20} y={114} width={240} height={28} rx={4} fill="#ffffff" stroke="#f3e8ff" strokeWidth={1} />
        <rect x={28} y={120} width={70} height={5} rx={2} fill="#8b5cf6" />
        <rect x={28} y={129} width={180} height={3.5} rx={1.5} fill="#e9d5ff" />
        <rect x={28} y={136} width={150} height={3.5} rx={1.5} fill="#e9d5ff" />
        <rect x={20} y={148} width={240} height={24} rx={4} fill="#ffffff" stroke="#f3e8ff" strokeWidth={1} />
        <rect x={28} y={154} width={90} height={5} rx={2} fill="#ec4899" />
        <rect x={28} y={163} width={170} height={3.5} rx={1.5} fill="#fce7f3" />
      </Base>
    </div>
  );
}

// ── 5. Terminal ───────────────────────────────────────────────────────────────
function TerminalThumb({ className }: { className?: string }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Base bg="#0a0a0a">
        <rect x={0} y={0} width={W} height={18} fill="#1a1a1a" />
        <circle cx={12} cy={9} r={4} fill="#ef4444" />
        <circle cx={26} cy={9} r={4} fill="#f59e0b" />
        <circle cx={40} cy={9} r={4} fill="#10b981" />
        <rect x={90} y={5} width={100} height={8} rx={2} fill="#2a2a2a" />
        {[
          { y: 28, content: 80, color: '#10b981' },
          { y: 40, content: 140, color: '#6ee7b7' },
          { y: 52, content: 100, color: '#6ee7b7' },
          { y: 64, content: 60,  color: '#10b981' },
          { y: 76, content: 160, color: '#6ee7b7' },
          { y: 88, content: 130, color: '#6ee7b7' },
          { y: 100, content: 90, color: '#6ee7b7' },
          { y: 112, content: 70, color: '#10b981' },
          { y: 124, content: 150, color: '#6ee7b7' },
          { y: 136, content: 115, color: '#6ee7b7' },
          { y: 148, content: 138, color: '#6ee7b7' },
          { y: 160, content: 50, color: '#10b981' },
          { y: 172, content: 80, color: '#6ee7b7' },
        ].map((line, i) => (
          <g key={i}>
            <rect x={14} y={line.y} width={10} height={4} rx={1} fill={line.color} opacity={0.9} />
            <rect x={28} y={line.y} width={line.content} height={4} rx={1} fill={line.color} opacity={0.5} />
          </g>
        ))}
        <rect x={14} y={172} width={6} height={8} rx={1} fill="#10b981" opacity={0.8} />
      </Base>
    </div>
  );
}

// ── Default fallback ──────────────────────────────────────────────────────────
function DefaultThumb({ className }: { className?: string }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Base bg="#27272a">
        <rect x={20} y={20} width={100} height={8} rx={2} fill="#52525b" />
        <rect x={20} y={36} width={200} height={4} rx={2} fill="#3f3f46" />
        <rect x={20} y={46} width={180} height={4} rx={2} fill="#3f3f46" />
      </Base>
    </div>
  );
}
