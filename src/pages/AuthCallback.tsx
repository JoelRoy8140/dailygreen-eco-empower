
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;
    
    async function handleOAuthCallback() {
      try {
        // Check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Handle successful login
          toast.success("Successfully signed in with Google!");
          navigate("/");
        } else {
          // No session but no error, this might be a new login
          const { error: signInError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          });
          
          if (signInError) throw signInError;
        }
      } catch (error) {
        console.error("Error during OAuth callback:", error);
        toast.error("Failed to complete sign in. Please try again.");
        navigate("/auth");
      }
    }
    
    // Process the callback if we have a hash
    if (hash || window.location.search.includes("code=")) {
      handleOAuthCallback();
    } else {
      // No hash, redirect to auth page
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-sage-500 rounded-full border-t-transparent mb-4"></div>
      <h1 className="text-xl font-medium">Completing your sign in...</h1>
      <p className="text-muted-foreground mt-2">Please wait while we authenticate your account.</p>
    </div>
  );
}
