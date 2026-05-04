import { CheckCircle2, ArrowRight, Smartphone, Music, Mail, Zap, Gauge, Timer, Check, Star, Sparkles } from "lucide-react";
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

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 inline-block">
            <p className="text-primary font-bold text-sm md:text-base flex items-center gap-2 justify-center">
              <Mail className="w-4 h-4" />
              O acesso acabou de ser enviado para o e-mail cadastrado via plataforma Cakto
            </p>
          </div>

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

      {/* UPSELL SECTION — Direct checkout */}
      <section className="py-12 px-4 md:px-8 section-alt">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-4">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="text-xs font-bold font-heading text-primary uppercase tracking-wider">Oferta Exclusiva — Só Aparece Uma Vez</span>
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold font-heading mb-3">
              Você tem as partituras. Agora precisa das{" "}
              <span className="text-primary">ferramentas certas</span> para estudar de verdade.
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-lg mx-auto">
              Afinador cromático, metrônomo profissional e gerador de escalas — com transposição automática para sax. Tudo online, sem instalar nada.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Gauge, title: "Afinador", desc: "Detecta nota em tempo real + Hz + transposição", color: "text-primary", bg: "bg-primary/15" },
              { icon: Timer, title: "Metrônomo", desc: "Tap tempo + modo progressivo + precisão de áudio", color: "text-[hsl(142,70%,45%)]", bg: "bg-[hsl(142,70%,45%)]/15" },
              { icon: Music, title: "Escalas", desc: "10 escalas + 5 arpejos + tocar cada nota", color: "text-primary", bg: "bg-primary/15" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-5 text-center border border-border hover:border-primary/30 transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-bold font-heading text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Direct CTA — no intermediary page */}
          <div className="glass-card rounded-2xl p-8 border-2 border-primary/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[hsl(142,70%,45%)] to-primary" />
            <p className="text-xs text-muted-foreground font-heading uppercase tracking-widest mb-1">Kit Ferramentas do Saxofonista</p>
            <div className="text-4xl md:text-5xl font-extrabold font-heading text-primary mb-1">R$ 27,90</div>
            <p className="text-xs text-muted-foreground font-body mb-5">Pagamento único · Acesso vitalício · 3 ferramentas</p>
            
            <a
              href="#"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-base md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 w-full justify-center"
            >
              QUERO O KIT COMPLETO — R$ 27,90
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>

            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              {["Afinador", "Metrônomo", "Escalas", "Acesso Vitalício"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-[hsl(142,70%,45%)]" /> {t}
                </span>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-3 font-body">
            Não quer agora? Sem problema — continue abaixo para acessar sua plataforma.
          </p>
        </div>
      </section>

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
        <img src={logoClubeSax} alt="Clube do Sax" className="h-8 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ThankYouBasico;
