import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNoIndex } from "@/hooks/useNoIndex";

const Termos = () => {
  useNoIndex();
  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

        <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar o site Clube do Sax (saxplay.site), você concorda integralmente com estes Termos de Uso. Caso não concorde, por favor não utilize o site nem adquira nossos produtos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Sobre o Produto</h2>
            <p>O Clube do Sax oferece um produto digital educacional voltado para o aprendizado de saxofone, contendo partituras, áudios de playback, vídeos e materiais complementares. A entrega é feita por e-mail e/ou WhatsApp logo após a confirmação do pagamento.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Pagamento e Acesso</h2>
            <p>Os pagamentos são processados via plataformas terceiras seguras (Cakto/Wiapy). Após a confirmação, o acesso ao conteúdo é liberado de forma imediata. O acesso é pessoal e intransferível.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Direito de Arrependimento</h2>
            <p>Conforme o Código de Defesa do Consumidor (Art. 49), o cliente tem o prazo de 7 (sete) dias corridos, a partir da data da compra, para solicitar o cancelamento da aquisição. A solicitação deve ser feita por nossos canais oficiais de atendimento.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Propriedade Intelectual</h2>
            <p>Todo o conteúdo disponibilizado (partituras, áudios, vídeos, textos, imagens, marcas) é protegido por direitos autorais. É proibida a reprodução, distribuição, revenda ou compartilhamento do material sem autorização expressa.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Limitação de Responsabilidade</h2>
            <p>O Clube do Sax é uma ferramenta de apoio ao estudo. Os resultados de aprendizagem dependem do esforço, dedicação e prática individual de cada aluno, não havendo garantia de desempenho específico.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Alterações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes Termos a qualquer momento, sendo as alterações publicadas nesta mesma página.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Contato</h2>
            <p>Para dúvidas, suporte ou solicitações, entre em contato pelo WhatsApp disponível no site.</p>
            <p className="mt-4 text-sm">
              <strong className="text-foreground">Clube do Sax</strong><br />
              CNPJ: 51.919.716/0001-28
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Termos;
