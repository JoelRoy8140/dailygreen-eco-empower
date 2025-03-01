
import { useState, useEffect } from "react";
import { BookOpen, BookmarkPlus, BookmarkCheck, ArrowRight, Check, Clock, Star, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Guide type definition
type Difficulty = "beginner" | "intermediate" | "advanced";
type Category = "water" | "energy" | "waste" | "transportation" | "food" | "lifestyle";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  timeToComplete: string;
  authorName: string;
  imageUrl: string;
  featured: boolean;
  steps: {
    title: string;
    content: string;
  }[];
}

const guides: Guide[] = [
  {
    id: "home-energy-audit",
    title: "DIY Home Energy Audit",
    description: "Learn how to conduct your own home energy assessment to identify efficiency improvements and reduce energy consumption.",
    category: "energy",
    difficulty: "intermediate",
    timeToComplete: "2-4 hours",
    authorName: "Sarah Chen",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop",
    featured: true,
    steps: [
      {
        title: "Gather Tools and Materials",
        content: "You'll need: flashlight, thermometer, candle/incense stick (for draft detection), notebook, camera, ladder (for checking attic/ceiling)."
      },
      {
        title: "Check Air Leaks",
        content: "Inspect windows, doors, and baseboards for drafts. On a windy day, hold a lit incense stick near potential leak sites - if smoke wavers, you've found a leak."
      },
      {
        title: "Inspect Insulation",
        content: "Check attic, walls, and basement for proper insulation. In attics, ensure insulation is evenly distributed with no gaps or compressed areas."
      },
      {
        title: "Evaluate Heating and Cooling Systems",
        content: "Note the age of your systems, check and replace filters, look for unusual noises or inefficient operation."
      },
      {
        title: "Assess Lighting",
        content: "Count light fixtures and bulbs, noting which ones could be replaced with energy-efficient LED options."
      }
    ]
  },
  {
    id: "zero-waste-kitchen",
    title: "Zero-Waste Kitchen Transformation",
    description: "Practical steps to reduce waste in your kitchen through smarter shopping, storage, and food preparation techniques.",
    category: "waste",
    difficulty: "beginner",
    timeToComplete: "1-2 weeks",
    authorName: "Miguel Rodriguez",
    imageUrl: "https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=600&h=400&fit=crop",
    featured: true,
    steps: [
      {
        title: "Conduct a Waste Audit",
        content: "For one week, track all food and packaging waste. Categorize it to identify your biggest waste sources."
      },
      {
        title: "Replace Disposables",
        content: "Switch to reusable alternatives: cloth napkins, beeswax wraps, silicone food covers, glass containers."
      },
      {
        title: "Smart Shopping",
        content: "Buy in bulk with your own containers, choose items with minimal packaging, shop with reusable bags."
      },
      {
        title: "Food Storage Optimization",
        content: "Learn proper storage techniques for different foods to maximize freshness and minimize waste."
      },
      {
        title: "Set Up Composting",
        content: "Create a countertop compost bin for food scraps, and research local composting options."
      }
    ]
  },
  {
    id: "sustainable-wardrobe",
    title: "Building a Sustainable Wardrobe",
    description: "Transform your closet with eco-friendly clothing choices and ethical fashion practices.",
    category: "lifestyle",
    difficulty: "beginner",
    timeToComplete: "Ongoing",
    authorName: "Priya Sharma",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=400&fit=crop",
    featured: false,
    steps: [
      {
        title: "Wardrobe Audit",
        content: "Sort clothes into categories: love/wear often, occasionally wear, never wear, needs repair."
      },
      {
        title: "Research Sustainable Brands",
        content: "Identify brands with transparent supply chains, ethical labor practices, and eco-friendly materials."
      },
      {
        title: "Embrace Quality Over Quantity",
        content: "Learn to identify well-made garments that will last longer, saving money and resources."
      },
      {
        title: "Care and Maintenance",
        content: "Properly care for clothes to extend their life: gentle washing, prompt repairs, proper storage."
      },
      {
        title: "Responsible Disposal",
        content: "Find local textile recycling, donation centers, or clothing swaps for items you no longer need."
      }
    ]
  },
  {
    id: "water-conservation",
    title: "Home Water Conservation System",
    description: "Implement comprehensive water-saving techniques throughout your home to reduce consumption by up to 30%.",
    category: "water",
    difficulty: "intermediate",
    timeToComplete: "1 month",
    authorName: "Ben Waters",
    imageUrl: "https://images.unsplash.com/photo-1519752594763-3a6144a89bd0?w=600&h=400&fit=crop",
    featured: true,
    steps: [
      {
        title: "Measure Current Usage",
        content: "Record water meter readings daily for a week to establish your baseline consumption."
      },
      {
        title: "Upgrade Fixtures",
        content: "Install low-flow showerheads, faucet aerators, and dual-flush toilets to reduce water use."
      },
      {
        title: "Check and Fix Leaks",
        content: "Inspect all pipes, faucets and toilets for leaks using food coloring tests and visual inspection."
      },
      {
        title: "Install Rain Barrels",
        content: "Set up rain collection system for garden watering, reducing dependence on treated water."
      },
      {
        title: "Landscape Modifications",
        content: "Replace water-intensive plants with native, drought-resistant species and improve soil to retain moisture."
      }
    ]
  },
  {
    id: "eco-friendly-commuting",
    title: "Sustainable Commuting Plan",
    description: "Develop a personalized transportation strategy to reduce your carbon footprint while improving your daily travel experience.",
    category: "transportation",
    difficulty: "intermediate",
    timeToComplete: "2-3 weeks",
    authorName: "Carlos Mendez",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
    featured: false,
    steps: [
      {
        title: "Map Your Routes",
        content: "Document your regular travel routes, noting distance, time, and transportation options available."
      },
      {
        title: "Calculate Current Impact",
        content: "Use a carbon calculator to determine the emissions from your current commuting habits."
      },
      {
        title: "Research Alternatives",
        content: "Investigate public transit routes, bike paths, carpooling options, and electric vehicle feasibility."
      },
      {
        title: "Pilot Week",
        content: "Test different sustainable transportation methods for a week, noting convenience and time factors."
      },
      {
        title: "Create Long-term Plan",
        content: "Develop a realistic schedule incorporating the most effective sustainable transportation options."
      }
    ]
  },
  {
    id: "plant-based-transition",
    title: "Transitioning to Plant-Based Eating",
    description: "A step-by-step approach to incorporating more plant-based meals into your diet for environmental and health benefits.",
    category: "food",
    difficulty: "beginner",
    timeToComplete: "3 months",
    authorName: "Maya Johnson",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    featured: false,
    steps: [
      {
        title: "Kitchen Assessment",
        content: "Inventory your pantry and refrigerator, identifying animal products and potential plant-based substitutes."
      },
      {
        title: "Start with Familiar Foods",
        content: "Begin by making plant-based versions of meals you already enjoy, using beans, lentils, or tofu."
      },
      {
        title: "Weekly Meal Planning",
        content: "Create a schedule starting with 2-3 plant-based meals per week, gradually increasing over time."
      },
      {
        title: "Nutrient Education",
        content: "Learn about key nutrients and how to ensure balanced intake from plant sources."
      },
      {
        title: "Building Your Recipe Collection",
        content: "Gather and test plant-based recipes, creating a personal cookbook of favorites."
      }
    ]
  }
];

interface GuidesContentProps {
  activeFilter: string;
}

export function GuidesContent({ activeFilter }: GuidesContentProps) {
  const [bookmarkedGuides, setBookmarkedGuides] = useState<string[]>([]);
  const [guideProgress, setGuideProgress] = useState<Record<string, number>>({});
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const { user } = useAuth();

  // Filter guides based on active filter
  const filteredGuides = guides.filter(guide => {
    if (activeFilter === "featured") return guide.featured;
    if (activeFilter === "bookmarked") return bookmarkedGuides.includes(guide.id);
    return true; // "all" filter
  });

  // Load bookmarked guides and progress from localStorage
  useEffect(() => {
    if (user) {
      const savedBookmarks = localStorage.getItem(`bookmarked-guides-${user.id}`);
      const savedProgress = localStorage.getItem(`guide-progress-${user.id}`);
      
      if (savedBookmarks) {
        setBookmarkedGuides(JSON.parse(savedBookmarks));
      }
      
      if (savedProgress) {
        setGuideProgress(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  // Save bookmarks to localStorage when changed
  useEffect(() => {
    if (user && bookmarkedGuides.length > 0) {
      localStorage.setItem(`bookmarked-guides-${user.id}`, JSON.stringify(bookmarkedGuides));
    }
  }, [bookmarkedGuides, user]);

  // Save progress to localStorage when changed
  useEffect(() => {
    if (user && Object.keys(guideProgress).length > 0) {
      localStorage.setItem(`guide-progress-${user.id}`, JSON.stringify(guideProgress));
    }
  }, [guideProgress, user]);

  const toggleBookmark = (guideId: string) => {
    if (!user) {
      toast.error("Please sign in to bookmark guides");
      return;
    }
    
    if (bookmarkedGuides.includes(guideId)) {
      setBookmarkedGuides(bookmarkedGuides.filter(id => id !== guideId));
      toast.success("Guide removed from bookmarks");
    } else {
      setBookmarkedGuides([...bookmarkedGuides, guideId]);
      toast.success("Guide bookmarked successfully");
    }
  };

  const updateProgress = (guideId: string, stepIndex: number) => {
    if (!user) {
      toast.error("Please sign in to track progress");
      return;
    }
    
    const totalSteps = guides.find(g => g.id === guideId)?.steps.length || 1;
    const newProgress = { ...guideProgress };
    
    // Toggle completed status for this step
    const currentProgress = newProgress[guideId] || 0;
    const stepProgress = 100 / totalSteps;
    
    if (Math.round(currentProgress) >= Math.round((stepIndex + 1) * stepProgress)) {
      // If step is already completed, uncomplete it and all steps after it
      newProgress[guideId] = stepIndex * stepProgress;
    } else {
      // Complete this step
      newProgress[guideId] = (stepIndex + 1) * stepProgress;
    }
    
    setGuideProgress(newProgress);
    
    if (newProgress[guideId] >= 100) {
      toast.success("Congratulations! You've completed this guide!");
    }
  };

  const getCategoryColor = (category: Category) => {
    const colors = {
      water: "text-blue-500 bg-blue-50",
      energy: "text-yellow-500 bg-yellow-50",
      waste: "text-green-500 bg-green-50",
      transportation: "text-purple-500 bg-purple-50",
      food: "text-orange-500 bg-orange-50",
      lifestyle: "text-pink-500 bg-pink-50"
    };
    return colors[category];
  };

  const getDifficultyBadge = (difficulty: Difficulty) => {
    const badges = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    return badges[difficulty];
  };

  // If a guide is selected, show its detailed view
  if (selectedGuide) {
    return (
      <div className="col-span-1 md:col-span-3">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => setSelectedGuide(null)}
        >
          ← Back to Guides
        </Button>
        
        <Card className="w-full glass-card animate-fade-up">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{selectedGuide.title}</CardTitle>
                <CardDescription className="mt-2">{selectedGuide.description}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleBookmark(selectedGuide.id)}
                className="ml-auto"
              >
                {bookmarkedGuides.includes(selectedGuide.id) ? 
                  <BookmarkCheck className="h-5 w-5 text-primary" /> : 
                  <BookmarkPlus className="h-5 w-5" />
                }
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className={cn("capitalize", getCategoryColor(selectedGuide.category))}>
                {selectedGuide.category}
              </Badge>
              <Badge className={cn("capitalize", getDifficultyBadge(selectedGuide.difficulty))}>
                {selectedGuide.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {selectedGuide.timeToComplete}
              </Badge>
            </div>
            
            {user && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(guideProgress[selectedGuide.id] || 0)}%
                  </span>
                </div>
                <Progress value={guideProgress[selectedGuide.id] || 0} className="h-2" />
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {selectedGuide.steps.map((step, index) => {
                  const stepProgress = 100 / selectedGuide.steps.length;
                  const isCompleted = user && (guideProgress[selectedGuide.id] || 0) >= ((index + 1) * stepProgress);
                  
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-4">
                        {user && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "w-8 h-8 rounded-full shrink-0 mt-0.5",
                              isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}
                            onClick={() => updateProgress(selectedGuide.id, index)}
                          >
                            {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                          </Button>
                        )}
                        
                        <div className={cn(
                          "flex-1 p-4 rounded-lg border transition-colors",
                          isCompleted ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                        )}>
                          <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-6">
            <div className="text-sm text-muted-foreground">
              Created by {selectedGuide.authorName}
            </div>
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Print Guide
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If no guides match the filter
  if (filteredGuides.length === 0) {
    return (
      <div className="col-span-1 md:col-span-3">
        <Card className="p-8 text-center">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">No guides found</h3>
            <p className="text-muted-foreground">
              {activeFilter === "bookmarked" 
                ? "You haven't bookmarked any guides yet." 
                : "Try a different filter or check back later for new guides."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show list of guides
  return (
    <>
      {filteredGuides.map((guide) => (
        <Card 
          key={guide.id} 
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={guide.imageUrl} 
              alt={guide.title}
              className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
            />
            <Badge className={cn("absolute top-2 right-2 capitalize", getCategoryColor(guide.category))}>
              {guide.category}
            </Badge>
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-xl">{guide.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(guide.id);
                }}
              >
                {bookmarkedGuides.includes(guide.id) ? 
                  <BookmarkCheck className="h-4 w-4 text-primary" /> : 
                  <BookmarkPlus className="h-4 w-4" />
                }
              </Button>
            </div>
            <CardDescription className="line-clamp-2">{guide.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={cn("capitalize", getDifficultyBadge(guide.difficulty))}>
                {guide.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {guide.timeToComplete}
              </Badge>
            </div>
            
            {user && guideProgress[guide.id] > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{Math.round(guideProgress[guide.id])}%</span>
                </div>
                <Progress value={guideProgress[guide.id]} className="h-1.5" />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0">
            <span className="text-xs text-muted-foreground">By {guide.authorName}</span>
            <Button 
              variant="ghost" 
              className="gap-1 h-8 px-2"
              onClick={() => setSelectedGuide(guide)}
            >
              View Guide <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
