
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { DailyChallenge } from "@/components/DailyChallenge";
import { TaskHistory } from "@/components/TaskHistory";

export default function Index() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <ImpactMetrics />
      <DailyChallenge />
      <TaskHistory />
    </div>
  );
}
