import { useState, useEffect } from "react";
import { Check, X, Star, ArrowRight, Sparkles, Crown, Zap, ShieldCheck, Lock, BadgeCheck, Clock } from "lucide-react";

const ESSENTIAL_LINK = "https://pay.cakto.com.br/tdt6ypb_738069";
const PREMIUM_LINK = "https://pay.cakto.com.br/3djucaz";

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
  { text: "+10.000 partituras e playbacks profissionais" },
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
          <p className="text-foreground font-body text-base">
            Pagamento único. Acesso vitalício. Garantia de 7 dias.
          </p>
        </div>

        <p className="text-center text-sm text-primary font-semibold font-body mb-10">
          ⚠️ Preço promocional por tempo limitado
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start max-w-4xl mx-auto">
          {/* BASIC CARD */}
          <div className="bg-[hsl(215,15%,22%)] rounded-2xl border border-[hsl(215,10%,30%)] shadow-lg p-6 md:p-8 relative">
            <div className="mb-6">
              <span className="inline-block bg-white/8 text-white/60 px-3 py-1 rounded-full text-xs font-bold font-heading mb-3 border border-white/10">
                Para começar
              </span>
              <h3 className="text-xl font-bold font-heading mb-1 text-white/90">Básico</h3>
              <p className="text-white/40 text-sm font-body">
                +5.000 partituras na plataforma
              </p>
            </div>

            <div className="mb-6">
              <span className="text-white/30 text-sm line-through font-body">De R$ 197,00</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold font-heading text-white/90">R$ 19</span>
                <span className="text-xl font-bold font-heading text-white/90">,90</span>
              </div>
              <span className="text-xs text-white/50 font-semibold font-body">Pagamento único</span>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2 mb-6">
              <Zap className="w-4 h-4 text-white/50 shrink-0" />
              <span className="text-xs font-semibold font-body text-white/50">Acesso imediato após o pagamento</span>
            </div>

            {/* What's included */}
            <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 font-heading">Incluso</p>
            <ul className="space-y-2.5 mb-6">
              {essentialHas.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-body text-white/60">
                  <Check className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* What's NOT included */}
            <div className="border-t border-white/8 pt-4 mb-8">
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3 font-heading">Não incluso neste plano</p>
              <ul className="space-y-2.5">
                {essentialMissing.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-body text-white/30">
                    <X className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                    <span className="line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("essential")}
              className="w-full py-3.5 rounded-xl bg-white/8 border border-white/15 text-white/70 font-bold font-heading text-sm hover:bg-white/15 transition-all duration-300"
            >
              GARANTIR ACESSO BÁSICO
            </button>
          </div>

          {/* PREMIUM CARD */}
          <div className="bg-[hsl(225,30%,12%)] rounded-2xl border-2 border-accent shadow-gold-lg p-6 md:p-8 relative md:scale-[1.05] origin-top">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <span className="gradient-gold text-accent-foreground px-5 py-1.5 rounded-full text-xs font-bold font-heading flex items-center gap-1.5 shadow-gold whitespace-nowrap">
                <Crown className="w-3.5 h-3.5" />
                MAIS ESCOLHIDO
              </span>
            </div>

            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 animate-shimmer rounded-2xl" />
            </div>

            <div className="mb-6 relative pt-2">
              <span className="inline-block bg-accent/15 text-accent-foreground px-3 py-1 rounded-full text-xs font-bold font-heading mb-3 border border-accent/30">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Melhor custo-benefício
              </span>
              <h3 className="text-xl font-bold font-heading mb-1 text-white">Completo</h3>
              <p className="text-white/50 text-sm font-body">
                Acervo completo + playbacks + tutoriais + bônus
              </p>
            </div>

            <div className="mb-6">
              <span className="text-white/40 text-sm line-through font-body">De R$ 497,00</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold font-heading text-gold">R$ 39</span>
                <span className="text-xl font-bold font-heading text-gold">,90</span>
              </div>
              <span className="text-xs text-gold font-semibold font-body">Economia de 92% • Pagamento único</span>
            </div>

            <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 mb-6">
              <Zap className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs font-semibold font-body text-gold">Acesso imediato + bônus liberados na hora</span>
            </div>

            <p className="text-xs font-bold text-gold/60 uppercase tracking-wider mb-3 font-heading">Tudo incluído</p>
            <ul className="space-y-2.5 mb-6">
              {premiumFeatures.map((feature, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2.5 text-sm font-body ${
                    feature.highlight ? "font-bold text-primary" : 
                    feature.bonus ? "text-gold font-semibold" : 
                    "text-white/90"
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
              <p className="text-xs font-semibold font-body text-center text-white/90">
                💡 Por apenas <strong className="text-gold">R$ 20 a mais</strong>, você desbloqueia
                playbacks, busca por voz, tutoriais e 3 bônus exclusivos.
              </p>
            </div>

            <button
              onClick={() => handleCheckout("premium")}
              className="w-full py-4 rounded-xl gradient-cta text-white font-bold font-heading text-base shadow-cta hover:shadow-cta-lg hover:scale-[1.02] transition-all duration-300 animate-cta-pulse flex items-center justify-center gap-2"
            >
              GARANTIR ACESSO COMPLETO
              <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
            </button>

            <p className="text-center text-xs text-white/40 mt-3 font-body">
              🔒 Pagamento seguro • Acesso imediato
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-body">
          ⭐ Mais de <strong>847 saxofonistas</strong> já garantiram seu acesso • Recomendado por escolas de sax
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
