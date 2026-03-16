import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Funciona para Sax Alto e Tenor?",
    answer:
      "Sim! Todas as partituras estão disponíveis para Sax Alto e Sax Tenor. Você escolhe a tonalidade do seu instrumento.",
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
      "Sim. Todas as +10.000 partituras foram revisadas por músicos profissionais — com melodia, harmonia e arranjos completos em PDF de alta resolução.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer:
      "Sim! A plataforma SaxPlay funciona perfeitamente em celular, tablet ou computador. É 100% responsiva e funciona como um app — sem precisar instalar nada.",
  },
  {
    question: "Qual a diferença entre Básico e Completo?",
    answer:
      "O Básico (R$ 19,90) tem +5.000 partituras em PDF com busca inteligente na plataforma. O Completo (R$ 39,90) tem +10.000 partituras e playbacks, busca por voz, vídeos tutoriais integrados, atualizações mensais, Harpa Cristã completa e 3 bônus exclusivos (Rotina de Estudo, Mapa de Tonalidades e 100 Músicas Essenciais). Por R$ 20 a mais, é a escolha mais inteligente.",
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
      "Você tem 7 dias de garantia total. Teste a plataforma com tranquilidade — se não for o que você esperava, a gente resolve sem complicação.",
  },
  {
    question: "O acesso é realmente vitalício?",
    answer:
      "Sim. Pague uma vez e acesse para sempre — nos dois planos. Inclui todas as atualizações futuras.",
  },
  {
    question: "Posso confiar neste site?",
    answer:
      "Com certeza. O SaxPlay é uma empresa registrada com CNPJ, com mais de 847 clientes ativos. Somos recomendados por escolas e professores de saxofone em todo o Brasil. Oferecemos garantia de 7 dias e suporte ativo por e-mail e WhatsApp.",
  },
  {
    question: "Posso ver quais músicas estão no acervo antes de comprar?",
    answer:
      "Sim! Logo acima na página você encontra uma amostra real das músicas disponíveis na plataforma, organizadas por gênero. São exemplos reais puxados diretamente do nosso acervo. O acervo completo conta com mais de 10.000 partituras e playbacks para Sax Alto e Sax Tenor — e cresce todo mês com novas adições.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 px-4 md:px-8" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 font-heading">
          Dúvidas? A Gente Responde
        </h2>
        <p className="text-center text-foreground mb-10 font-body text-base">
          As perguntas mais comuns antes de garantir o acesso
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="bg-card rounded-xl border border-border px-5 shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold font-body text-sm md:text-base py-4 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground font-body text-sm pb-4">
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
