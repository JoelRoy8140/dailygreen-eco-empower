
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ConnectionError } from "@/components/auth/ConnectionError";
import { ConnectionChecking } from "@/components/auth/ConnectionChecking";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
  const navigate = useNavigate();
  const { session, connectionStatus, checkConnection, refreshSession } = useAuth();
  
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleRefreshConnection = async () => {
    await checkConnection();
    await refreshSession();
  };

  if (connectionStatus === 'disconnected') {
    return <ConnectionError onRefresh={handleRefreshConnection} />;
  }

  if (connectionStatus === 'checking') {
    return <ConnectionChecking />;
  }

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
        
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-xs text-blue-700">
            Email/password authentication is enabled. Google authentication requires additional setup in the Supabase dashboard.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
