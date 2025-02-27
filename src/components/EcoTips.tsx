
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, ArrowRight, Leaf, Droplet, Zap, ShoppingBag, Recycle, Car, Home, Trees, Globe, ExternalLink } from "lucide-react";

// Eco tips data organized by categories
const tipCategories = [
  {
    id: "energy",
    name: "Energy",
    icon: Zap,
    color: "text-amber-500",
    description: "Reduce your energy consumption and carbon footprint",
    tips: [
      {
        title: "Switch to LED Bulbs",
        description: "LED bulbs use up to 80% less energy than traditional incandescent bulbs and last up to 25 times longer.",
        impact: "high",
        action: "Replace 5 most-used light bulbs with LEDs",
        link: "https://www.energy.gov/energysaver/led-lighting"
      },
      {
        title: "Unplug Electronics",
        description: "Many devices continue to draw power even when turned off. Unplug chargers and electronics when not in use.",
        impact: "medium",
        action: "Use power strips to easily turn off multiple devices",
        link: "https://www.energy.gov/energysaver/articles/3-easy-tips-reduce-your-standby-power-loads"
      },
      {
        title: "Adjust Your Thermostat",
        description: "Lowering your thermostat by 1-2°F in winter and raising it in summer can reduce energy bills by up to 10%.",
        impact: "high",
        action: "Install a programmable thermostat",
        link: "https://www.energy.gov/energysaver/thermostats"
      },
      {
        title: "Seasonal HVAC Maintenance",
        description: "Regular maintenance of heating and cooling systems improves efficiency and extends equipment life.",
        impact: "medium",
        action: "Schedule bi-annual HVAC maintenance",
      },
      {
        title: "Energy-Efficient Appliances",
        description: "When replacing appliances, look for ENERGY STAR certified models that use less electricity and water.",
        impact: "high",
        action: "Replace your oldest appliance with an ENERGY STAR model",
        link: "https://www.energystar.gov/"
      }
    ]
  },
  {
    id: "water",
    name: "Water",
    icon: Droplet,
    color: "text-blue-500",
    description: "Conserve water and protect this vital resource",
    tips: [
      {
        title: "Fix Leaky Faucets",
        description: "A faucet that drips one drop per second can waste up to 3,000 gallons of water per year.",
        impact: "medium",
        action: "Check and repair any leaking faucets or pipes",
        link: "https://www.epa.gov/watersense/fix-leak-week"
      },
      {
        title: "Install Low-Flow Fixtures",
        description: "Low-flow showerheads and faucet aerators can reduce water usage by 30-50% without sacrificing performance.",
        impact: "high",
        action: "Install a WaterSense labeled showerhead",
        link: "https://www.epa.gov/watersense/showerheads"
      },
      {
        title: "Shorter Showers",
        description: "Cutting your shower time by just 2 minutes can save up to 10 gallons of water per shower.",
        impact: "medium",
        action: "Use a shower timer to limit showers to 5 minutes",
      },
      {
        title: "Rainwater Collection",
        description: "Collect rainwater in barrels for garden and lawn watering, reducing demand on treated water supplies.",
        impact: "medium",
        action: "Install a rain barrel on your downspout",
        link: "https://www.epa.gov/soakuptherain/soak-rain-rain-barrels"
      },
      {
        title: "Water-Efficient Landscaping",
        description: "Choose native plants adapted to your local climate that require less water and maintenance.",
        impact: "high",
        action: "Replace 25% of your lawn with native plants",
        link: "https://www.epa.gov/watersense/landscaping-tips"
      }
    ]
  },
  {
    id: "waste",
    name: "Waste",
    icon: Recycle,
    color: "text-green-500",
    description: "Reduce, reuse, and recycle to minimize waste",
    tips: [
      {
        title: "Compost Food Scraps",
        description: "About 30% of household waste can be composted, reducing methane emissions from landfills.",
        impact: "high",
        action: "Start a compost bin for food scraps and yard waste",
        link: "https://www.epa.gov/recycle/composting-home"
      },
      {
        title: "Reduce Single-Use Plastics",
        description: "Bring reusable bags, bottles, and containers to avoid disposable plastic items.",
        impact: "high",
        action: "Carry a reusable water bottle, coffee cup, and shopping bags",
      },
      {
        title: "Proper Recycling",
        description: "Learn what can and can't be recycled in your area to avoid contaminating recycling streams.",
        impact: "medium",
        action: "Print a recycling guide for your refrigerator",
        link: "https://www.epa.gov/recycle"
      },
      {
        title: "Buy in Bulk",
        description: "Purchasing food and household items in bulk reduces packaging waste and often costs less.",
        impact: "medium",
        action: "Set up a pantry storage system for bulk items",
      },
      {
        title: "Repair, Don't Replace",
        description: "Fix broken items instead of throwing them away to reduce waste and save money.",
        impact: "medium",
        action: "Learn basic repair skills or find local repair services",
        link: "https://www.ifixit.com/Guide"
      }
    ]
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: Car,
    color: "text-purple-500",
    description: "Sustainable mobility options to reduce emissions",
    tips: [
      {
        title: "Use Public Transportation",
        description: "Taking public transit just twice a week can reduce your carbon footprint by up to 1,600 pounds annually.",
        impact: "high",
        action: "Replace one car trip per week with public transit",
        link: "https://www.transit.dot.gov/regulations-and-programs/environmental-programs/transit-environmental-sustainability"
      },
      {
        title: "Bike or Walk for Short Trips",
        description: "Nearly 40% of all car trips are less than 2 miles, which are perfect for walking or biking.",
        impact: "medium",
        action: "Map out bike-friendly routes in your neighborhood",
      },
      {
        title: "Maintain Your Vehicle",
        description: "Regular maintenance improves fuel efficiency and reduces emissions from your vehicle.",
        impact: "medium",
        action: "Keep tires properly inflated and get regular tune-ups",
        link: "https://www.fueleconomy.gov/feg/maintain.jsp"
      },
      {
        title: "Practice Eco-Driving",
        description: "Smooth acceleration, maintaining steady speeds, and avoiding idling can improve fuel economy by up to 20%.",
        impact: "medium",
        action: "Take an eco-driving course or use an app that monitors driving habits",
      },
      {
        title: "Carpool or Rideshare",
        description: "Sharing rides to work or events reduces the number of vehicles on the road and splits fuel costs.",
        impact: "high",
        action: "Set up a carpool with colleagues or neighbors",
      }
    ]
  },
  {
    id: "home",
    name: "Home",
    icon: Home,
    color: "text-orange-500",
    description: "Create a more sustainable living environment",
    tips: [
      {
        title: "Improve Insulation",
        description: "Proper insulation can reduce heating and cooling costs by up to 20% while improving comfort.",
        impact: "high",
        action: "Seal air leaks around windows, doors and outlets",
        link: "https://www.energy.gov/energysaver/weatherize/insulation"
      },
      {
        title: "Indoor Plants",
        description: "Houseplants naturally filter air pollutants and add oxygen to your home environment.",
        impact: "low",
        action: "Add 3-5 air-purifying plants to your living space",
      },
      {
        title: "Natural Cleaning Products",
        description: "Make your own cleaning products using vinegar, baking soda, and essential oils to reduce toxic chemicals.",
        impact: "medium",
        action: "Replace 3 conventional cleaners with natural alternatives",
        link: "https://www.epa.gov/saferchoice"
      },
      {
        title: "Install Smart Home Technology",
        description: "Smart thermostats, plugs, and lighting systems can optimize energy use based on your habits.",
        impact: "high",
        action: "Install a smart thermostat or lighting system",
      },
      {
        title: "Use Sustainable Materials",
        description: "Choose sustainable, non-toxic materials for home renovations and furniture.",
        impact: "medium",
        action: "Research eco-friendly options before your next home project",
      }
    ]
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: Leaf,
    color: "text-green-600",
    description: "Everyday choices for a more sustainable life",
    tips: [
      {
        title: "Eat More Plant-Based Meals",
        description: "Reducing meat consumption, especially beef, can significantly lower your carbon footprint.",
        impact: "high",
        action: "Implement 'Meatless Monday' in your weekly menu",
        link: "https://www.meatlessmonday.com/"
      },
      {
        title: "Buy Local and Seasonal Food",
        description: "Food that travels shorter distances requires less transportation and often uses less packaging.",
        impact: "medium",
        action: "Visit a local farmers' market weekly",
      },
      {
        title: "Reduce Food Waste",
        description: "Plan meals, store food properly, and use leftovers to minimize the 30-40% of food that gets wasted.",
        impact: "high",
        action: "Start meal planning and keep a food waste journal",
        link: "https://www.epa.gov/recycle/reducing-wasted-food-home"
      },
      {
        title: "Choose Quality Over Quantity",
        description: "Invest in durable, high-quality items that will last longer rather than cheap, disposable alternatives.",
        impact: "medium",
        action: "Research product durability before your next purchase",
      },
      {
        title: "Start a Garden",
        description: "Growing your own vegetables and herbs reduces packaging and transportation emissions.",
        impact: "medium",
        action: "Plant an herb garden or a few vegetable plants",
        link: "https://www.almanac.com/vegetable-gardening-for-beginners"
      }
    ]
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingBag,
    color: "text-pink-500", 
    description: "Make conscious consumer choices",
    tips: [
      {
        title: "Ethical Clothing",
        description: "Support brands that use sustainable materials and ethical manufacturing practices.",
        impact: "medium",
        action: "Research and shop from 3 sustainable clothing brands",
        link: "https://goodonyou.eco/"
      },
      {
        title: "Second-hand Shopping",
        description: "Buying used items extends their life cycle and reduces demand for new production.",
        impact: "high",
        action: "Visit thrift stores or online marketplaces before buying new",
      },
      {
        title: "Choose Minimal Packaging",
        description: "Select products with less packaging or packaging made from recycled or biodegradable materials.",
        impact: "medium",
        action: "Shop at stores that allow reusable containers",
      },
      {
        title: "Research Companies",
        description: "Support businesses with strong environmental policies and sustainable practices.",
        impact: "medium",
        action: "Check sustainability ratings before making major purchases",
        link: "https://www.bthechange.com/certification/"
      },
      {
        title: "Reusable Gift Wrap",
        description: "Use fabric, scarves, or reusable bags instead of disposable wrapping paper for gifts.",
        impact: "low", 
        action: "Create a collection of reusable gift wrapping materials",
      }
    ]
  },
  {
    id: "community",
    name: "Community",
    icon: Globe,
    color: "text-blue-600",
    description: "Make an impact beyond your household",
    tips: [
      {
        title: "Volunteer for Environmental Causes",
        description: "Join community clean-ups, tree plantings, or conservation efforts in your area.",
        impact: "high",
        action: "Participate in one environmental volunteer event per month",
        link: "https://www.volunteermatch.org/search?l=United+States&k=environment"
      },
      {
        title: "Support Environmental Policies",
        description: "Contact elected officials about environmental issues and vote for sustainable policies.",
        impact: "high",
        action: "Write to your representatives about an environmental issue",
      },
      {
        title: "Share Knowledge",
        description: "Educate friends and family about sustainable practices through conversation and example.",
        impact: "medium",
        action: "Host a sustainability workshop or discussion group",
      },
      {
        title: "Join or Start Community Gardens",
        description: "Community gardens provide local food, green space, and social connections.",
        impact: "medium",
        action: "Join a community garden or start one in your neighborhood",
        link: "https://www.communitygarden.org/resources"
      },
      {
        title: "Support Environmental Organizations",
        description: "Donate to or become a member of organizations working on environmental protection.",
        impact: "medium",
        action: "Set up a monthly donation to an environmental organization",
      }
    ]
  }
];

export function EcoTips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("energy");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredTips = searchQuery
    ? tipCategories.flatMap(category => 
        category.tips.filter(tip => 
          tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          tip.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(tip => ({ ...tip, category: category.id }))
      )
    : [];

  const selectedCategoryData = tipCategories.find(cat => cat.id === selectedCategory);

  const toggleFavorite = (tipTitle: string) => {
    if (favorites.includes(tipTitle)) {
      setFavorites(favorites.filter(title => title !== tipTitle));
    } else {
      setFavorites([...favorites, tipTitle]);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  return (
    <Card className="glass-card animate-fade-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Leaf className="h-5 w-5 text-primary" />
          Sustainability Guide
        </CardTitle>
        <CardDescription>
          Discover practical tips and actions to live more sustainably and reduce your environmental impact.
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for sustainable tips..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      
      {searchQuery ? (
        <CardContent className="pb-6">
          <h3 className="font-medium mb-3">Search Results ({filteredTips.length})</h3>
          <ScrollArea className="h-[400px] pr-4">
            {filteredTips.length > 0 ? (
              <div className="space-y-4">
                {filteredTips.map((tip, i) => {
                  const category = tipCategories.find(cat => cat.id === tip.category);
                  const CategoryIcon = category?.icon || Leaf;
                  
                  return (
                    <Card key={i} className="p-4 bg-background/50 hover:bg-background/70 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-full", category?.color || "text-primary", "bg-primary/10")}>
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{tip.title}</h4>
                            <Badge variant={tip.impact === "high" ? "default" : tip.impact === "medium" ? "secondary" : "outline"}>
                              {tip.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                          {tip.action && (
                            <div className="mt-2 text-sm font-medium">
                              Try this: {tip.action}
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-muted-foreground">{category?.name}</span>
                            <div className="flex gap-2">
                              {tip.link && (
                                <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                                  <a href={tip.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Learn More
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-3"
                                onClick={() => toggleFavorite(tip.title)}
                              >
                                {favorites.includes(tip.title) ? "★" : "☆"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No tips found for "{searchQuery}". Try a different search term.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      ) : (
        <CardContent className="px-0 pb-0">
          <Tabs defaultValue={selectedCategory} value={selectedCategory} onValueChange={handleCategorySelect}>
            <ScrollArea className="pb-2">
              <TabsList className="mx-6 flex flex-nowrap overflow-x-auto justify-start w-auto h-auto pb-0">
                {tipCategories.map(category => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </ScrollArea>
            
            {tipCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="px-6 pb-6 pt-2">
                <div className="mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <category.icon className={cn("h-5 w-5", category.color)} />
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    {category.tips.map((tip, i) => (
                      <Card key={i} className="p-4 bg-background/50 hover:bg-background/70 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{tip.title}</h4>
                          <Badge variant={tip.impact === "high" ? "default" : tip.impact === "medium" ? "secondary" : "outline"}>
                            {tip.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                        {tip.action && (
                          <div className="mt-2 text-sm font-medium">
                            Try this: {tip.action}
                          </div>
                        )}
                        <div className="flex justify-end items-center mt-3 gap-2">
                          {tip.link && (
                            <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                              <a href={tip.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Learn More
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-3"
                            onClick={() => toggleFavorite(tip.title)}
                          >
                            {favorites.includes(tip.title) ? "★" : "☆"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          {favorites.length} tips saved to favorites
        </div>
        <Button variant="outline" size="sm">
          <Leaf className="mr-2 h-4 w-4" />
          View All Guides
        </Button>
      </CardFooter>
    </Card>
  );
}
