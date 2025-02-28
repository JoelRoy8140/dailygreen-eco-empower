
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, CheckCircle2, Clock, FilterX, Search, Trash2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type TaskStatus = "completed" | "in-progress" | "cancelled";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: TaskStatus;
  impact: {
    co2: number;
    water: number;
  };
  tags: string[];
}

export function TaskHistory() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for initial load
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: "task-1",
          title: "Commute by Bicycle",
          description: "Used bicycle instead of car for daily commute",
          date: "2023-05-10",
          status: "completed",
          impact: { co2: 2.5, water: 0 },
          tags: ["transport", "exercise"],
        },
        {
          id: "task-2",
          title: "Plant Native Trees",
          description: "Planted 3 native trees in the community garden",
          date: "2023-05-05",
          status: "completed",
          impact: { co2: 5.0, water: 0 },
          tags: ["gardening", "community"],
        },
        {
          id: "task-3",
          title: "Reduce Water Usage",
          description: "Installed water-saving shower head",
          date: "2023-05-03",
          status: "completed",
          impact: { co2: 0, water: 15.0 },
          tags: ["home", "water"],
        },
        {
          id: "task-4",
          title: "Community Cleanup",
          description: "Participated in beach cleanup event",
          date: "2023-04-22",
          status: "completed",
          impact: { co2: 1.0, water: 0 },
          tags: ["community", "waste"],
        },
        {
          id: "task-5",
          title: "Energy Audit",
          description: "Conducting home energy audit",
          date: "2023-05-15",
          status: "in-progress",
          impact: { co2: 0, water: 0 },
          tags: ["home", "energy"],
        },
        {
          id: "task-6",
          title: "Solar Panel Research",
          description: "Research solar panel installation options",
          date: "2023-05-12",
          status: "in-progress",
          impact: { co2: 0, water: 0 },
          tags: ["energy", "research"],
        },
        {
          id: "task-7",
          title: "Compost Setup",
          description: "Setting up backyard compost system",
          date: "2023-04-18",
          status: "cancelled",
          impact: { co2: 0, water: 0 },
          tags: ["waste", "garden"],
        }
      ];

      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
      
      // Extract all unique tags
      const tags = Array.from(new Set(mockTasks.flatMap(task => task.tags)));
      setAvailableTags(tags);
      
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter tasks based on status, search query, and tags
  useEffect(() => {
    let filtered = [...tasks];
    
    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(task => 
        selectedTags.some(tag => task.tags.includes(tag))
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, selectedStatus, searchQuery, selectedTags]);

  // Calculate total impact
  const totalImpact = filteredTasks.reduce(
    (acc, task) => {
      if (task.status === "completed") {
        acc.co2 += task.impact.co2;
        acc.water += task.impact.water;
      }
      return acc;
    },
    { co2: 0, water: 0 }
  );

  // Handle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchQuery("");
    setSelectedTags([]);
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The task has been removed from your history",
    });
  };

  // Status colors for the badges
  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  // Format date to be more readable
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="animate-fade-up">
      <Card className="border-sage-200/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="mr-2 h-6 w-6 text-primary" />
              Task History
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredTasks.length} tasks
            </span>
          </CardTitle>
          <CardDescription>
            Track your sustainability journey over time
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filter controls */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <FilterX className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
            
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                <TabsTrigger value="in-progress" className="flex-1">In Progress</TabsTrigger>
                <TabsTrigger value="cancelled" className="flex-1">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-center p-2">
                <p className="text-sm text-muted-foreground">CO2 Saved</p>
                <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                  {totalImpact.co2.toFixed(1)} kg
                </p>
              </div>
              <div className="text-center p-2">
                <p className="text-sm text-muted-foreground">Water Saved</p>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {totalImpact.water.toFixed(1)} L
                </p>
              </div>
            </div>
          </div>
          
          {/* Task list */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {isLoading ? (
                // Loading skeleton
                Array(3).fill(null).map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse rounded-lg h-24"/>
                ))
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="group border rounded-lg p-4 transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <Badge className={statusColors[task.status]}>
                        {task.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap justify-between items-end">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(task.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="text-xs bg-muted px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Impact details (only show if there is an impact) */}
                    {task.status === "completed" && (task.impact.co2 > 0 || task.impact.water > 0) && (
                      <div className="mt-2 flex gap-3">
                        {task.impact.co2 > 0 && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {task.impact.co2} kg CO2 saved
                          </span>
                        )}
                        {task.impact.water > 0 && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {task.impact.water} L water saved
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks found matching your filters</p>
                  <Button 
                    variant="link" 
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t flex justify-between">
          <Button 
            variant="outline"
            className="hover-scale"
            onClick={() => {
              toast({
                title: "Export Successful",
                description: "Your task history has been exported to CSV",
              });
            }}
          >
            Export History
          </Button>
          
          <Button
            className="hover-scale"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "The task history insights feature will be available soon!",
              });
            }}
          >
            View Insights
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
