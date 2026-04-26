import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "O que exatamente eu recebo ao comprar?",
    answer:
      "Ao garantir seu acesso, você recebe uma plataforma exclusiva estilo app com: +10.000 partituras profissionais com playback para tocar junto (Sax Alto e Sax Tenor), organizadas em +18 gêneros musicais. No plano Completo, você também recebe busca por voz, vídeos tutoriais integrados, atualizações mensais com músicas novas, Harpa Cristã completa e 3 bônus exclusivos (Guia de Rotina de Estudo, Mapa de Tonalidades e 100 Músicas Essenciais). O acesso é vitalício e imediato.",
  },
  {
    question: "Funciona para Sax Alto e Tenor?",
    answer:
      "Sim! Todas as partituras com playback estão disponíveis para Sax Alto e Sax Tenor. Você escolhe a tonalidade do seu instrumento.",
  },
  {
    question: "Como recebo o acesso?",
    answer:
      "Assim que o pagamento é confirmado, a plataforma Cakto envia automaticamente um e-mail com seu login e senha de acesso. A entrega é instantânea — funciona 24h, inclusive de madrugada e fim de semana. Importante: confira sua caixa de entrada, a aba \"Promoções\" e a pasta de spam/lixo eletrônico.",
  },
  {
    question: "Quem processa o pagamento?",
    answer:
      "O pagamento é processado pela Cakto, uma plataforma brasileira de pagamentos digitais utilizada por milhares de produtores de conteúdo. Toda a transação é protegida com criptografia SSL e nenhuma informação bancária é armazenada em nosso site.",
  },
  {
    question: "As partituras são de qualidade profissional?",
    answer:
      "Sim. Todas as partituras foram revisadas por músicos profissionais — com melodia, harmonia e arranjos completos em PDF de alta resolução. E cada partitura vem com o playback profissional correspondente para você tocar junto.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer:
      "Sim! A plataforma Clube do Sax funciona perfeitamente em celular, tablet ou computador. É 100% responsiva e funciona como um app — sem precisar instalar nada. Você abre a partitura e dá play no playback na mesma tela.",
  },
  {
    question: "Qual a diferença entre Básico e Completo?",
    answer:
      "O Básico (R$ 9,90) tem +5.000 partituras em PDF com busca por texto. O Completo (R$ 19,90) tem +10.000 partituras com playback profissional para tocar junto, busca por voz, vídeos tutoriais integrados, atualizações mensais, Harpa Cristã completa e 3 bônus exclusivos.",
  },
  {
    question: "O que são os vídeos tutoriais?",
    answer:
      "São vídeos integrados diretamente na plataforma Clube do Sax que ensinam como usar cada recurso: como buscar partituras, usar playbacks, organizar sua prática, entender tonalidades e muito mais. Exclusivo do plano Completo.",
  },
  {
    question: "Como funciona a busca por voz?",
    answer:
      "Na plataforma Clube do Sax (plano Completo), você pode clicar no ícone de microfone e falar o nome da música que quer tocar. A plataforma reconhece sua voz e encontra a partitura e o playback instantaneamente. Funciona em português e é super fácil de usar.",
  },
  {
    question: "E se eu não gostar?",
    answer:
      "Você tem 7 dias de garantia total. Se em 7 dias você não sentir que valeu cada centavo, a gente devolve 100% do seu dinheiro. Sem perguntas. Sem complicação. O reembolso é processado diretamente pela plataforma Cakto.",
  },
  {
    question: "O acesso é realmente vitalício?",
    answer:
      "Sim. Pague uma vez e acesse para sempre — nos dois planos. Inclui todas as atualizações futuras com novas partituras e playbacks.",
  },
  {
    question: "Posso confiar neste site?",
    answer:
      "Sim. O Clube do Sax é uma empresa registrada com CNPJ. O pagamento é processado pela Cakto com criptografia SSL. Oferecemos garantia incondicional de 7 dias — se não gostar, devolvemos 100% do valor. E nosso suporte está disponível por e-mail e WhatsApp.",
  },
  {
    question: "Posso ver quais músicas estão no acervo antes de comprar?",
    answer:
      "Sim! Logo acima na página você encontra uma amostra real das músicas disponíveis na plataforma, organizadas por gênero. São exemplos reais puxados diretamente do nosso acervo. O acervo completo conta com mais de 10.000 partituras com playback profissional para Sax Alto e Sax Tenor — e cresce todo mês com novas adições.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 md:py-40 px-6 md:px-12 relative overflow-hidden" id="faq">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(38_85%_50%/0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
            Suporte & Ajuda
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight">
            Dúvidas Frequentes
          </h2>
          <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto">
            Tudo o que você precisa saber antes de se juntar ao Clube do Sax.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="glass-card rounded-[24px] px-8 shadow-medium border-white/5 hover:border-white/10 transition-elite overflow-hidden"
            >
              <AccordionTrigger className="text-left font-bold font-heading text-base md:text-lg py-6 hover:no-underline hover:text-primary transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium text-base md:text-lg pb-8 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
