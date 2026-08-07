import { MessageCircle } from "lucide-react";

const WhatsAppSupport = () => {
  const phoneNumber = "5511951042381";
  const message = encodeURIComponent("Olá, sou aluno do Plano Completo e preciso de suporte.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center gap-3 overflow-hidden max-w-[60px] hover:max-w-[200px]"
      aria-label="Suporte via WhatsApp"
    >
      <MessageCircle className="w-7 h-7 shrink-0" />
      <span className="font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
        Suporte VIP
      </span>
    </a>
  );
};

export default WhatsAppSupport;
