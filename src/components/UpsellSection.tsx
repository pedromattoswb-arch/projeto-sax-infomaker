import { ArrowRight, Gauge, Timer, Music, Zap, Check, Shield, Star, Lock, Gift, ChevronDown, Smartphone } from "lucide-react";
import kitBanner from "@/assets/kit-ferramentas-banner.png";

const features = [
  {
    icon: Gauge,
    title: "Afinador Cromático para Sax",
    description: "Detecta a nota que você toca em tempo real. Mostra cents, frequência em Hz e a nota transposta automaticamente para Sax Alto (Eb) ou Tenor (Bb).",
    color: "text-primary",
    bgColor: "bg-primary/15",
  },
  {
    icon: Timer,
    title: "Metrônomo Profissional",
    description: "40 a 220 BPM com scheduling de áudio preciso. 4 fórmulas de compasso, tap tempo e modo progressivo.",
    color: "text-[hsl(142,70%,45%)]",
    bgColor: "bg-[hsl(142,70%,45%)]/15",
  },
  {
    icon: Music,
    title: "Gerador de Escalas e Arpejos",
    description: "10 tipos de escala + 5 tipos de arpejo em todas as tonalidades. Tudo já transposto para o seu sax — zero cálculo manual.",
    color: "text-primary",
    bgColor: "bg-primary/15",
  },
];

const comparisons = [
  { without: "Estuda desafinado sem perceber", with: "Sabe exatamente se está no pitch certo" },
  { without: "Não tem noção de tempo real", with: "Pratica com metrônomo preciso" },
  { without: "Perde horas transpondo notas", with: "Vê todas as notas prontas pro seu sax" },
];

interface UpsellSectionProps {
  onNoThanks: () => void;
}

const UpsellSection = ({ onNoThanks }: UpsellSectionProps) => {
  return (
    <div id="upsell-section" className="py-12 md:py-20 px-4 md:px-8 border-y border-border bg-card/30 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-xs font-bold font-heading text-primary uppercase tracking-wider italic">Oferta Exclusiva — Desbloqueada Agora</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-heading mb-4 leading-tight">
            Você tem as partituras. <br/>
            Agora falta o que vai fazer você <span className="text-primary italic">tocar de verdade.</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Afinador, metrônomo e gerador de escalas — as 3 ferramentas indispensáveis integradas à sua plataforma.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-3xl opacity-50" />
            <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
              <img 
                src={kitBanner} 
                alt="Demonstração do Kit" 
                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "Afinador", icon: Gauge },
                { label: "Metrônomo", icon: Timer },
                { label: "Escalas", icon: Music }
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border/50 p-3 rounded-xl text-center shadow-sm">
                  <item.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-[10px] font-black uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black font-heading">
              O que você vai levar no <span className="text-primary italic underline decoration-primary/20">Kit de Elite</span>
            </h3>
            <div className="space-y-4">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl ${feat.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-0.5">{feat.title}</h4>
                      <p className="text-sm text-muted-foreground leading-snug">{feat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="glass-card rounded-2xl overflow-hidden border border-border">
            <div className="grid grid-cols-2 bg-card border-b border-border">
              <div className="px-4 py-3 text-center border-r border-border">
                <span className="text-xs font-bold font-heading text-red-400 uppercase italic">❌ Sem Kit</span>
              </div>
              <div className="px-4 py-3 text-center">
                <span className="text-xs font-bold font-heading text-[hsl(142,70%,45%)] uppercase italic">✅ Com Kit</span>
              </div>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-border last:border-0">
                <div className="px-4 py-3.5 text-xs md:text-sm font-body text-muted-foreground border-r border-border">
                  {c.without}
                </div>
                <div className="px-4 py-3.5 text-xs md:text-sm font-body text-foreground font-medium">
                  {c.with}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <div className="glass-card rounded-2xl p-8 border-2 border-primary/40 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[hsl(142,70%,45%)] to-primary" />
            <p className="text-xs text-muted-foreground font-heading uppercase tracking-widest mb-2 italic font-bold">Acesso Vitalício Liberado</p>
            <div className="text-5xl font-extrabold font-heading text-primary mb-1">
              R$ 27,90
            </div>
            <p className="text-xs text-muted-foreground font-body mb-6 italic">
              Pagamento único · Sem mensalidade<br/>
              Acesso liberado via <strong>E-mail e WhatsApp</strong> imediatamente após a compra.
            </p>

            <a
              href="https://pay.wiapy.com/ymgWWLcrw9"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 w-full justify-center"
            >
              SIM! QUERO O MEU KIT
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>
          </div>

          <button
            onClick={onNoThanks}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body underline underline-offset-4"
          >
            Não, obrigado. Prefiro seguir sem as ferramentas.
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpsellSection;