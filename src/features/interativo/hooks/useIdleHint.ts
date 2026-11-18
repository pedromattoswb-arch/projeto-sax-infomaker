import { useEffect, useState } from "react";

/**
 * Dispara flags de dica animada quando o lead fica inativo numa cena.
 * Reseta automaticamente quando `resetKey` muda ou o componente desmonta.
 */
export function useIdleHint(
  enabled: boolean,
  delayMs: number,
  resetKey: string | number = 0
): boolean {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    setIsIdle(false);
    if (!enabled) return;

    const timer = window.setTimeout(() => {
      setIsIdle(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [enabled, delayMs, resetKey]);

  return isIdle;
}
