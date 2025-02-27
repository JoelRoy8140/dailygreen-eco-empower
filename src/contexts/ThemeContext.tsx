
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("light");
  const { user } = useAuth();

  // Load theme from profile when user logs in
  useEffect(() => {
    async function loadUserTheme() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('theme')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && (data.theme === 'light' || data.theme === 'dark')) {
          setThemeState(data.theme);
          document.documentElement.className = data.theme;
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    }
    
    loadUserTheme();
  }, [user]);

  // Default to system preference if no user preference set
  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (!user && systemPrefersDark) {
      setThemeState("dark");
      document.documentElement.className = "dark";
    }
  }, [user]);

  // Apply theme change
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    document.documentElement.className = newTheme;
    
    // Save theme to user profile if logged in
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ theme: newTheme })
          .eq('id', user.id);
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    await setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
