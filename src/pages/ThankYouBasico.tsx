import { CheckCircle2, ArrowRight, Smartphone, Music, Mail, Zap, Gauge, Timer, Check, Star, Sparkles, Lock, Gift, ChevronDown, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import kitBanner from "@/assets/kit-ferramentas-banner.png";

const ThankYouBasico = () => {
  useNoIndex();
  const [showUpsell, setShowUpsell] = useState(false);

  const scrollToUpsell = () => {
    setShowUpsell(true);
    setTimeout(() => {
      document.getElementById("oferta-exclusiva")?.scrollIntoView({ behavior: "smooth" });
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

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 inline-block">
            <p className="text-primary font-bold text-sm md:text-base flex items-center gap-2 justify-center">
              <Mail className="w-4 h-4" />
              O acesso acabou de ser enviado para o e-mail cadastrado via plataforma Cakto
            </p>
          </div>

          <p className="text-foreground font-body text-[15px] md:text-lg mb-6 leading-relaxed max-w-xl mx-auto">
            Você agora tem acesso a <strong>+5.000 partituras para Sax Alto e Sax Tenor</strong> na plataforma Clube do Sax. Siga as instruções abaixo para começar a tocar.
          </p>

          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={scrollToUpsell}
              className="gradient-cta text-white font-bold font-heading py-4 px-10 rounded-xl text-[15px] md:text-lg shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-2 group"
            >
              VER O QUE VOCÊ DESBLOQUEOU
              <Lock className="w-5 h-5 group-hover:hidden" />
              <Gift className="w-5 h-5 hidden group-hover:block animate-bounce" />
            </button>
            <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-1">
              <ChevronDown className="w-3 h-3" /> Clique acima para liberar seu bônus exclusivo
            </p>
          </div>
        </div>
      </section>

      {/* UPSELL SECTION — Improved & Visual */}
      {showUpsell && (
        <section className="py-12 px-4 md:px-16 section-alt animate-fade-in scroll-mt-20 border-y border-primary/10 bg-gradient-to-b from-card to-background" id="oferta-exclusiva">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-4">
                <Zap className="w-4 h-4 text-primary fill-primary animate-pulse" />
                <span className="text-xs font-bold font-heading text-primary uppercase tracking-wider">Oportunidade Única de Upgrade</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading mb-6 tracking-tight">
                Transforme seu estudo com as <br className="hidden md:block" />
                <span className="text-primary underline decoration-primary/30">Ferramentas de Elite</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
                Você já tem as partituras. Agora, imagine ter o <span className="text-foreground font-bold italic">laboratório completo</span> do saxofonista na palma da sua mão.
              </p>
            </div>

            {/* Visual Demonstration Layout */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-card rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                  <img src={kitBanner} alt="Kit Ferramentas" className="w-full h-auto transform group-hover:scale-[1.01] transition-transform duration-500" />
                  
                  {/* Floating labels / "Live Preview" markers */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10 uppercase font-bold tracking-widest">
                    Interface Profissional
                  </div>
                </div>
                
                {/* Visual highlight cards for the 3 tools */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Afinador", icon: Gauge, detail: "Ultra-Preciso" },
                    { label: "Metrônomo", icon: Timer, detail: "Ritmo Perfeito" },
                    { label: "Escalas", icon: Music, detail: "Estudo Guiado" }
                  ].map((t) => (
                    <div key={t.label} className="bg-card/50 border border-border rounded-xl p-3 text-center">
                      <t.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-[10px] font-bold uppercase tracking-tighter">{t.label}</div>
                      <div className="text-[9px] text-muted-foreground">{t.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    O que você vai desbloquear:
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { title: "Afinador Cromático Inteligente", desc: "Detecta a nota exata, frequência (Hz) e mostra a transposição para Sax Alto/Tenor em tempo real." },
                      { title: "Metrônomo de Estudo Progressivo", desc: "Controle de BPM preciso, modos rítmicos e sinal sonoro de alta definição para nunca perder o tempo." },
                      { title: "Gerador de Escalas e Arpejos", desc: "Visualize e ouça como cada escala deve soar. O guia definitivo para improvisação e técnica." }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                        <div className="mt-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground leading-snug">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm italic text-muted-foreground mb-4">
                    "Essas 3 ferramentas sozinhas valeriam mais de R$ 100,00 se compradas separadamente em apps de celular. Aqui você leva as três integradas."
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Card — Main Upsell */}
            <div className="max-w-xl mx-auto glass-card rounded-3xl p-8 md:p-10 border-2 border-primary/40 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-[hsl(142,70%,45%)] to-primary" />
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              
              <p className="text-sm text-primary font-bold font-heading uppercase tracking-[0.2em] mb-2">Acesso Vitalício Liberado</p>
              <h3 className="text-xl md:text-2xl font-extrabold mb-4">Kit de Ferramentas do Saxofonista</h3>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-muted-foreground line-through text-xl">R$ 97,00</span>
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  70% OFF HOJE
                </div>
              </div>

              <div className="text-5xl md:text-7xl font-black font-heading text-primary mb-2 drop-shadow-sm">
                <span className="text-2xl align-top mt-4 mr-1">R$</span>27,90
              </div>
              <p className="text-sm text-muted-foreground mb-8">Pagamento único · Sem mensalidades · Atualizações grátis</p>
              
              <a
                href="https://pay.wiapy.com/ymgWWLcrw9"
                className="gradient-cta text-white font-bold font-heading py-5 px-10 rounded-2xl text-lg md:text-xl shadow-cta hover:shadow-cta-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 animate-cta-pulse inline-flex items-center gap-3 w-full justify-center group"
              >
                QUERO O MEU KIT AGORA
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-[hsl(142,70%,45%)]" /> Compra 100% Segura
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" /> Acesso Imediato
                </div>
              </div>
            </div>

            {/* DOWNSELL / EXIT OPTION */}
            <div className="mt-12 text-center">
              <div className="inline-block p-6 rounded-2xl border border-dashed border-border hover:border-primary/30 transition-all group">
                <p className="text-sm text-muted-foreground mb-4">Ainda na dúvida? Temos uma condição especial para você não ficar de fora.</p>
                <a 
                  href="https://pay.wiapy.com/SSjOIsHzZ"
                  className="text-primary font-bold text-sm underline-offset-4 hover:underline flex items-center justify-center gap-2 transition-all"
                >
                  Prefere o acesso promocional por apenas R$ 14,50? Clique aqui
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              
              <button 
                onClick={() => {
                  document.getElementById("acesso")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-8 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors uppercase tracking-widest font-bold"
              >
                Não, obrigado. Quero apenas minhas partituras.
              </button>
            </div>
          </div>
        </section>
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
