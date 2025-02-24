
import { DailyChallenge } from "@/components/DailyChallenge";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { EcoTips } from "@/components/EcoTips";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      <div className="container py-8 px-4 mx-auto">
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-sage-900">
            DailyGreen
          </h1>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Small actions, big impact. Join our community in making sustainable
            choices every day.
          </p>
        </header>

        <div className="max-w-6xl mx-auto space-y-8">
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-sage-800">
              Today's Challenge
            </h2>
            <DailyChallenge />
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-sage-800">
              Your Impact
            </h2>
            <ImpactMetrics />
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-sage-800">
              Sustainability Guide
            </h2>
            <EcoTips />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
