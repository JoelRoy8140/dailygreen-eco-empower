
import { Card } from "@/components/ui/card";

export const ConnectionChecking = () => {
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
};
