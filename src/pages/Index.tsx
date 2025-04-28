import { ImpactMetrics } from "@/components/ImpactMetrics";
import { DailyChallenge } from "@/components/DailyChallenge";
import { TaskHistory } from "@/components/TaskHistory";
import { UnitTestingTable } from "@/components/UnitTestingTable";

export default function Index() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <UnitTestingTable />
      <ImpactMetrics />
      <DailyChallenge />
      <TaskHistory />
    </div>
  );
}
