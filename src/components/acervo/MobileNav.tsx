import React from "react";
import { Menu, X, Music, BookOpen, Piano, Globe, Gift, Crown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoSaxplay from "@/assets/logo-saxplay.png";

interface MobileNavProps {
  open: boolean;
  onToggle: () => void;
  plan?: "basic" | "premium";
}

const premiumNavItems = [
  { label: "Acervo", path: "/plano-premium-completo", icon: Music },
  { label: "Bônus", path: "/plano-premium-completo#bonus", icon: Gift },
  { label: "Rotina de Estudo", path: "/bonus/rotina-de-estudo", icon: BookOpen },
  { label: "Mapa de Tonalidades", path: "/bonus/mapa-de-tonalidades", icon: Piano },
  { label: "100 Músicas", path: "/bonus/100-musicas", icon: Globe },
];

const basicNavItems = [
  { label: "Acervo", path: "/acervo-basico", icon: Music },
];

const MobileNav: React.FC<MobileNavProps> = ({ open, onToggle, plan = "premium" }) => {
  const navItems = plan === "basic" ? basicNavItems : premiumNavItems;
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onToggle}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-card shadow-2xl transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <img src={logoSaxplay} alt="ClubedoSax" className="h-10 w-auto" />
          <button
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onToggle}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-colors font-body font-semibold text-sm min-h-[48px]"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          {plan === "basic" && (
            <a
              href="https://pay.cakto.com.br/52pq694_804276"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors font-body font-bold text-sm min-h-[48px] mt-2 border border-amber-500/20"
            >
              <Crown className="w-5 h-5" />
              Fazer Upgrade — Plano Completo
            </a>
          )}
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
