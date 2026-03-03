import { Check, Star, ArrowRight, Sparkles, Crown } from "lucide-react";
import { trackInitiateCheckout } from "@/hooks/useMetaPixel";

const ESSENTIAL_LINK = "https://pay.cakto.com.br/tdt6ypb_738069";
const PREMIUM_LINK = "https://pay.cakto.com.br/3djucaz";

const essentialFeatures = [
  "1.600 partituras em PDF",
  "Todas as categorias (Pop, MPB, Rock, Gospel, Jazz, Blues, Samba, Flashback)",
  "Sax Alto e Tenor",
  "Acesso vitalício",
  "Suporte por e-mail",
];

const premiumFeatures = [
  "Tudo do Essencial +",
  "+2.000 partituras (400 a mais)",
  "Playbacks profissionais sincronizados",
  "Formato interativo exclusivo",
  "Atualizações mensais com músicas novas",
  "Harpa Cristã COMPLETA",
  "BÔNUS: Guia Rotina de Estudo",
  "BÔNUS: Mapa de Tonalidades",
  "BÔNUS: 100 Músicas Essenciais",
];

const PricingCards = () => {
  const handleCheckout = (plan: "essential" | "premium") => {
    const value = plan === "essential" ? 9.9 : 19.9;
    trackInitiateCheckout({
      content_name: plan === "essential" ? "Essencial" : "Premium",
      value,
      currency: "BRL",
    });
    window.open(plan === "essential" ? ESSENTIAL_LINK : PREMIUM_LINK, "_blank");
  };

  return (
    <section className="py-16 px-4 md:px-8" id="ofertas">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">
            Escolha Seu Plano e Comece Agora
          </h2>
          <p className="text-foreground font-body text-base">
            Acesso vitalício. Pague uma vez, acesse para sempre.
          </p>
        </div>

        <p className="text-center text-sm text-primary font-semibold font-body mb-10">
          ⚠️ Preço promocional por tempo limitado
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start max-w-4xl mx-auto">
          {/* ESSENTIAL CARD */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 relative">
            <div className="mb-6">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-heading mb-3">
                Para começar
              </span>
              <h3 className="text-xl font-bold font-heading mb-1">Essencial</h3>
              <p className="text-muted-foreground text-sm font-body">
                O acervo completo de partituras em PDF
              </p>
            </div>

            <div className="mb-6">
              <span className="text-muted-foreground text-sm line-through font-body">De R$ 197,00</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold font-heading text-primary">R$ 9</span>
                <span className="text-xl font-bold font-heading text-primary">,90</span>
              </div>
              <span className="text-xs text-primary font-semibold font-body">Economia de 95% • Pagamento único</span>
            </div>

            <ul className="space-y-3 mb-8">
              {essentialFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-body">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout("essential")}
              className="w-full py-3.5 rounded-xl border-2 border-primary text-primary font-bold font-heading text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              GARANTIR ACESSO ESSENCIAL
            </button>
          </div>

          {/* PREMIUM CARD */}
          <div className="bg-card rounded-2xl border-2 border-accent shadow-gold-lg p-6 md:p-8 relative md:scale-[1.02] origin-top">
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
              <h3 className="text-xl font-bold font-heading mb-1">Premium</h3>
              <p className="text-muted-foreground text-sm font-body">
                O acervo completo + playbacks + bônus exclusivos
              </p>
            </div>

            <div className="mb-6">
              <span className="text-muted-foreground text-sm line-through font-body">De R$ 497,00</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold font-heading text-gold">R$ 19</span>
                <span className="text-xl font-bold font-heading text-gold">,90</span>
              </div>
              <span className="text-xs text-gold-dark font-semibold font-body">Economia de 96% • Pagamento único</span>
            </div>

            <ul className="space-y-3 mb-6">
              {premiumFeatures.map((feature, i) => {
                const isBonus = feature.startsWith("BÔNUS");
                const isFirst = i === 0;
                return (
                  <li
                    key={i}
                    className={`flex items-start gap-2.5 text-sm font-body ${isFirst ? "font-bold text-primary" : ""} ${isBonus ? "text-gold-dark font-semibold" : ""}`}
                  >
                    {isBonus ? (
                      <Star className="w-4 h-4 text-gold mt-0.5 shrink-0 fill-gold" />
                    ) : (
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    )}
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>

            <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 mb-6">
              <p className="text-xs font-semibold font-body text-center">
                💡 Por apenas <strong className="text-primary">R$ 10 a mais</strong>, você leva
                playbacks, formato interativo e 3 bônus. <br />
                <span className="text-muted-foreground">Não faz sentido levar o Essencial.</span>
              </p>
            </div>

            <button
              onClick={() => handleCheckout("premium")}
              className="w-full py-4 rounded-xl gradient-cta text-primary-foreground font-bold font-heading text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] transition-all duration-300 animate-cta-pulse flex items-center justify-center gap-2"
            >
              GARANTIR ACESSO PREMIUM
              <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
            </button>

            <p className="text-center text-xs text-muted-foreground mt-3 font-body">
              🔒 Pagamento seguro • Acesso imediato
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-body">
          ⭐ Mais de <strong>847 saxofonistas</strong> já garantiram seu acesso
        </p>
      </div>
    </section>
  );
};

export default PricingCards;
