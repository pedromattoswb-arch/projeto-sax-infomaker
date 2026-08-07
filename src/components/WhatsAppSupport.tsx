import whatsappLogo from "@/assets/whatsapp-logo.png.asset.json";

const WhatsAppSupport = ({ showFooterButton = false }: { showFooterButton?: boolean }) => {
  const phoneNumber = "5511951042381";
  const message = encodeURIComponent("Olá, sou aluno do Plano Completo e tenho uma dúvida.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  if (showFooterButton) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-5 rounded-2xl font-bold hover:bg-[#128C7E] transition-all shadow-xl hover:shadow-2xl border-2 border-white/20 active:scale-[0.98]"
      >
        <img src={whatsappLogo.url} alt="" className="w-8 h-8 shrink-0" />
        <span className="text-lg">Dúvidas? Fale conosco no WhatsApp</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center gap-3 overflow-hidden max-w-[64px] hover:max-w-[240px] border-2 border-white/30"
      aria-label="Suporte via WhatsApp"
    >
      <img src={whatsappLogo.url} alt="" className="w-10 h-10 shrink-0" />
      <span className="font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm md:text-base pr-2 drop-shadow-sm">
        SUPORTE VIP
      </span>
    </a>
  );
};

export default WhatsAppSupport;
