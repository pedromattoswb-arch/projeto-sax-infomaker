import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Sparkles, Volume2, Award } from "lucide-react";
import { playSingleSaxNote } from "./saxAudioSynth";

export type SaxType = "alto" | "tenor";

const AMBIENT_NOTES = [
  { symbol: "♪", left: "7%", top: "18%", duration: "10s", delay: "0s", size: "text-xl" },
  { symbol: "♫", left: "91%", top: "24%", duration: "12s", delay: "1.8s", size: "text-2xl" },
  { symbol: "𝄞", left: "14%", top: "52%", duration: "13s", delay: "3.2s", size: "text-3xl" },
  { symbol: "♪", left: "86%", top: "64%", duration: "9.5s", delay: "2.4s", size: "text-lg" },
  { symbol: "♫", left: "6%", top: "82%", duration: "11s", delay: "4.5s", size: "text-2xl" },
  { symbol: "♪", left: "93%", top: "88%", duration: "10.5s", delay: "0.9s", size: "text-xl" },
];

export const AmbientSaxBackdrop = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
    {/* Soft stage amber radial glows */}
    <div
      className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full opacity-35"
      style={{
        background: "radial-gradient(ellipse at center, rgba(245, 185, 66, 0.22) 0%, transparent 70%)",
        filter: "blur(60px)",
      }}
    />
    <div
      className="absolute bottom-[-180px] right-[-120px] w-[540px] h-[540px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, rgba(30, 215, 96, 0.18) 0%, transparent 70%)",
        filter: "blur(65px)",
      }}
    />

    {/* Floating Golden Musical Symbols */}
    {AMBIENT_NOTES.map((n, idx) => (
      <span
        key={idx}
        className={`absolute font-serif text-[#f5b942]/25 animate-sax-float-note ${n.size}`}
        style={
          {
            left: n.left,
            top: n.top,
            "--note-duration": n.duration,
            "--note-delay": n.delay,
          } as React.CSSProperties
        }
      >
        {n.symbol}
      </span>
    ))}
  </div>
);

/* Artistic 5-line Golden Musical Pentagrama Section Divider */
export const MusicalStaffDivider = ({ label }: { label?: string }) => (
  <div className="relative py-6 md:py-9 px-4 max-w-5xl mx-auto select-none overflow-hidden" aria-hidden="true">
    <div className="relative flex items-center justify-center">
      {/* 5 Golden Staff Lines */}
      <div className="w-full flex flex-col gap-[4px] opacity-35">
        {[0, 1, 2, 3, 4].map((line) => (
          <div
            key={line}
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(245,185,66,0.55) 25%, rgba(255,232,163,0.85) 50%, rgba(245,185,66,0.55) 75%, transparent 100%)",
            }}
          />
        ))}
      </div>

      {/* Gliding Animated Musical Note along the Staff */}
      <motion.span
        animate={{ x: [-180, 180], opacity: [0, 0.85, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute text-[#ffe299] text-lg font-bold pointer-events-none"
      >
        ♪
      </motion.span>

      {/* Center Brass Medallion */}
      <div className="absolute px-4 py-1.5 rounded-full bg-[#0d0905] border border-[#f5b942]/40 shadow-[0_0_24px_rgba(245,185,66,0.22)] flex items-center gap-2">
        <span className="text-[#f5b942] text-base leading-none">𝄞</span>
        {label && (
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ffe299]">
            {label}
          </span>
        )}
        <span className="text-[#f5b942] text-sm leading-none">♫</span>
      </div>
    </div>
  </div>
);

interface InteractiveSaxKeyPadProps {
  saxType: SaxType;
  onSaxTypeChange: (t: SaxType) => void;
  onEarnXp: (amount: number, reason: string) => void;
}

const SAX_PEARL_KEYS = [
  { id: "c", note: "Dó", sub: "Tônica", altoFreq: 311.13, tenorFreq: 233.08 },
  { id: "d", note: "Ré", sub: "2ª Maior", altoFreq: 349.23, tenorFreq: 261.63 },
  { id: "e", note: "Mi", sub: "3ª Jazz", altoFreq: 392.0, tenorFreq: 293.66 },
  { id: "g", note: "Sol", sub: "5ª Justa", altoFreq: 466.16, tenorFreq: 349.23 },
  { id: "a", note: "Lá", sub: "6ª Soul", altoFreq: 523.25, tenorFreq: 392.0 },
];

export const InteractiveSaxKeyPad = ({
  saxType,
  onSaxTypeChange,
  onEarnXp,
}: InteractiveSaxKeyPadProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [bursts, setBursts] = useState<Array<{ id: number; keyId: string; symbol: string }>>([]);
  const [notesPlayedCount, setNotesPlayedCount] = useState(0);

  const handleKeyPress = (k: (typeof SAX_PEARL_KEYS)[number]) => {
    setPressedKey(k.id);
    const freq = saxType === "alto" ? k.altoFreq : k.tenorFreq;
    playSingleSaxNote(freq);

    const burstId = Date.now() + Math.random();
    const symbols = ["♪", "♫", "𝄞"];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    setBursts((prev) => [...prev.slice(-6), { id: burstId, keyId: k.id, symbol }]);

    const nextCount = notesPlayedCount + 1;
    setNotesPlayedCount(nextCount);
    if (nextCount === 1) {
      onEarnXp(30, "Primeiro toque nas chaves do Sax!");
    } else if (nextCount === 5) {
      onEarnXp(50, "Combo Solo de Sax Desbloqueado!");
    }

    setTimeout(() => {
      setPressedKey((cur) => (cur === k.id ? null : cur));
    }, 180);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-2">
      <div className="sax-card rounded-3xl p-5 sm:p-6 border border-[#f5b942]/30 relative overflow-hidden">
        {/* Brass tube subtle metallic stripe behind keys */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-[62%] h-5 opacity-25"
          style={{
            background: "linear-gradient(180deg, #ffe59e 0%, #d49222 50%, #6e4707 100%)",
          }}
        />

        {/* Top Row: Personalize Instrument + Gamified Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 relative z-10">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <div className="w-8 h-8 rounded-xl bg-[#f5b942]/15 border border-[#f5b942]/35 flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4 text-[#f5b942]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black font-heading text-white leading-tight flex items-center gap-1.5">
                Experimente Tocar nas Chaves de Madrepérola
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-[#1ed760]/15 text-[#1ed760] px-2 py-0.5 rounded-full border border-[#1ed760]/30">
                  Interativo
                </span>
              </p>
              <p className="text-[11px] text-[#c2b59f]">
                Escolha a afinação do seu sax e toque nas chaves abaixo para ouvir o timbre
              </p>
            </div>
          </div>

          {/* Sax Alto Eb vs Sax Tenor Bb Switcher */}
          <div className="inline-flex rounded-full bg-black/60 p-1 border border-[#f5b942]/30 shrink-0">
            <button
              type="button"
              onClick={() => {
                onSaxTypeChange("alto");
                onEarnXp(20, "Modo Sax Alto (Mib / Eb) selecionado!");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                saxType === "alto"
                  ? "bg-gradient-to-b from-[#ffe49e] to-[#d99522] text-[#1c1102] shadow-md"
                  : "text-[#c2b59f] hover:text-white"
              }`}
            >
              🎷 Sax Alto (Eb)
            </button>
            <button
              type="button"
              onClick={() => {
                onSaxTypeChange("tenor");
                onEarnXp(20, "Modo Sax Tenor (Sib / Bb) selecionado!");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                saxType === "tenor"
                  ? "bg-gradient-to-b from-[#ffe49e] to-[#d99522] text-[#1c1102] shadow-md"
                  : "text-[#c2b59f] hover:text-white"
              }`}
            >
              🎷 Sax Tenor (Bb)
            </button>
          </div>
        </div>

        {/* 5 Playable Mother-of-Pearl Saxophone Keys */}
        <div className="grid grid-cols-5 gap-2.5 sm:gap-4 relative z-10 py-1">
          {SAX_PEARL_KEYS.map((k) => {
            const isPressed = pressedKey === k.id;
            const keyBursts = bursts.filter((b) => b.keyId === k.id);

            return (
              <div key={k.id} className="relative flex flex-col items-center">
                {/* Floating Note Bursts on Press */}
                <AnimatePresence>
                  {keyBursts.map((b) => (
                    <motion.span
                      key={b.id}
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -48, scale: 1.35 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.75, ease: "easeOut" }}
                      className="pointer-events-none absolute -top-5 text-[#ffe299] font-bold text-lg z-20 drop-shadow-[0_0_8px_rgba(245,185,66,0.8)]"
                    >
                      {b.symbol}
                    </motion.span>
                  ))}
                </AnimatePresence>

                {/* Brass Key Cup + Mother-of-Pearl Inlay */}
                <button
                  type="button"
                  onClick={() => handleKeyPress(k)}
                  className={`sax-pearl-key w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center select-none cursor-pointer ${
                    isPressed ? "is-pressed" : ""
                  }`}
                  aria-label={`Tocar nota ${k.note} no Sax ${saxType === "alto" ? "Alto" : "Tenor"}`}
                >
                  <span className="font-heading font-black text-sm sm:text-base leading-none text-[#241604]">
                    {k.note}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6e4b16] mt-0.5">
                    {saxType === "alto" ? "Eb" : "Bb"}
                  </span>
                </button>
                <span className="text-[10px] font-semibold text-[#c2b59f]/80 mt-2 hidden sm:block">
                  {k.sub}
                </span>
              </div>
            );
          })}
        </div>

        {/* Gamified Status Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#c2b59f] relative z-10">
          <span className="inline-flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#f5b942]" />
            Todas as <strong className="text-white">+10.000 partituras</strong> já vêm prontas para{" "}
            <strong className="text-[#ffe299]">
              {saxType === "alto" ? "Sax Alto (Mib / Eb)" : "Sax Tenor (Sib / Bb)"}
            </strong>{" "}
            (e ambos inclusos!)
          </span>
          {notesPlayedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[#1ed760] font-bold">
              <Award className="w-3.5 h-3.5" />
              {notesPlayedCount} {notesPlayedCount === 1 ? "nota tocada" : "notas tocadas"} • Som Ativo!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* Gamified XP Toast Notification */
export const SaxXpToast = ({
  toast,
}: {
  toast: { xp: number; message: string; id: number } | null;
}) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        key={toast.id}
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={{ duration: 0.28 }}
        className="fixed bottom-20 md:bottom-6 right-4 z-[90] pointer-events-none"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-[#130e08]/95 border border-[#f5b942]/50 px-4 py-3 shadow-[0_14px_35px_rgba(0,0,0,0.85),0_0_24px_rgba(245,185,66,0.28)] backdrop-blur-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffe299] to-[#c98317] flex items-center justify-center text-[#1c1102] font-black text-xs shrink-0">
            +{toast.xp}
          </div>
          <div>
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#1ed760]">
              <Sparkles className="w-3 h-3" /> XP Musical Ganho
            </div>
            <p className="text-xs font-bold text-white">{toast.message}</p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
