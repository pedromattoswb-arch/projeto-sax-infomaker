import { Folder, Search, Play, Mic, ChevronRight, Music, FileText, Headphones, ArrowRight } from "lucide-react";

const folders = [
  { name: "Música Popular Brasileira (MPB)", count: 850 },
  { name: "Gospel & Louvor", count: 780 },
  { name: "Jazz Standards", count: 620 },
  { name: "Pop Internacional", count: 540 },
  { name: "Rock Clássico", count: 480 },
  { name: "Bossa Nova", count: 350 },
  { name: "Sertanejo", count: 320 },
  { name: "Românticas & Casamento", count: 280 },
  { name: "Trilhas de Filmes & Séries", count: 260 },
  { name: "Flashback & Nostalgia", count: 450 },
  { name: "Samba & Pagode", count: 310 },
  { name: "Blues & Soul", count: 240 },
  { name: "Forró & Nordeste", count: 220 },
  { name: "Músicas de Natal", count: 180 },
  { name: "Harpa Cristã Completa", count: 640 },
  { name: "Saxofonistas Famosos", count: 190 },
  { name: "Música Clássica & Erudita", count: 170 },
  { name: "Músicas para Eventos", count: 150 },
];

const sampleFiles = [
  { name: "Careless Whisper.pdf", type: "pdf" },
  { name: "Careless Whisper - Playback.mp3", type: "audio" },
  { name: "Garota de Ipanema.pdf", type: "pdf" },
  { name: "Garota de Ipanema - Playback.mp3", type: "audio" },
];

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

const AppSimulation = () => {
  return (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-section-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(38_85%_50%/0.04)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
            Interface do Aluno
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight">
            Navegue pela plataforma <br className="hidden md:block" />
            <span className="text-primary italic">como se fosse um App</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto">
            Uma experiência limpa, intuitiva e pensada para facilitar o seu estudo. Encontre, abra e toque — simples assim.
          </p>
        </div>

        {/* Phone/Tablet mockup refined */}
        <div className="max-w-md mx-auto relative">
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-primary/10 blur-[40px] rounded-[3rem] pointer-events-none opacity-50" />
          
          <div className="rounded-[2.5rem] border-[4px] border-white/5 glass-card shadow-elite overflow-hidden relative">
            {/* Simulation banner refined */}
            <div className="bg-primary text-white text-center py-2.5 px-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 relative z-20">
              <Lock className="w-3.5 h-3.5" />
              Simulação do Acervo Real
            </div>

            {/* App header refined */}
            <div className="bg-background/80 backdrop-blur-md border-b border-white/5 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <span className="font-heading font-black text-sm tracking-tight">SaxPlay</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live</span>
              </div>
            </div>

            {/* Search bar mock refined */}
            <div className="px-6 py-5 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3 bg-background/50 rounded-2xl px-4 py-3 border border-white/10 shadow-soft">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground/50 font-semibold tracking-wide flex-1 italic">Busque por música...</span>
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-medium">
                  <Mic className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            {/* Folders list refined */}
            <div className="px-6 py-5 max-h-[380px] overflow-hidden relative">
              <p className="text-[10px] font-black text-muted-foreground/60 font-heading uppercase tracking-[0.3em] mb-4">
                Bibliotecas ({folders.length})
              </p>
              <div className="space-y-3">
                {folders.slice(0, 8).map((folder, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3.5 glass-card rounded-2xl border-white/5 shadow-soft hover:bg-white/10 hover:border-white/10 transition-elite group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-elite">
                      <Folder className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black font-body block truncate tracking-tight">{folder.name}</span>
                      <span className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">{folder.count}+ arquivos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 opacity-40 group-hover:translate-x-1 transition-elite" />
                  </div>
                ))}
              </div>

              {/* Fade overlay refined */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
            </div>

            {/* Sample files preview refined */}
            <div className="px-6 py-5 border-t border-white/5 bg-white/5">
              <p className="text-[10px] font-black text-muted-foreground/60 font-heading uppercase tracking-[0.2em] mb-4">
                Conteúdo da Pasta
              </p>
              <div className="space-y-3">
                {sampleFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 py-1 group cursor-default">
                    <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                      {file.type === "pdf" ? (
                        <FileText className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <Headphones className="w-4 h-4 text-blue-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors tracking-tight">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini player bar refined */}
            <div className="bg-background/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 flex items-center gap-4 shadow-elite">
              <div className="w-12 h-12 rounded-[14px] bg-primary flex items-center justify-center shrink-0 shadow-gold group cursor-pointer hover:scale-110 active:scale-95 transition-elite">
                <Play className="w-5 h-5 text-white ml-1 shadow-sm" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black font-heading block truncate tracking-tight mb-2 uppercase">Careless Whisper</span>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[35%] bg-primary rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black text-muted-foreground tabular-nums opacity-60">01:24</span>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground font-medium text-lg mb-10 leading-relaxed">
            Tenha a biblioteca completa de um saxofonista profissional no seu bolso. Acesse de qualquer lugar, a qualquer hora.
          </p>
          <button
            onClick={scrollToOffers}
            className="gradient-cta text-white font-black uppercase tracking-widest py-5 px-10 md:px-14 rounded-2xl text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.03] active:scale-[0.97] transition-elite inline-flex items-center gap-3 animate-cta-pulse"
          >
            QUERO MEU ACESSO AGORA
            <ArrowRight className="w-6 h-6 animate-arrow-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AppSimulation;
