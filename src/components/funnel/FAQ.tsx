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
      "Sim! Todas as partituras estão disponíveis para Sax Alto e Sax Tenor. Você escolhe a tonalidade ideal para o seu instrumento.",
  },
  {
    question: "Como recebo o acesso?",
    answer:
      "O acesso é enviado imediatamente assim que o pagamento é aprovado, por e-mail, através da plataforma Cakto. Você recebe tudo na hora, 24 horas por dia, sem precisar esperar.",
  },
  {
    question: "As partituras são de qualidade profissional?",
    answer:
      "Sim! Todas as partituras foram revisadas por músicos profissionais. São cifradas, com melodia, harmonia e arranjos completos em PDF de alta resolução.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer:
      "Sim! A plataforma é 100% responsiva. Você pode acessar pelo celular, tablet ou computador, onde e quando quiser.",
  },
  {
    question: "Qual a diferença entre o plano Essencial e o Premium?",
    answer:
      "O Essencial inclui 1.600 partituras em PDF. O Premium inclui tudo isso MAIS 400 partituras extras, playbacks profissionais sincronizados, formato interativo exclusivo, atualizações mensais, Harpa Cristã completa e 3 bônus exclusivos. Por apenas R$ 10 a mais, vale muito mais a pena.",
  },
  {
    question: "E se eu não gostar?",
    answer:
      "Você tem 7 dias de garantia incondicional. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia. Risco zero.",
  },
  {
    question: "Posso parcelar o pagamento?",
    answer:
      "O valor já é super acessível (a partir de R$ 9,90), mas sim, oferecemos opções de pagamento via Pix e cartão de crédito na página de checkout.",
  },
  {
    question: "O acesso é realmente vitalício?",
    answer:
      "Sim! Tanto o plano Essencial quanto o Premium oferecem acesso vitalício. Você paga uma única vez e acessa para sempre.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 px-4 md:px-8" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 font-heading">
          Perguntas Frequentes
        </h2>
        <p className="text-center text-foreground mb-10 font-body text-base">
          Tire suas dúvidas antes de garantir seu acesso
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
