export type AudioLogLevel = "info" | "warn" | "error";

export interface AudioLogEntry {
  timestamp: string;
  message: string;
  level: AudioLogLevel;
  stepId?: string;
  sceneId?: string;
  trackId?: string;
  file?: string;
  contextState?: string;
  engineState?: string;
  error?: string;
  recoveryAttempt?: number;
  recoveryResult?: "pending" | "success" | "needs_user_gesture" | "failed";
}

const MAX_LOG_ENTRIES = 120;

function isDebugLoggingEnabled(): boolean {
  try {
    if (import.meta.env.DEV) return true;
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("audio_debug") === "1";
    }
  } catch {
    // noop
  }
  return false;
}

class AudioDiagnosticLogger {
  private entries: AudioLogEntry[] = [];

  public log(
    message: string,
    meta: Omit<AudioLogEntry, "timestamp" | "message" | "level"> = {},
    level: AudioLogLevel = "info"
  ): void {
    const entry: AudioLogEntry = {
      timestamp: new Date().toISOString(),
      message,
      level,
      ...meta,
    };

    this.entries.push(entry);
    if (this.entries.length > MAX_LOG_ENTRIES) {
      this.entries.shift();
    }

    if (isDebugLoggingEnabled()) {
      const prefix = `[AUDIO] ${message}`;
      if (level === "error") {
        console.error(prefix, meta);
      } else if (level === "warn") {
        console.warn(prefix, meta);
      } else {
        console.info(prefix, meta);
      }
    }
  }

  public getEntries(): AudioLogEntry[] {
    return [...this.entries];
  }

  public clear(): void {
    this.entries = [];
  }
}

export const audioLogger = new AudioDiagnosticLogger();
