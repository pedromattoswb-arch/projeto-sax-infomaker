import { useEffect, useState } from "react";

export type DeviceTier = "low" | "mid" | "high";

interface DeviceCapabilities {
  tier: DeviceTier;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  maxParticles: number;
  allowBackdropFilter: boolean;
  allowAnimatedSmoke: boolean;
  allowTilt: boolean;
  measuredFps: number | null;
}

function detectInitialCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      tier: "mid",
      isMobile: true,
      isIOS: false,
      isAndroid: false,
      maxParticles: 60,
      allowBackdropFilter: true,
      allowAnimatedSmoke: true,
      allowTilt: false,
      measuredFps: null,
    };
  }

  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isMobile = window.innerWidth < 768 || isIOS || isAndroid;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = typeof nav.deviceMemory === "number" ? nav.deviceMemory : isMobile ? 4 : 8;
  const cores = typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 4;

  let tier: DeviceTier = "high";
  if (memory <= 2 || cores <= 2) {
    tier = "low";
  } else if (memory <= 4 || cores <= 4 || isMobile) {
    tier = "mid";
  }

  return buildCaps(tier, isMobile, isIOS, isAndroid, null);
}

function buildCaps(
  tier: DeviceTier,
  isMobile: boolean,
  isIOS: boolean,
  isAndroid: boolean,
  measuredFps: number | null
): DeviceCapabilities {
  if (tier === "low") {
    return {
      tier,
      isMobile,
      isIOS,
      isAndroid,
      maxParticles: 24,
      allowBackdropFilter: false,
      allowAnimatedSmoke: false,
      allowTilt: false,
      measuredFps,
    };
  }
  if (tier === "mid") {
    return {
      tier,
      isMobile,
      isIOS,
      isAndroid,
      maxParticles: isMobile ? 95 : 180,
      allowBackdropFilter: true,
      allowAnimatedSmoke: true,
      allowTilt: isAndroid || !isMobile,
      measuredFps,
    };
  }
  return {
    tier,
    isMobile,
    isIOS,
    isAndroid,
    maxParticles: isMobile ? 115 : 280,
    allowBackdropFilter: true,
    allowAnimatedSmoke: true,
    allowTilt: !isIOS,
    measuredFps,
  };
}

/**
 * Adaptive Rendering: detecta memória/núcleos + mede FPS real nos primeiros ~1.4s.
 * Abaixo de 45 fps, degrada automaticamente para tier "low" (menos partículas, sem blur/fumaça animada).
 */
export function useDeviceTier(reducedMotion: boolean): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>(detectInitialCapabilities);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined" || typeof requestAnimationFrame === "undefined") {
      return;
    }

    let rafId = 0;
    let frames = 0;
    let startTime = 0;
    let active = true;

    const tick = (ts: number) => {
      if (!active) return;
      if (!startTime) startTime = ts;
      frames += 1;
      const elapsed = ts - startTime;
      if (elapsed >= 1350) {
        const fps = Math.round((frames * 1000) / elapsed);
        setCaps((prev) => {
          const nextTier: DeviceTier = fps < 45 ? "low" : prev.tier;
          return buildCaps(nextTier, prev.isMobile, prev.isIOS, prev.isAndroid, fps);
        });
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return caps;
}
