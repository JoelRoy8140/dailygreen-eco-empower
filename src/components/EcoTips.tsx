
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

const tips = [
  {
    title: "Energy Saving Tips",
    description: "Switch to LED bulbs and save up to 80% on lighting energy costs.",
  },
  {
    title: "Water Conservation",
    description: "Fix leaky faucets - one drip per second wastes 3,000 gallons annually.",
  },
  {
    title: "Reduce Food Waste",
    description: "Plan meals ahead and store food properly to minimize waste.",
  },
  {
    title: "Sustainable Transport",
    description: "Using public transport can reduce your carbon footprint by 2.6 tons annually.",
  },
];

export function EcoTips() {
  return (
    <Card className="glass-card p-6 animate-fade-up">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Eco Tips Library</h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tips..." className="pl-8" />
        </div>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <Card key={i} className="p-4 bg-background/50">
                <h4 className="font-medium mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
