
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, WifiOff } from "lucide-react";

interface ConnectionErrorProps {
  onRefresh: () => Promise<void>;
}

export const ConnectionError = ({ onRefresh }: ConnectionErrorProps) => {
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
            onClick={onRefresh} 
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
};
