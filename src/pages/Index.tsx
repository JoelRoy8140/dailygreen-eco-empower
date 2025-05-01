
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { DailyChallenge } from "@/components/DailyChallenge";
import { TaskHistory } from "@/components/TaskHistory";

export default function Index() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="pb-4">
        <h1 className="text-3xl font-bold text-sage-900">Dashboard</h1>
        <p className="text-sage-600 mt-2">
          Track your environmental impact and daily sustainable actions
        </p>
      </header>
      
      <ImpactMetrics />
      <DailyChallenge />
      <TaskHistory />
    </div>
  );
}
