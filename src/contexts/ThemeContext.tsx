
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
          .maybeSingle();
          
        if (error) throw error;
        
        if (data && data.theme) {
          const userTheme = data.theme as ThemeType;
          if (userTheme === 'light' || userTheme === 'dark') {
            setThemeState(userTheme);
            document.documentElement.className = userTheme;
          }
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    }
    
    loadUserTheme();
  }, [user]);

  // Always default to light mode instead of checking system preference
  useEffect(() => {
    if (!user) {
      setThemeState("light");
      document.documentElement.className = "light";
    }
  }, [user]);

  // Apply theme change
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    document.documentElement.className = newTheme;
    
    // Save theme to user profile if logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ theme: newTheme } as any)
          .eq('id', user.id);
        
        if (error) throw error;
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
