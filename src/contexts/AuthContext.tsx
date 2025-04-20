
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  connectionStatus: 'connected' | 'disconnected' | 'checking';
  checkConnection: () => Promise<boolean>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  const checkConnection = async () => {
    setConnectionStatus('checking');
    const isConnected = await checkSupabaseConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    return isConnected;
  };
  
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const isConnected = await checkConnection();
      
      if (!isConnected) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        if (error.message.includes("Token expired") || error.message.includes("Invalid token")) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          toast.error("Your session has expired. Please sign in again.");
        }
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check connection first
    checkConnection().then(isConnected => {
      if (!isConnected) {
        setIsLoading(false);
        return;
      }

      // Get initial session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Error retrieving your session");
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    });
    
    // Set up an interval to refresh the connection status periodically
    const connectionCheckInterval = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(connectionCheckInterval);
  }, []);

  const signOut = async () => {
    const isConnected = await checkConnection();
    if (!isConnected) {
      toast.error("Cannot sign out due to connection issues");
      return;
    }
    
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
    connectionStatus,
    checkConnection,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
