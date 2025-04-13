
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;
    
    async function handleOAuthCallback() {
      try {
        setIsLoading(true);
        
        // First check connection to Supabase
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          setConnectionError(true);
          console.error("Supabase connection failed");
          return;
        }
        
        // Check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (error.message.includes("Failed to fetch") || 
              error.message.includes("NetworkError") || 
              error.message.includes("timeout")) {
            setConnectionError(true);
            console.error("Supabase connection error:", error);
            return;
          }
          throw error;
        }
        
        if (session) {
          // Handle successful login
          toast.success("Successfully signed in with Google!");
          navigate("/");
        } else {
          // No session but no error, this might be a new login
          try {
            const { error: signInError } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin
              }
            });
            
            if (signInError) {
              if (signInError.message && 
                  (signInError.message.includes("Failed to fetch") || 
                   signInError.message.includes("NetworkError") || 
                   signInError.message.includes("timeout"))) {
                setConnectionError(true);
                console.error("Supabase connection error during sign in:", signInError);
                return;
              }
              throw signInError;
            }
          } catch (signInError) {
            console.error("Error during sign in:", signInError);
            throw signInError;
          }
        }
      } catch (error) {
        console.error("Error during OAuth callback:", error);
        toast.error("Failed to complete sign in. Please try again.");
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    }
    
    // Process the callback if we have a hash
    if (hash || window.location.search.includes("code=")) {
      handleOAuthCallback();
    } else {
      // No hash, redirect to auth page
      navigate("/auth");
    }
  }, [navigate, retries]);

  const handleRetry = async () => {
    setConnectionError(false);
    setIsLoading(true);
    setRetries(prev => prev + 1);
  };

  if (connectionError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <WifiOff className="w-6 h-6 text-red-600" />
        </div>
        <h1 className="text-xl font-medium text-center">Connection Error</h1>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          Unable to connect to authentication service. This could be due to network issues or the service may be temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button 
            onClick={handleRetry}
            className="px-4 py-2 bg-sage-500 text-white rounded-md hover:bg-sage-600 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/auth")}
            className="px-4 py-2 rounded-md"
          >
            Return to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-sage-500 rounded-full border-t-transparent mb-4"></div>
      <h1 className="text-xl font-medium">Completing your sign in...</h1>
      <p className="text-muted-foreground mt-2">Please wait while we authenticate your account.</p>
    </div>
  );
}
