
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const challenges = [
  {
    title: "Skip Plastic Today",
    description: "Avoid single-use plastics for the next 24 hours",
    impact: "Saves ~0.5kg CO2",
  },
  {
    title: "Unplug Devices",
    description: "Unplug all unused electronic devices",
    impact: "Saves ~0.3kg CO2",
  },
  {
    title: "Plant-Based Meal",
    description: "Choose plant-based options for your meals today",
    impact: "Saves ~1.5kg CO2",
  },
  {
    title: "Walk or Cycle",
    description: "Choose walking or cycling instead of driving",
    impact: "Saves ~2.4kg CO2",
  },
];

export function DailyChallenge() {
  const [challenge, setChallenge] = useState(challenges[0]);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setChallenge(challenges[randomIndex]);
  }, []);

  const handleComplete = () => {
    setCompleted(true);
    toast({
      title: "Challenge Completed!",
      description: "Great job! You're making a difference.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card p-6 animate-fade-up">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-sage-100 p-3">
          <Leaf className="w-6 h-6 text-sage-600" />
        </div>
        <h3 className="text-xl font-semibold text-center">{challenge.title}</h3>
        <p className="text-muted-foreground text-center">
          {challenge.description}
        </p>
        <div className="text-sm font-medium text-sage-600 bg-sage-50 px-3 py-1 rounded-full">
          {challenge.impact}
        </div>
        <Button
          onClick={handleComplete}
          disabled={completed}
          className="w-full bg-sage-600 hover:bg-sage-700 text-white"
        >
          {completed ? "Completed!" : "Complete Challenge"}
        </Button>
      </div>
    </Card>
  );
}
