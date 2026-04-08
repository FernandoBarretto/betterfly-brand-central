interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-green-950 px-5 sm:px-8 lg:px-16 py-12 sm:py-20 relative overflow-hidden">
      {/* Butterfly decorative elements */}
      <span className="absolute top-8 right-20 text-5xl opacity-15 rotate-[-18deg] select-none pointer-events-none">🦋</span>
      <span className="absolute bottom-8 right-40 text-3xl opacity-10 rotate-[12deg] select-none pointer-events-none">🦋</span>
      <span className="absolute top-1/2 right-8 text-2xl opacity-10 rotate-[25deg] select-none pointer-events-none">🦋</span>

      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-green-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Wordmark in top corner */}
        <div className="flex items-center justify-between mb-10">
          <p className="text-green-400 text-xs font-bold uppercase tracking-widest">{eyebrow}</p>
          <img
            src="/betterfly-wordmark.png"
            alt="Betterfly"
            className="h-5 w-auto object-contain opacity-40"
          />
        </div>

        <h1
          className="text-white text-4xl sm:text-5xl lg:text-7xl font-black leading-none mb-4"
          style={{ fontFamily: "'Obviously Narrow', sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/60 font-sans text-lg max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
