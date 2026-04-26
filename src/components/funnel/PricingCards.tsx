import { Check, X, Star, ArrowRight, Sparkles, Crown, Zap, ShieldCheck, Lock, BadgeCheck } from "lucide-react";

const ESSENTIAL_LINK = "https://pay.cakto.com.br/qqpusnn_804258";
const PREMIUM_LINK = "https://pay.cakto.com.br/39hving";

const essentialHas = [
  "+5.000 partituras em PDF",
  "Sax Alto e Tenor inclusos",
  "16 categorias musicais",
  "Busca por texto na plataforma",
  "Acesso vitalício",
  "Suporte por e-mail e WhatsApp",
];

const essentialMissing = [
  "Sem playbacks profissionais",
  "Sem busca por voz",
  "Sem vídeos tutoriais",
  "Sem atualizações mensais",
  "Sem Harpa Cristã completa",
  "Sem os 3 bônus exclusivos",
];

const premiumFeatures = [
  { text: "Tudo do plano Básico incluído", highlight: true },
  { text: "+10.000 partituras com playback profissional" },
  { text: "Plataforma exclusiva estilo app" },
  { text: "Busca inteligente por voz" },
  { text: "Vídeos tutoriais integrados" },
  { text: "Músicas novas todo mês" },
  { text: "Harpa Cristã COMPLETA" },
  { text: "BÔNUS: Guia Rotina de Estudo", bonus: true },
  { text: "BÔNUS: Mapa de Tonalidades", bonus: true },
  { text: "BÔNUS: 100 Músicas Essenciais", bonus: true },
];

const PricingCards = () => {


  const handleCheckout = (plan: "essential" | "premium") => {
    const link = plan === "essential" ? ESSENTIAL_LINK : PREMIUM_LINK;
    const params = window.location.search;
    const separator = link.includes("?") ? "&" : "?";
    const finalUrl = params ? `${link}${separator}${params.substring(1)}` : link;
    window.location.href = finalUrl;
  };

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 relative overflow-hidden" id="ofertas">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
            Investimento
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight">
            Escolha o plano ideal para <br className="hidden md:block" />
            <span className="text-primary italic">sua evolução</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto">
            Pagamento único, acesso vitalício e garantia total de 7 dias. Comece a tocar agora mesmo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-5xl mx-auto">
          {/* BASIC CARD */}
          <div className="glass-card rounded-[32px] p-8 md:p-12 relative border-white/5 hover:border-white/10 flex flex-col h-full bg-white/[0.02] backdrop-blur-md">
            <div className="mb-10">
              <span className="inline-block bg-white/5 text-muted-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/10">
                Essencial
              </span>
              <h3 className="text-2xl font-black font-heading mb-2 tracking-tight text-white/90">Plano Básico</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Ideal para quem busca apenas o repertório em PDF, sem playbacks.
              </p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-5xl font-black font-heading tracking-tighter text-white">R$ 9,90</span>
              </div>
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Pagamento Único • Vitalício</span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-3 mb-10 border border-white/5">
              <Zap className="w-5 h-5 text-muted-foreground/60 shrink-0" />
              <span className="text-[13px] font-bold text-muted-foreground/80">Acesso imediato liberado</span>
            </div>

            <div className="flex-grow">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">O que está incluso</p>
              <ul className="space-y-4 mb-10">
                {essentialHas.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 text-base font-semibold text-foreground/80 group">
                    <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors mt-0.5">
                      <Check className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/5 pt-8 mb-10">
                <p className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-6 font-heading">Não incluso</p>
                <ul className="space-y-4">
                  {essentialMissing.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm font-medium text-muted-foreground/30">
                      <X className="w-4 h-4 text-destructive/30 mt-0.5 shrink-0" />
                      <span className="line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleCheckout("essential")}
              className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
            >
              GARANTIR ACESSO BÁSICO
            </button>
          </div>

          {/* PREMIUM CARD */}
          <div className="relative md:scale-[1.05] origin-top">
            {/* Elite Glow Effect */}
            <div className="absolute -inset-[2px] rounded-[34px] bg-gradient-to-br from-primary via-gold to-primary opacity-40 blur-md animate-glow-pulse" />
            
            <div className="glass-card rounded-[32px] border-primary/30 shadow-elite p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                <span className="gradient-gold text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-gold whitespace-nowrap animate-glow-pulse border border-white/20">
                  <Crown className="w-4 h-4" />
                  Mais Completo
                </span>
              </div>

              <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 animate-shimmer rounded-[32px]" />
              </div>

              <div className="mb-10 relative pt-12">
                <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/30">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                  Premium Experience
                </span>
                <h3 className="text-2xl md:text-3xl font-black font-heading mb-2 tracking-tight">Plano Completo</h3>
                <p className="text-muted-foreground text-base font-medium">
                  A experiência definitiva para saxofonistas.
                </p>
              </div>

              <div className="mb-10 relative">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-5xl md:text-6xl font-black font-heading text-gold tracking-tighter">R$ 19,90</span>
                </div>
                <span className="text-xs text-gold font-bold uppercase tracking-widest">Pagamento Único • Vitalício</span>
              </div>

              <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-4 mb-10 shadow-soft">
                <Zap className="w-5 h-5 text-gold shrink-0 animate-pulse" />
                <span className="text-[13px] font-bold text-gold">Acesso imediato + Todos os bônus</span>
              </div>

              <p className="text-[11px] font-black text-gold/60 uppercase tracking-[0.2em] mb-6">Incluso no Premium</p>
              <ul className="space-y-4 mb-10">
                {premiumFeatures.map((feature, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-4 text-base font-bold transition-elite group ${
                      feature.highlight ? "text-primary scale-[1.02]" : 
                      feature.bonus ? "text-gold" : 
                      "text-foreground/90"
                    }`}
                  >
                    <div className={`p-1 rounded-full ${feature.highlight || feature.bonus ? "bg-primary/20" : "bg-white/5"} group-hover:bg-primary/30 transition-colors`}>
                      {feature.bonus ? (
                        <Star className="w-4 h-4 text-gold fill-gold" />
                      ) : (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-gold/5 border border-gold/10 rounded-2xl p-5 mb-10 backdrop-blur-sm">
                <p className="text-sm font-bold leading-relaxed text-center text-foreground/80">
                  💡 Por apenas R$ 10 a mais você desbloqueia <strong className="text-gold">tudo</strong>: playbacks profissionais, busca por voz e bônus.
                </p>
              </div>

              <button
                onClick={() => handleCheckout("premium")}
                className="w-full py-5 rounded-2xl gradient-cta text-white font-black uppercase tracking-widest text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.03] active:scale-[0.97] transition-elite animate-cta-pulse flex items-center justify-center gap-3"
              >
                QUERO O PLANO COMPLETO
                <ArrowRight className="w-6 h-6 animate-arrow-bounce" />
              </button>

              <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-6 opacity-60">
                🔒 Checkout 100% Criptografado
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-body">
          +847 saxofonistas já compraram • Pagamento seguro • Garantia de 7 dias
        </p>

        {/* Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-body">Site Seguro</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-xs font-body">Dados Protegidos</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-body">Pagamento via Cakto</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-body">Acesso Imediato</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
