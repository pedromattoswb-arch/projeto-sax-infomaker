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
      "Sim. Todas foram revisadas por músicos profissionais — com melodia, harmonia e arranjos completos em PDF de alta resolução.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer:
      "Sim! Celular, tablet ou computador. A plataforma é 100% responsiva.",
  },
  {
    question: "Qual a diferença entre Essencial e Premium?",
    answer:
      "O Essencial tem 1.600 partituras em PDF. O Premium tem tudo isso + 400 partituras extras, playbacks sincronizados, formato interativo, atualizações mensais, Harpa Cristã completa e 3 bônus exclusivos. Por R$ 10 a mais, é a escolha óbvia.",
  },
  {
    question: "E se eu não gostar?",
    answer:
      "Você tem 7 dias de garantia incondicional. O reembolso é processado diretamente pela plataforma Cakto — devolvemos 100% do valor, sem perguntas. Risco zero.",
  },
  {
    question: "O acesso é realmente vitalício?",
    answer:
      "Sim. Pague uma vez e acesse para sempre — nos dois planos.",
  },
  {
    question: "Posso confiar neste site?",
    answer:
      "Com certeza. O Clube do Sax Brasil é uma empresa registrada com CNPJ, com mais de 847 clientes ativos. Oferecemos garantia de 7 dias com reembolso automático via Cakto, e suporte ativo por e-mail e WhatsApp. Estamos aqui para te ajudar.",
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
