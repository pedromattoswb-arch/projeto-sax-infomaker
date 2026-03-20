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
    <section className="py-16 px-4 md:px-8" id="ofertas">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">
            Escolha Seu Plano e Comece a Tocar Agora
          </h2>
          <p className="text-foreground font-body text-base md:text-lg">
            Pagamento único. Acesso vitalício. Garantia de 7 dias.
          </p>
        </div>


        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start max-w-4xl mx-auto">
          {/* BASIC CARD */}
          <div className="glass-card rounded-2xl shadow-lg p-6 md:p-8 relative">
            <div className="mb-6">
              <span className="inline-block bg-foreground/5 text-muted-foreground px-3 py-1 rounded-full text-xs font-bold font-heading mb-3 border border-border">
                Para começar
              </span>
              <h3 className="text-xl font-bold font-heading mb-1">Básico</h3>
              <p className="text-muted-foreground text-sm md:text-base font-body">
                Partituras em PDF — sem playback
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-heading">R$ 9</span>
                <span className="text-xl font-bold font-heading">,90</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold font-body">Pagamento único • Acesso vitalício</span>
            </div>

            <div className="flex items-center gap-2 glass-card rounded-lg px-3 py-2 mb-6">
              <Zap className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-semibold font-body text-muted-foreground">Acesso imediato após o pagamento</span>
            </div>

            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 font-heading">Incluso</p>
            <ul className="space-y-2.5 mb-6">
              {essentialHas.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm md:text-base font-body text-foreground">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-4 mb-8">
              <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider mb-3 font-heading">Não incluso neste plano</p>
              <ul className="space-y-2.5">
                {essentialMissing.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-body text-muted-foreground/60">
                    <X className="w-4 h-4 text-destructive/60 mt-0.5 shrink-0" />
                    <span className="line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("essential")}
              className="w-full py-3.5 rounded-xl bg-[hsl(142,55%,38%)] border border-[hsl(142,50%,45%)]/30 text-white font-bold font-heading text-sm hover:bg-[hsl(142,55%,42%)] transition-all duration-300"
            >
              GARANTIR ACESSO BÁSICO
            </button>
          </div>

          {/* PREMIUM CARD */}
          <div className="relative md:scale-[1.05] origin-top">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary via-accent to-gold opacity-30 blur-sm" />
            <div className="glass-card rounded-2xl border border-primary/30 shadow-gold-lg p-6 md:p-8 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span className="gradient-gold text-accent-foreground px-5 py-1.5 rounded-full text-xs font-bold font-heading flex items-center gap-1.5 shadow-gold whitespace-nowrap animate-glow-pulse">
                  <Crown className="w-3.5 h-3.5" />
                  MAIS ESCOLHIDO
                </span>
              </div>

              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 animate-shimmer rounded-2xl" />
              </div>

              <div className="mb-6 relative pt-2">
                <span className="inline-block bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-bold font-heading mb-3 border border-primary/30">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Melhor custo-benefício
                </span>
                <h3 className="text-xl font-bold font-heading mb-1">Completo</h3>
                <p className="text-muted-foreground text-sm font-body">
                  Partituras + Playbacks + Tudo Incluso
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-heading text-gold">R$ 39</span>
                  <span className="text-xl font-bold font-heading text-gold">,90</span>
                </div>
                <span className="text-xs text-gold font-semibold font-body">Pagamento único • Acesso vitalício</span>
              </div>

              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 mb-6">
                <Zap className="w-4 h-4 text-gold shrink-0" />
                <span className="text-xs font-semibold font-body text-gold">Acesso imediato + bônus liberados na hora</span>
              </div>

              {/* Micro testimonial */}
              <div className="glass-card rounded-lg px-3 py-2 mb-5 flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-[11px] text-foreground font-body italic">
                  "Melhor investimento que fiz pro meu sax" — Júlio S., SP
                </span>
              </div>

              <p className="text-xs font-bold text-gold/60 uppercase tracking-wider mb-3 font-heading">Tudo incluído</p>
              <ul className="space-y-2.5 mb-6">
                {premiumFeatures.map((feature, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2.5 text-sm md:text-base font-body ${
                      feature.highlight ? "font-bold text-primary" : 
                      feature.bonus ? "text-gold font-semibold" : 
                      "text-foreground"
                    }`}
                  >
                    {feature.bonus ? (
                      <Star className="w-4 h-4 text-gold mt-0.5 shrink-0 fill-gold" />
                    ) : (
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    )}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-gold/10 border border-gold/20 rounded-xl p-3 mb-6">
                <p className="text-sm font-semibold font-body text-center text-foreground">
                  💡 Por apenas R$ 20 a mais você recebe os <strong className="text-gold">playbacks profissionais</strong>, busca por voz, tutoriais e 3 bônus exclusivos.
                </p>
              </div>

              <p className="text-center text-xs text-muted-foreground mb-4 font-body">
                Menos que o preço de uma palheta — e você leva <strong className="text-foreground">+10.000 partituras com playback</strong> pra vida toda
              </p>

              <button
                onClick={() => handleCheckout("premium")}
                className="w-full py-4 rounded-xl gradient-cta text-white font-bold font-heading text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.02] transition-all duration-300 animate-cta-pulse flex items-center justify-center gap-2"
              >
                SIM! QUERO MEU ACESSO AGORA
                <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
              </button>

              <p className="text-center text-xs text-muted-foreground mt-3 font-body">
                🔒 Pagamento seguro • Acesso imediato
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
