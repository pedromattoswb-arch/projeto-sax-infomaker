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
      "Ao garantir seu acesso, você recebe uma plataforma exclusiva estilo app com: +1.000 partituras profissionais com playback para tocar junto (Sax Alto e Sax Tenor), organizadas em +18 gêneros musicais. No plano Completo, você também recebe busca por voz, vídeos tutoriais integrados, atualizações mensais com músicas novas, Harpa Cristã completa e 3 bônus exclusivos (Guia de Rotina de Estudo, Mapa de Tonalidades e 100 Músicas Essenciais). O acesso é vitalício e imediato.",
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
      "Sim! A plataforma SaxPlay funciona perfeitamente em celular, tablet ou computador. É 100% responsiva e funciona como um app — sem precisar instalar nada. Você abre a partitura e dá play no playback na mesma tela.",
  },
  {
    question: "Qual a diferença entre Básico e Completo?",
    answer:
      "O Básico (R$ 19,90) tem +5.000 partituras em PDF com busca por texto. O Completo (R$ 39,90) tem +1.000 partituras com playback profissional para tocar junto, busca por voz, vídeos tutoriais integrados, atualizações mensais, Harpa Cristã completa e 3 bônus exclusivos. Por R$ 20 a mais, é a escolha de 9 em cada 10 saxofonistas.",
  },
  {
    question: "O que são os vídeos tutoriais?",
    answer:
      "São vídeos integrados diretamente na plataforma SaxPlay que ensinam como usar cada recurso: como buscar partituras, usar playbacks, organizar sua prática, entender tonalidades e muito mais. Exclusivo do plano Completo.",
  },
  {
    question: "Como funciona a busca por voz?",
    answer:
      "Na plataforma SaxPlay (plano Completo), você pode clicar no ícone de microfone e falar o nome da música que quer tocar. A plataforma reconhece sua voz e encontra a partitura e o playback instantaneamente. Funciona em português e é super fácil de usar.",
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
      "Com certeza. O SaxPlay é uma empresa registrada com CNPJ, com mais de 847 clientes ativos. Somos recomendados por escolas e professores de saxofone em todo o Brasil. Oferecemos garantia de 7 dias e suporte ativo por e-mail e WhatsApp.",
  },
  {
    question: "Posso ver quais músicas estão no acervo antes de comprar?",
    answer:
      "Sim! Logo acima na página você encontra uma amostra real das músicas disponíveis na plataforma, organizadas por gênero. São exemplos reais puxados diretamente do nosso acervo. O acervo completo conta com mais de 1.000 partituras com playback profissional para Sax Alto e Sax Tenor — e cresce todo mês com novas adições.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 px-4 md:px-8 section-alt" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 font-heading">
          Dúvidas? A Gente Responde
        </h2>
        <p className="text-center text-foreground mb-10 font-body text-base md:text-lg">
          As perguntas mais comuns antes de garantir o acesso
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="glass-card rounded-xl px-5 shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold font-body text-sm md:text-base py-4 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground font-body text-sm md:text-base pb-4">
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
