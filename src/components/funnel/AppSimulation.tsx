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
    <section className="py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-3 border border-primary/20">
            👀 VEJA POR DENTRO — ACERVO REAL
          </span>
          <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2">
            Veja Como Funciona Por Dentro — É Simples Assim
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base">
            Você abre a pasta, escolhe a música, abre a partitura e dá play no playback. <strong className="text-foreground">Tudo na mesma tela, sem sair do app.</strong>
          </p>
        </div>

        {/* Phone/Tablet mockup */}
        <div className="max-w-md mx-auto">
          <div className="rounded-[2rem] border-[3px] border-border glass-card shadow-2xl overflow-hidden relative">
            {/* Simulation banner */}
            <div className="bg-primary/90 text-primary-foreground text-center py-2 px-3 text-[11px] font-bold font-heading tracking-wide flex items-center justify-center gap-1.5">
              🔒 SIMULAÇÃO DO ACERVO REAL — APENAS DEMONSTRAÇÃO
            </div>

            {/* App header */}
            <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                <span className="font-heading font-bold text-sm">SaxPlay</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-body">+1.000 partituras com playback</span>
            </div>

            {/* Search bar mock */}
            <div className="px-4 py-3 border-b border-border bg-surface/50">
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 border border-border">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-body flex-1">Buscar partituras, playbacks...</span>
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Mic className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
            </div>

            {/* Folders list */}
            <div className="px-4 py-3 max-h-[360px] overflow-hidden relative bg-background/50">
              <p className="text-[11px] font-bold text-muted-foreground font-heading uppercase tracking-wider mb-2">
                Gêneros Musicais ({folders.length} pastas)
              </p>
              <div className="space-y-2">
                {folders.slice(0, 8).map((folder, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 glass-card rounded-xl"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Folder className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold font-body block truncate">{folder.name}</span>
                      <span className="text-[10px] text-primary font-semibold">{folder.count}+ arquivos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>

              {/* Fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* Sample files preview */}
            <div className="px-4 py-3 border-t border-border bg-surface/50">
              <p className="text-[10px] font-bold text-muted-foreground font-heading uppercase tracking-wider mb-2">
                Dentro de cada pasta: partitura + playback juntos
              </p>
              <div className="space-y-1.5">
                {sampleFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    {file.type === "pdf" ? (
                      <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : (
                      <Headphones className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                    <span className="text-[11px] font-body text-foreground">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini player bar */}
            <div className="bg-surface border-t border-border px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold font-body block truncate">Careless Whisper - Playback</span>
                <div className="w-full h-1 bg-muted rounded-full mt-1">
                  <div className="h-full w-[35%] bg-primary rounded-full" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">1:24</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 font-body max-w-md mx-auto">
          Essa é uma <strong className="text-foreground">simulação visual</strong> da plataforma real. Ao garantir seu acesso, você navega livremente por todas as pastas, partituras e playbacks.
        </p>

        <div className="text-center mt-5">
          <button
            onClick={scrollToOffers}
            className="gradient-cta text-white font-bold font-heading py-3.5 px-8 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2"
          >
            QUERO ACESSAR A PLATAFORMA — ESCOLHER MEU PLANO
            <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AppSimulation;
