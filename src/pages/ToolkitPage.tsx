import { useState } from "react";
import { Gauge, Timer, Music } from "lucide-react";
import useNoIndex from "@/hooks/useNoIndex";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import Tuner from "@/components/toolkit/Tuner";
import Metronome from "@/components/toolkit/Metronome";
import ScaleGenerator from "@/components/toolkit/ScaleGenerator";

type Tab = "tuner" | "metronome" | "scales";

interface ToolkitPageProps {
  showScales?: boolean;
}

const tabs: { key: Tab; label: string; icon: typeof Gauge; fullOnly?: boolean }[] = [
  { key: "tuner", label: "Afinador", icon: Gauge },
  { key: "metronome", label: "Metrônomo", icon: Timer },
  { key: "scales", label: "Escalas", icon: Music, fullOnly: true },
];

const ToolkitPage = ({ showScales = true }: ToolkitPageProps) => {
  useNoIndex();
  const [activeTab, setActiveTab] = useState<Tab>("tuner");

  const visibleTabs = showScales ? tabs : tabs.filter((t) => !t.fullOnly);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="py-3 px-4 md:px-8 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-8 md:h-10 w-auto" />
          <span className="text-xs font-bold font-heading text-primary border border-primary/20 rounded-full px-3 py-1">
            KIT FERRAMENTAS
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto flex">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold font-heading transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto pb-12">
        {activeTab === "tuner" && <Tuner />}
        {activeTab === "metronome" && <Metronome />}
        {activeTab === "scales" && showScales && <ScaleGenerator />}
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border text-center">
        <img src={logoClubeSax} alt="Clube do Sax" className="h-7 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Clube do Sax. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ToolkitPage;
