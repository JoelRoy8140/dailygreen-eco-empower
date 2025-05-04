import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Guides from "./pages/Guides";
import Map from "./pages/Map";
import { useEffect } from "react";
import { checkSupabaseConnection } from "./integrations/supabase/client";

// Configure the QueryClient with retry logic for connection issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Retry on connection errors
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('NetworkError') || 
            error?.message?.includes('timeout')) {
          return failureCount < 3; // Retry up to 3 times
        }
        return false; // Don't retry other errors
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Retry on connection errors
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('NetworkError') || 
            error?.message?.includes('timeout')) {
          return failureCount < 2; // Retry up to 2 times
        }
        return false; // Don't retry other errors
      },
    },
  },
});

// Periodically check Supabase connection in the background
function ConnectionMonitor() {
  useEffect(() => {
    const checkConnection = async () => {
      await checkSupabaseConnection();
    };
    
    // Check connection every minute
    const interval = setInterval(checkConnection, 60000);
    
    // Initial check
    checkConnection();
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider>
          <ConnectionMonitor />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/map" element={<Map />} />
                <Route path="/community" element={<div>Community Coming Soon</div>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
