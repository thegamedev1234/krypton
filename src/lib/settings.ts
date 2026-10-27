import type { AppSettings } from "@/types";

/**
 * UI-only settings. Stored in this browser (localStorage) and applied purely
 * on the client. Nothing here is synced, and an account-backed version would
 * need separate persistence later.
 */
export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  reduceMotion: false,
  reduceTransparency: false,
  defaultModelId: "krypton-5",
  enterToSend: true,
  showTimestamps: true,
  simulateStreaming: true,
  sidebarDefaultCollapsed: false,
  showWelcomeSuggestions: true,
  messageWidth: "comfortable",
  showKeyboardHints: true,
};

export const SETTINGS_STORAGE_KEY = "krypton.ui-settings.v1";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_SETTINGS;

    // Shallow merge with validation-by-defaults: unknown or malformed keys
    // fall back to the shipped default instead of breaking the UI.
    const merged = { ...DEFAULT_SETTINGS } as Record<string, unknown>;
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === typeof merged[key]) {
        merged[key] = value;
      }
    }

    const theme = merged.theme;
    if (theme !== "dark" && theme !== "light" && theme !== "system") {
      merged.theme = DEFAULT_SETTINGS.theme;
    }

    const modelId = merged.defaultModelId;
    if (modelId !== "krypton-7" && modelId !== "krypton-5" && modelId !== "krypton-lite") {
      merged.defaultModelId = DEFAULT_SETTINGS.defaultModelId;
    }

    const width = merged.messageWidth;
    if (width !== "comfortable" && width !== "wide") {
      merged.messageWidth = DEFAULT_SETTINGS.messageWidth;
    }

    return merged as unknown as AppSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function persistSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable (private mode, quota). The UI still works
    // for the current session, so this failure is intentionally silent.
  }
}
