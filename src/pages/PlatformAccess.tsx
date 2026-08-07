import WhatsAppSupport from "@/components/WhatsAppSupport";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";

const PlatformAccess = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <img src={logoClubeSax} alt="Clube do Sax" className="h-16 mb-8" />
      <h1 className="text-3xl font-black mb-4">Acesso à Plataforma Completa</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Você está acessando a área exclusiva para membros do Plano Completo. 
        Navegue pelo menu lateral para encontrar suas partituras e playbacks.
      </p>
      <div className="p-8 border border-white/10 rounded-3xl glass-card">
        <p className="text-gold font-bold mb-4">Seu acesso VIP está ativo!</p>
        <button className="gradient-cta px-8 py-3 rounded-xl font-bold">
          ABRIR ACERVO COMPLETO
        </button>
      </div>
      <WhatsAppSupport />
    </div>
  );
};

export default PlatformAccess;
