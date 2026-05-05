import { CheckCircle2, ArrowRight, Smartphone, Music, Mail, Zap, Gauge, Timer, Check, Star, Sparkles, Lock, Gift, ChevronDown, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import kitBanner from "@/assets/kit-ferramentas-banner.png";
import UpsellSection from "@/components/UpsellSection";

const ThankYouBasico = () => {
  useNoIndex();
  const [showUpsell, setShowUpsell] = useState(false);
  
  const handleToggleUpsell = () => {
    setShowUpsell(true);
    setTimeout(() => {
      document.getElementById('upsell-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-10 md:h-12 w-auto" />
        </div>
      </header>

      {/* HERO — Confirmação */}
      <section className="py-14 md:py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(142,70%,45%)]/5 via-transparent to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[hsl(142,70%,45%)]/15 flex items-center justify-center mx-auto mb-6 relative">
            <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-[hsl(142,70%,45%)]" />
            <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3 leading-tight">
            Parabéns! Seu Acesso ao{" "}
            <span className="text-primary">Plano Básico</span>{" "}
            Foi Confirmado! 🎷
          </h1>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 inline-block max-w-lg">
            <p className="text-primary font-bold text-sm md:text-base flex items-start gap-3 text-left">
              <Mail className="w-5 h-5 mt-0.5 shrink-0" />
              <span>
                O acesso foi enviado agora para seu <strong>E-mail e WhatsApp</strong> cadastrados na Cakto. Verifique sua caixa de entrada e spam.
              </span>
            </p>
          </div>

          <p className="text-foreground font-body text-[15px] md:text-lg mb-6 leading-relaxed max-w-xl mx-auto">
            Você agora tem acesso a <strong>+5.000 partituras para Sax Alto e Sax Tenor</strong> na plataforma Clube do Sax. Siga as instruções abaixo para começar a tocar.
          </p>

          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={handleToggleUpsell}
              className="gradient-cta text-white font-bold font-heading py-4 px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 group"
            >
              VEJA O QUE VOCÊ ACABOU DE DESBLOQUEAR
              <Gift className="w-5 h-5 animate-bounce" />
            </button>
            <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-1">
              <ChevronDown className="w-3 h-3" /> Clique acima para desbloquear seu kit de ferramentas
            </p>
          </div>
        </div>
      </section>

      {showUpsell && (
        <UpsellSection onNoThanks={() => window.location.href = "/cx/d5w2n8?plan=basico"} />
      )}

      {/* INSTRUÇÕES DE ACESSO */}
      <section className="py-12 md:py-16 px-4 md:px-8" id="acesso">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-3xl font-extrabold font-heading text-center mb-3">
            Como Acessar Sua Plataforma
          </h2>
          <p className="text-center text-muted-foreground font-body text-[15px] md:text-lg mb-8">
            Siga estes 3 passos simples para começar a tocar
          </p>

          <div className="space-y-4">
            {[
              {
                step: "1",
                icon: Mail,
                title: "Verifique seu e-mail",
                description: "A Cakto enviou automaticamente um e-mail com seu login e senha de acesso. Confira a caixa de entrada, a aba \"Promoções\" e a pasta de spam.",
              },
              {
                step: "2",
                icon: Smartphone,
                title: "Acesse a plataforma",
                description: "Clique no botão abaixo para entrar na plataforma Clube do Sax. Funciona em celular, tablet ou computador — como um app.",
              },
              {
                step: "3",
                icon: Music,
                title: "Comece a tocar!",
                description: "Navegue pelas categorias, busque suas músicas favoritas e toque com partituras profissionais para Sax Alto e Sax Tenor.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 glass-card rounded-xl border border-border p-5">
                <div className="w-11 h-11 rounded-full bg-[hsl(142,70%,45%)]/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-extrabold font-heading text-[hsl(142,70%,45%)]">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold font-heading text-base mb-1">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-[15px] md:text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/acervo-basico"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
            >
              ACESSAR MINHA PLATAFORMA
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Plano Básico • +5.000 partituras para Sax Alto e Sax Tenor
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-4 border-t border-border text-center">
        <img src={logoClubeSax} alt="Clube do Sax" className="h-8 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ThankYouBasico;
