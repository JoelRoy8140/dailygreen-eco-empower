import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, AlertCircle, ExternalLink, RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { session, isLoading, connectionStatus, checkConnection, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleRefreshConnection = async () => {
    await checkConnection();
    await refreshSession();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    if (connectionStatus === 'disconnected') {
      toast.error("Cannot sign in due to connection issues");
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("timeout")) {
          toast.error("Connection to authentication service failed");
          await checkConnection();
          return;
        }
        throw error;
      }
      
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Error signing in");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    if (connectionStatus === 'disconnected') {
      toast.error("Cannot sign up due to connection issues");
      return;
    }
    
    try {
      setLoading(true);
      
      // Sign up the user
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("timeout")) {
          toast.error("Connection to authentication service failed");
          await checkConnection();
          return;
        }
        throw error;
      }
      
      toast.success("Signed up successfully! Please check your email for verification.");
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (connectionStatus === 'disconnected') {
      toast.error("Cannot sign in with Google due to connection issues");
      return;
    }
    
    try {
      setGoogleLoading(true);
      
      // Configure the OAuth redirect with more options
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        }
      });
      
      if (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("timeout")) {
          toast.error("Connection to Google authentication failed");
          await checkConnection();
          return;
        }
        throw error;
      }
      
      // If we have a URL to redirect to, go there
      if (data?.url) {
        toast.info("Redirecting to Google...");
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Error connecting to Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // If connection error, show error state with retry option
  if (connectionStatus === 'disconnected') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <WifiOff className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
            <p className="mb-6 text-muted-foreground">
              Unable to connect to our authentication service. This could be due to network issues or the service may be temporarily unavailable.
            </p>
            <Button 
              onClick={handleRefreshConnection} 
              className="w-full mb-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <p className="text-sm text-muted-foreground">
              If the problem persists, please try again later or contact support.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // If checking connection, show loading state
  if (connectionStatus === 'checking') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="animate-spin h-12 w-12 border-4 border-sage-500 rounded-full border-t-transparent mb-4"></div>
            <h1 className="text-xl font-medium">Checking connection...</h1>
            <p className="text-muted-foreground mt-2">Please wait while we connect to the authentication service.</p>
          </div>
        </Card>
      </div>
    );
  }

  // If user is already logged in, redirect to homepage
  if (session) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Welcome to DailyGreen</h1>
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Wifi className="w-3 h-3" />
              <span>Connected</span>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-sage-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-sage-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full"
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-sage-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-sage-400" />
                  <Input
                    type="text"
                    placeholder="Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-sage-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-sage-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full"
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-sage-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
