
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ImpactMetrics() {
  const [progress, setProgress] = useState(0);
  const [communityProgress, setCommunityProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500);
    const timer2 = setTimeout(() => setCommunityProgress(92), 800);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 animate-fade-up">
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Carbon Saved</span>
              <span className="font-medium">{progress}kg</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Community Impact</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total CO2 Reduced</span>
              <span className="font-medium">{communityProgress}kg</span>
            </div>
            <Progress value={communityProgress} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
