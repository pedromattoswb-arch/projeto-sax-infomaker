import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useNoIndex from "@/hooks/useNoIndex";

const Privacidade = () => {
  useNoIndex();
  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

        <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Compromisso com a Privacidade</h2>
            <p>O Clube do Sax (CNPJ 51.919.716/0001-28) respeita sua privacidade e está comprometido com a proteção dos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Dados Coletados</h2>
            <p>Coletamos os seguintes dados quando você navega ou realiza uma compra:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nome completo, e-mail, telefone/WhatsApp e CPF (no momento da compra)</li>
              <li>Dados de navegação (cookies, endereço IP, dispositivo, páginas visitadas)</li>
              <li>Dados de pagamento (processados diretamente pelas plataformas Cakto/Wiapy — não armazenamos cartões)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Finalidade do Uso dos Dados</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Processar pedidos e entregar o acesso ao produto</li>
              <li>Enviar comunicações relativas à compra e suporte</li>
              <li>Enviar comunicações de marketing (você pode descadastrar a qualquer momento)</li>
              <li>Análise e melhoria da experiência de uso do site</li>
              <li>Cumprir obrigações legais e fiscais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Cookies e Tecnologias de Rastreamento</h2>
            <p>Utilizamos cookies próprios e de terceiros (Meta Pixel, Google Analytics, UTMify) para análise de desempenho e otimização de campanhas. Você pode desativar os cookies nas configurações do seu navegador.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Compartilhamento de Dados</h2>
            <p>Seus dados podem ser compartilhados apenas com parceiros estritamente necessários à operação: processadores de pagamento (Cakto/Wiapy), plataformas de envio de e-mail e WhatsApp, e ferramentas de análise. Nunca vendemos seus dados a terceiros.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Seus Direitos (LGPD)</h2>
            <p>Você pode, a qualquer momento, solicitar:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso, correção ou atualização dos seus dados</li>
              <li>Anonimização, bloqueio ou eliminação dos dados</li>
              <li>Portabilidade ou revogação do consentimento</li>
            </ul>
            <p className="mt-2">Para exercer seus direitos, entre em contato pelo WhatsApp disponível no site.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Segurança</h2>
            <p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. Todo o tráfego do site é criptografado via SSL.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Retenção de Dados</h2>
            <p>Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas e obrigações legais/fiscais.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">9. Alterações nesta Política</h2>
            <p>Esta Política pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">10. Contato do Encarregado (DPO)</h2>
            <p>Em caso de dúvidas sobre o tratamento dos seus dados, entre em contato pelo WhatsApp do site.</p>
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

export default Privacidade;
