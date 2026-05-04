import { CheckCircle2, ArrowRight, Smartphone, Music, Mail, Zap, Gauge, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";

const scrollToAccess = () => {
  document.getElementById("acesso")?.scrollIntoView({ behavior: "smooth" });
};

const ThankYouBasico = () => {
  useNoIndex();
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-8 md:h-10 w-auto" />
        </div>
      </header>

      {/* HERO — Confirmação */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[hsl(142,70%,45%)]/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-[hsl(142,70%,45%)]" />
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3 leading-tight">
            Parabéns! Seu Acesso ao{" "}
            <span className="text-primary">Plano Básico</span>{" "}
            Foi Confirmado! 🎷
          </h1>

          <p className="text-foreground font-body text-[15px] md:text-lg mb-6 leading-relaxed max-w-xl mx-auto">
            Você agora tem acesso a <strong>+5.000 partituras para Sax Alto e Sax Tenor</strong> na plataforma Clube do Sax. Siga as instruções abaixo para começar a tocar.
          </p>

          <button
            onClick={scrollToAccess}
            className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
          >
            VER COMO ACESSAR
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </button>
        </div>
      </section>

      {/* UPSELL SECTION */}
      <section className="py-10 px-4 md:px-8 section-alt">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="text-xs font-bold font-heading text-primary">OFERTA EXCLUSIVA</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold font-heading mb-2">
              Complete seu estudo com as <span className="text-primary">ferramentas certas</span>
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
              Afinador, metrônomo e gerador de escalas — com transposição automática para sax.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon: Gauge, title: "Afinador", desc: "Detecta notas em tempo real" },
              { icon: Timer, title: "Metrônomo", desc: "Modo progressivo inteligente" },
              { icon: Music, title: "Escalas", desc: "10 escalas + arpejos transpostos" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="glass-card rounded-xl p-4 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold font-heading text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/cx/v3j8q2"
              className="gradient-cta text-white font-bold font-heading py-3.5 px-8 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2"
            >
              VER OFERTA — R$ 27,90
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-muted-foreground mt-2">Pagamento único · Acesso vitalício</p>
          </div>
        </div>
      </section>

      {/* INSTRUÇÕES DE ACESSO */}
      <section className="py-12 md:py-16 px-4 md:px-8" id="acesso">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold font-heading text-center mb-2">
            Como Acessar Sua Plataforma
          </h2>
          <p className="text-center text-muted-foreground font-body text-sm mb-8">
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
              <div key={item.step} className="flex gap-4 bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[hsl(142,70%,45%)]/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-extrabold font-heading text-[hsl(142,70%,45%)]">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold font-heading text-base mb-1">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.description}</p>
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
        <img src={logoClubeSax} alt="Clube do Sax" className="h-7 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ThankYouBasico;
