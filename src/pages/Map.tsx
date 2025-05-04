
import { ImpactMap } from "@/components/ImpactMap";

export default function Map() {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-sage-900">Impact Map</h1>
        <p className="text-sm md:text-base text-sage-600 mt-2">
          Explore environmental actions and impact around the world
        </p>
      </header>
      
      <div className="h-auto">
        <ImpactMap />
      </div>
    </div>
  );
}
