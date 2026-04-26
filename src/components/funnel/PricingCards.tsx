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
          <div className="relative md:scale-[1.05] origin-top premium-card-3d h-full">
            <div className="premium-card-3d-inner h-full">
              {/* Premium Glow Aura */}
              <div className="absolute -inset-[2px] rounded-[34px] bg-gradient-to-br from-primary via-gold to-primary opacity-50 blur-xl animate-glow-pulse" />
              
              <div className="glass-card rounded-[32px] border-primary/40 shadow-3d-premium p-8 md:p-12 relative overflow-hidden h-full flex flex-col bg-gradient-to-br from-white/[0.08] to-white/[0.01] backdrop-blur-2xl">
                {/* Floating Elements for 3D depth */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                  <div className="bg-primary/20 border border-primary/30 backdrop-blur-md text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                    Economize 50%
                  </div>
                </div>

                <div className="mb-10 relative pt-4">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/20 to-primary/20 text-gold px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-gold/30 shadow-gold/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Premium Experience
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black font-heading mb-2 tracking-tight text-white flex items-center gap-3">
                    Plano Completo
                    <Crown className="w-6 h-6 text-gold fill-gold/20 animate-bounce" />
                  </h3>
                  <p className="text-muted-foreground text-base font-medium leading-relaxed">
                    A experiência definitiva para saxofonistas profissionais e amadores.
                  </p>
                </div>

                <div className="mb-10 relative">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through opacity-50 font-bold">R$ 39,90</span>
                    <span className="text-6xl md:text-7xl font-black font-heading text-gold tracking-tighter drop-shadow-2xl">R$ 19,90</span>
                  </div>
                  <span className="text-xs text-gold font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-live-dot" />
                    Pagamento Único • Acesso Vitalício
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4 mb-10 shadow-inner group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Zap className="w-6 h-6 text-gold shrink-0 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-white">Liberação Imediata</span>
                    <span className="text-[11px] text-gold/80 font-bold uppercase tracking-widest">Incluindo todos os bônus</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="text-[11px] font-black text-gold/60 uppercase tracking-[0.2em] mb-6">O que você desbloqueia agora</p>
                  <ul className="space-y-4 mb-12">
                    {premiumFeatures.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-4 text-[15px] font-bold transition-all duration-300 group ${
                          feature.highlight ? "text-primary" : 
                          feature.bonus ? "text-gold" : 
                          "text-white/90"
                        }`}
                      >
                        <div className={`p-1.5 rounded-full ${feature.highlight || feature.bonus ? "bg-primary/20 border border-primary/20 shadow-glow" : "bg-white/5"} group-hover:scale-110 transition-transform mt-0.5`}>
                          {feature.bonus ? (
                            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-6 mb-10 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                    <p className="text-sm font-bold leading-relaxed text-foreground/90 relative z-10">
                      💡 Por apenas <strong className="text-gold text-lg">R$ 10</strong> a mais você desbloqueia <strong className="text-gold">TUDO</strong>: playbacks, busca por voz e bônus exclusivos.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCheckout("premium")}
                  className="w-full py-6 rounded-2xl gradient-cta text-white font-black uppercase tracking-widest text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 animate-cta-pulse flex items-center justify-center gap-4 group"
                >
                  QUERO O PLANO COMPLETO
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </button>

                <div className="flex items-center justify-center gap-4 mt-8 opacity-60">
                  <div className="h-[1px] flex-grow bg-white/5" />
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    Checkout 100% Seguro
                  </span>
                  <div className="h-[1px] flex-grow bg-white/5" />
                </div>
              </div>
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
