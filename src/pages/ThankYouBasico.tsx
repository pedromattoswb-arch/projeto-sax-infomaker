import { CheckCircle2, ArrowRight, Smartphone, Music, Headphones, BookOpen, Crown, Mail, MessageCircle, Star, ShieldCheck, Zap } from "lucide-react";
import useNoIndex from "@/hooks/useNoIndex";
import logoSaxplay from "@/assets/logo-saxplay.png";

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
          <img src={logoSaxplay} alt="ClubedoSax" className="h-8 md:h-10 w-auto" />
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
            Você agora tem acesso a <strong>+5.000 partituras para Sax Alto e Sax Tenor</strong> na plataforma ClubedoSax. Siga as instruções abaixo para começar a tocar.
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

      {/* UPGRADE BANNER */}
      <section className="py-10 md:py-14 px-4 md:px-8 bg-[hsl(225,30%,12%)]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-gold/15 text-gold px-4 py-1.5 rounded-full text-xs font-bold font-heading mb-4">
            <Crown className="w-3.5 h-3.5" />
            OFERTA EXCLUSIVA — SÓ PARA NOVOS ALUNOS
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mb-3">
            Quer Dobrar Seu Acervo por Apenas <span className="text-gold">R$ 20 a Mais</span>?
          </h2>

          <p className="text-white/70 font-body text-sm md:text-base mb-6 max-w-lg mx-auto leading-relaxed">
            Faça upgrade para o <strong className="text-white">Plano Completo</strong> e desbloqueie{" "}
            <strong className="text-gold">+10.000 partituras e playbacks</strong>, busca por voz, vídeos tutoriais, Harpa Cristã completa e 3 bônus exclusivos.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6 text-left">
            {[
              { icon: Headphones, text: "Playbacks profissionais" },
              { icon: Music, text: "+10.000 arquivos totais" },
              { icon: BookOpen, text: "3 bônus exclusivos" },
              { icon: Star, text: "Atualizações mensais" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                <item.icon className="w-4 h-4 text-gold shrink-0" />
                <span className="text-xs font-body text-white/80">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1 justify-center mt-1">
              <span className="text-3xl md:text-4xl font-extrabold font-heading text-gold">R$ 6</span>
              <span className="text-lg font-bold font-heading text-gold">,90</span>
            </div>
            <span className="text-xs text-gold/80 font-semibold font-body">Pagamento único • Upgrade imediato</span>
          </div>

          <a
            href="https://pay.cakto.com.br/52pq694_804276"
            className="gradient-gold text-white font-bold font-heading py-4 px-8 rounded-xl text-[15px] md:text-lg shadow-gold hover:shadow-gold-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2"
          >
            FAZER UPGRADE AGORA
            <ArrowRight className="w-5 h-5 animate-arrow-bounce" />
          </a>

          <p className="text-center text-xs text-white/30 mt-3 font-body">
            🔒 Pagamento seguro • Garantia de 7 dias • Acesso imediato ao upgrade
          </p>
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
                description: "Clique no botão abaixo para entrar na plataforma ClubedoSax. Funciona em celular, tablet ou computador — como um app.",
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

      {/* SUPORTE */}
      <section className="py-10 md:py-12 px-4 md:px-8">
        <div className="max-w-lg mx-auto text-center">
          <h3 className="font-bold font-heading text-lg mb-2">Precisa de Ajuda?</h3>
          <p className="text-muted-foreground font-body text-sm mb-4">
            Nossa equipe está pronta para ajudar você a começar
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageCircle className="w-4 h-4 text-[hsl(142,70%,45%)]" />
              <span className="text-xs font-body">WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Mail className="w-4 h-4 text-[hsl(142,70%,45%)]" />
              <span className="text-xs font-body">E-mail</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-[hsl(142,70%,45%)]" />
              <span className="text-xs font-body">Garantia 7 dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-4 border-t border-border text-center">
        <img src={logoSaxplay} alt="ClubedoSax" className="h-7 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} ClubedoSax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ThankYouBasico;
