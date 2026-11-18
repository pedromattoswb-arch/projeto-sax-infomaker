import { useState } from "react";
import { ArrowRight, Music } from "lucide-react";
import type { MusicalStyleChoice, SaxChoice } from "../funnel.config";
import { SplitTextHeading } from "../fx/SplitTextHeading";

interface SceneStyleStepProps {
  sax: SaxChoice;
  reducedMotion: boolean;
  onSelectStyle: (style: MusicalStyleChoice) => void;
}

const STYLE_CARDS: Array<{
  id: MusicalStyleChoice;
  label: string;
  desc: string;
  grad: string;
}> = [
  { id: "gospel", label: "Gospel & Harpa", desc: "Louvor, Adoração e 640 hinos", grad: "from-emerald-700/80 to-slate-950" },
  { id: "jazz", label: "Jazz & Bossa", desc: "Standards, Tom Jobim e Blues", grad: "from-amber-700/80 to-stone-950" },
  { id: "pop-mpb", label: "Pop & MPB", desc: "Românticas, Casamento e Brasil", grad: "from-purple-700/80 to-slate-950" },
  { id: "sertanejo", label: "Sertanejo & Seresta", desc: "Clássicos e sucessos no Sax", grad: "from-sky-700/80 to-slate-950" },
];

/** Cena opcional controlada por FUNNEL_CONFIG.flags.ENABLE_STYLE_STEP (false por padrão) */
export const SceneStyleStep = ({ sax, reducedMotion, onSelectStyle }: SceneStyleStepProps) => {
  const [picked, setPicked] = useState<MusicalStyleChoice | null>(null);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-5 pt-16 pb-10 text-center">
      <div className="max-w-lg mx-auto mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f5d58a] mb-2">
          Sax {sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)"} Selecionado
        </p>
        <SplitTextHeading
          text="Qual estilo você mais ama tocar?"
          as="h1"
          highlightWords={["estilo"]}
          className="jazz-display text-white"
          reducedMotion={reducedMotion}
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5 w-full max-w-md mx-auto">
        {STYLE_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => {
              setPicked(card.id);
              window.setTimeout(() => onSelectStyle(card.id), 320);
            }}
            className={`rounded-2xl p-4 text-left bg-gradient-to-br ${card.grad} border transition-all cursor-pointer active:scale-95 ${
              picked === card.id ? "border-[#1ed760] scale-[1.03]" : "border-white/15 hover:border-[#f5d58a]/60"
            }`}
          >
            <Music className="w-5 h-5 text-[#f5d58a] mb-2" />
            <p className="text-base font-black text-white leading-tight">{card.label}</p>
            <p className="text-xs text-white/75 mt-1">{card.desc}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#f5d58a] mt-3">
              Selecionar <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
