"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// "eden" first, and the default: it is brahmexa.com's own theme, and this
// provider stamps data-theme onto <html>, which outranks the :root block in
// the stylesheet. Leaving the default as "azure" meant the eden tokens were
// written but never applied — the page rendered warm cream text on the old
// navy blue, because only the tokens azure does NOT define got through.
export type Theme = "eden" | "azure" | "midnight" | "cosmic" | "ember" | "dusk" | "void" | "pearl" | "mono";

const THEMES: Theme[] = ["eden", "azure", "midnight", "cosmic", "ember", "dusk", "void", "pearl", "mono"];
const STORAGE_KEY = "brahmando-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "eden",
  setTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("eden");

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved && THEMES.includes(saved)) setThemeState(saved);
  }, []);

  // Propagate theme to <html data-theme="…">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
