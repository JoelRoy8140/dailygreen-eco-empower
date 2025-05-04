
import { useIsMobile } from "@/hooks/use-mobile";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { DailyChallenge } from "@/components/DailyChallenge";
import { TaskHistory } from "@/components/TaskHistory";
import { ImpactMap } from "@/components/ImpactMap";

export default function Index() {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <header className="pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-sage-900">Dashboard</h1>
        <p className="text-sm md:text-base text-sage-600 mt-2">
          Track your environmental impact and daily sustainable actions
        </p>
      </header>
      
      <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid md:grid-cols-2 gap-6'}`}>
        <ImpactMetrics />
        <DailyChallenge />
      </div>
      
      <ImpactMap />
      
      <TaskHistory />
    </div>
  );
}
