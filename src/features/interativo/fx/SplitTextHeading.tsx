import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SplitTextHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Palavras que devem receber gradiente dourado metálico */
  highlightWords?: string[];
  reducedMotion: boolean;
  delay?: number;
  /** 'words' (padrão cinematográfico) ou 'chars' (efeito máquina/calibragem) */
  mode?: "words" | "chars";
}

export const SplitTextHeading = ({
  text,
  as: Tag = "h1",
  className = "",
  highlightWords = [],
  reducedMotion,
  delay = 0.08,
  mode = "words",
}: SplitTextHeadingProps) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const tokens = el.querySelectorAll<HTMLElement>(".jazz-split-token");
    if (tokens.length === 0) return;

    if (reducedMotion) {
      gsap.set(tokens, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(tokens, { opacity: 0, y: mode === "chars" ? 8 : 20 });
    const tween = gsap.to(tokens, {
      opacity: 1,
      y: 0,
      duration: mode === "chars" ? 0.35 : 0.65,
      stagger: mode === "chars" ? 0.022 : 0.065,
      delay,
      ease: "expo.out",
      clearProps: "transform",
    });

    return () => {
      tween.kill();
    };
  }, [text, reducedMotion, delay, mode]);

  const highlightSet = new Set(highlightWords.map((w) => w.toLowerCase()));

  if (mode === "chars") {
    return (
      <Tag ref={containerRef as never} className={className} aria-label={text}>
        {Array.from(text).map((char, idx) => (
          <span
            key={idx}
            aria-hidden="true"
            className="jazz-split-token inline-block whitespace-pre"
          >
            {char}
          </span>
        ))}
      </Tag>
    );
  }

  const words = text.split(" ");
  return (
    <Tag ref={containerRef as never} className={className} aria-label={text}>
      {words.map((word, idx) => {
        const clean = word.replace(/[.,!?:;…()]/g, "").toLowerCase();
        const isGold = highlightSet.has(clean);
        return (
          <span key={idx} aria-hidden="true" className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0">
            <span
              className={`jazz-split-token inline-block ${isGold ? "jazz-gold-text italic" : ""}`}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
};
