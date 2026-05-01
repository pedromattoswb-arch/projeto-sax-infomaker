import { CheckCircle2, ArrowRight, Smartphone, Music, Mail, Crown, Star } from "lucide-react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";

const scrollToAccess = () => {
  document.getElementById("acesso")?.scrollIntoView({ behavior: "smooth" });
};

const ThankYouCompleto = () => {
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
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 md:w-12 md:h-12 text-gold" />
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-3 leading-tight">
            Parabéns! Você Desbloqueou o{" "}
            <span className="text-gold">Acesso Completo</span>! 🎷🔥
          </h1>

          <p className="text-foreground font-body text-[15px] md:text-lg mb-4 leading-relaxed max-w-xl mx-auto">
            Você agora tem acesso a <strong>+10.000 partituras e playbacks profissionais para Sax Alto e Sax Tenor</strong>, busca por voz, vídeos tutoriais e todos os bônus exclusivos.
          </p>

          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold font-heading text-gold">Plano Completo Ativado</span>
          </div>

          <div className="block">
            <button
              onClick={scrollToAccess}
              className="gradient-cta text-white font-bold font-heading py-4 px-8 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
            >
              VER COMO ACESSAR
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* INSTRUÇÕES DE ACESSO */}
      <section className="py-12 md:py-16 px-4 md:px-8 section-alt" id="acesso">
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
                description: "Clique no botão abaixo para entrar na plataforma Clube do Sax. Funciona em celular, tablet ou computador — como um app, sem instalar nada.",
              },
              {
                step: "3",
                icon: Music,
                title: "Explore tudo!",
                description: "Navegue pelas categorias, use a busca por voz, ouça os playbacks profissionais, acesse os bônus e toque com partituras para Sax Alto e Sax Tenor.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-extrabold font-heading text-gold">{item.step}</span>
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
              href="/plano-premium-completo"
              className="gradient-cta text-white font-bold font-heading py-4 px-8 md:px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2"
            >
              ACESSAR MINHA PLATAFORMA COMPLETA
              <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
            </a>
            <p className="text-xs text-muted-foreground mt-3 font-body">
              Plano Completo • +10.000 partituras e playbacks para Sax Alto e Sax Tenor
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

export default ThankYouCompleto;
