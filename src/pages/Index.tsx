import { useState, useEffect } from "react";
import { DailyChallenge } from "@/components/DailyChallenge";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { EcoTips } from "@/components/EcoTips";
import { TaskHistory } from "@/components/TaskHistory";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Zap, Droplet, Leaf, Award, Clock, Calendar, TrendingUp, LineChart, Users, Globe, CheckCircle2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  // User stats
  const [streakCount, setStreakCount] = useState(7);
  const [userRank, setUserRank] = useState(124);
  const [totalUsers, setTotalUsers] = useState(2567);
  
  // Weekly progress
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [tasksCompleted, setTasksCompleted] = useState(3);
  
  // Favorites and achievements
  const [favoriteAchievements, setFavoriteAchievements] = useState<number[]>([1, 3]);
  const [upcomingEventsInterest, setUpcomingEventsInterest] = useState<number[]>([]);

  // UI animations
  const [animate, setAnimate] = useState(false);
  
  // Active Tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Trigger animations on load
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Simulate loading progress values with animation
  useEffect(() => {
    const timer = setTimeout(() => setWeeklyProgress(tasksCompleted), 800);
    return () => clearTimeout(timer);
  }, [tasksCompleted]);

  // Complete a task
  const handleCompleteTask = () => {
    if (tasksCompleted < weeklyGoal) {
      setTasksCompleted(prev => prev + 1);
      
      toast({
        title: "Task Completed!",
        description: "Great job! You've made progress toward your weekly goal.",
      });
      
      // Randomly increase some stats
      updateWeeklyStats();
    }
  };

  // Update weekly stats when a task is completed
  const updateWeeklyStats = () => {
    setWeeklyStats(prev => 
      prev.map(stat => ({
        ...stat,
        value: incrementStatValue(stat.value),
        change: incrementStatChange(stat.change)
      }))
    );
  };

  // Helper to increment stat values
  const incrementStatValue = (value: string) => {
    const [num, unit] = value.split(' ');
    const newValue = (parseFloat(num) + (Math.random() * 2)).toFixed(1);
    return `${newValue} ${unit}`;
  };

  // Helper to increment stat changes
  const incrementStatChange = (change: string) => {
    const num = parseFloat(change.replace('+', ''));
    const newValue = (num + (Math.random() * 0.5)).toFixed(1);
    return `+${newValue}`;
  };

  // Toggle favorite achievement
  const toggleFavoriteAchievement = (id: number) => {
    if (favoriteAchievements.includes(id)) {
      setFavoriteAchievements(favoriteAchievements.filter(item => item !== id));
      toast({
        title: "Removed from favorites",
        description: "Achievement removed from your favorites",
      });
    } else {
      setFavoriteAchievements([...favoriteAchievements, id]);
      toast({
        title: "Added to favorites",
        description: "Achievement added to your favorites",
      });
    }
  };

  // Toggle interest in upcoming event
  const toggleEventInterest = (id: number) => {
    if (upcomingEventsInterest.includes(id)) {
      setUpcomingEventsInterest(upcomingEventsInterest.filter(item => item !== id));
      toast({
        title: "Interest removed",
        description: "You're no longer marked as interested in this event",
      });
    } else {
      setUpcomingEventsInterest([...upcomingEventsInterest, id]);
      toast({
        title: "Interest added",
        description: "You're now marked as interested in this event",
      });
    }
  };

  // Sample data for recent achievements
  const [recentAchievements, setRecentAchievements] = useState([
    { id: 1, title: "Sustainability Week", description: "Completed 5 eco-friendly tasks in a week", date: "2 days ago", icon: <Award className="h-8 w-8 text-amber-500" /> },
    { id: 2, title: "Water Saver", description: "Reduced water consumption by 15%", date: "5 days ago", icon: <Droplet className="h-8 w-8 text-blue-500" /> },
    { id: 3, title: "Energy Champion", description: "Saved 20kWh through energy-efficient habits", date: "1 week ago", icon: <Zap className="h-8 w-8 text-yellow-500" /> },
    { id: 4, title: "Tree Planter", description: "Planted your first tree", date: "2 weeks ago", icon: <Leaf className="h-8 w-8 text-green-500" /> },
  ]);

  // Sample data for upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Earth Day Cleanup", description: "Join the community cleanup event", date: "April 22", location: "City Park" },
    { id: 2, title: "Sustainable Cooking Workshop", description: "Learn to cook with seasonal ingredients", date: "Next Friday", location: "Community Center" },
    { id: 3, title: "Solar Panel Information Session", description: "Learn about home solar installation", date: "May 5", location: "Virtual Event" },
  ]);

  // Sample data for community leaderboard
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: "GreenWarrior", points: 1250, tasks: 45, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "EcoChampion", points: 1180, tasks: 41, avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "EarthDefender", points: 1050, tasks: 38, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "PlanetProtector", points: 980, tasks: 35, avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "SustainableHero", points: 920, tasks: 33, avatar: "https://i.pravatar.cc/150?img=5" },
  ]);

  // Weekly eco-impact stats
  const [weeklyStats, setWeeklyStats] = useState([
    { name: "CO2 Saved", value: "12.4 kg", change: "+2.3", color: "text-green-500" },
    { name: "Water Saved", value: "85 L", change: "+15", color: "text-blue-500" },
    { name: "Energy Reduced", value: "8.2 kWh", change: "+1.4", color: "text-yellow-500" },
    { name: "Waste Diverted", value: "3.1 kg", change: "+0.5", color: "text-purple-500" },
  ]);

  // Show active challenge completion
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  
  // Handle challenge completion
  const handleChallengeComplete = () => {
    setChallengeCompleted(true);
    handleCompleteTask(); // Also counts as a weekly task
    
    // Add a new achievement if we reach 5 tasks
    if (tasksCompleted + 1 >= 5) {
      const newAchievement = {
        id: recentAchievements.length + 1,
        title: "Weekly Goal Achiever",
        description: "Completed all 5 weekly eco-challenges",
        date: "Just now",
        icon: <Award className="h-8 w-8 text-green-500" />
      };
      
      setRecentAchievements([newAchievement, ...recentAchievements]);
      
      toast({
        title: "New Achievement Unlocked!",
        description: "Weekly Goal Achiever - You've completed your weekly goal!",
      });
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden">
        {/* Updated background overlay with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50/95 to-sage-200/95 dark:from-sage-900 dark:to-earth-900 backdrop-blur-[2px]"></div>
        {/* New background image with better contrast and visibility */}
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 dark:opacity-30"
        />
      </div>

      <header className={`text-center mb-10 space-y-4 pt-8 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-sage-900 dark:text-sage-50">
            DailyGreen
          </h1>
          <Sparkles className="absolute -top-6 -right-8 h-6 w-6 text-amber-500 animate-pulse" />
        </div>
        <p className="text-lg text-sage-600 dark:text-sage-300 max-w-2xl mx-auto">
          Small actions, big impact. Join our community in making sustainable
          choices every day.
        </p>
        {user && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-1 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {streakCount} Day Streak
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-1 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
              <Users className="h-3.5 w-3.5 mr-1" />
              Rank #{userRank} of {totalUsers}
            </Badge>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {user && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-6"
          >
            <div className="flex justify-center mb-4">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Task History
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dashboard" className="space-y-8">
              <section className={`mb-12 transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="grid gap-6 md:grid-cols-4">
                  <Card className="col-span-3 glass-card border-sage-200/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Weekly Progress
                      </CardTitle>
                      <CardDescription>
                        Complete eco-challenges to reach your weekly goal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-3xl font-bold">{tasksCompleted}</span>
                            <span className="text-muted-foreground text-lg">/{weeklyGoal}</span>
                            <p className="text-sm text-muted-foreground">tasks completed this week</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-primary">{Math.round((tasksCompleted / weeklyGoal) * 100)}%</span>
                            <p className="text-xs text-muted-foreground">toward weekly goal</p>
                          </div>
                        </div>
                        <Progress value={(tasksCompleted / weeklyGoal) * 100} className="h-2" />
                        <div className="grid grid-cols-7 gap-1 mt-4">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-10 rounded-md flex items-center justify-center transition-all duration-300 ${
                                i < tasksCompleted 
                                  ? 'bg-primary/20 border border-primary/30' 
                                  : 'bg-background/50 border border-border'
                              }`}
                            >
                              {i < tasksCompleted && <CheckCircle2 className="h-5 w-5 text-primary animate-scale-in" />}
                            </div>
                          ))}
                        </div>
                        
                        {tasksCompleted < weeklyGoal && (
                          <Button 
                            onClick={handleCompleteTask}
                            variant="outline" 
                            className="w-full mt-2 hover-scale"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Log Completed Task
                          </Button>
                        )}
                        
                        {tasksCompleted >= weeklyGoal && (
                          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-3 rounded-md text-center mt-2 animate-pulse">
                            <CheckCircle2 className="h-5 w-5 mx-auto mb-1" />
                            Weekly goal achieved! Great job!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-sage-200/20 shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Stats
                      </CardTitle>
                      <CardDescription>
                        Weekly eco-impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {weeklyStats.map((stat, i) => (
                          <div key={i} className="flex justify-between items-center p-2 hover:bg-sage-50/50 dark:hover:bg-sage-800/20 rounded-md transition-colors">
                            <span className="text-sm text-muted-foreground">{stat.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{stat.value}</span>
                              <span className={`text-xs ${stat.color}`}>
                                {stat.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <section className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
                    Today's Challenge
                  </h2>
                  <DailyChallenge />
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
                    Recent Achievements
                  </h2>
                  <Card className="glass-card overflow-hidden border-sage-200/20 shadow-lg hover:shadow-xl transition-shadow">
                    <ScrollArea className="h-[330px]">
                      <div className="p-2">
                        {recentAchievements.map((achievement, idx) => (
                          <div 
                            key={achievement.id} 
                            className="p-3 flex gap-4 hover:bg-background/40 rounded-lg transition-colors"
                            style={{ animationDelay: `${idx * 150}ms` }}
                          >
                            <div className="shrink-0 animate-pulse">
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{achievement.title}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full hover:scale-110 transition-transform"
                              onClick={() => toggleFavoriteAchievement(achievement.id)}
                            >
                              {favoriteAchievements.includes(achievement.id) ? (
                                <span className="text-amber-500">★</span>
                              ) : (
                                <span className="text-muted-foreground">☆</span>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <CardFooter className="border-t px-4 py-3 bg-card/50">
                      <Button variant="ghost" size="sm" className="w-full hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
                        View All Achievements
                      </Button>
                    </CardFooter>
                  </Card>
                </section>
              </div>

              <section className={`mt-16 transition-all duration-700 delay-300 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
                  Your Impact
                </h2>
                <ImpactMetrics />
              </section>

              <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16 transition-all duration-700 delay-400 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <section className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Events
                  </h2>
                  <Card className="glass-card border-sage-200/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {upcomingEvents.map((event, idx) => (
                          <div 
                            key={event.id} 
                            className="p-4 hover:bg-background/40 transition-colors" 
                            style={{ animationDelay: `${idx * 150}ms` }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Globe className="h-3.5 w-3.5 text-primary" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant={upcomingEventsInterest.includes(event.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleEventInterest(event.id)}
                                className={`mt-1 transition-all duration-300 ${upcomingEventsInterest.includes(event.id) ? 'animate-pulse' : ''}`}
                              >
                                {upcomingEventsInterest.includes(event.id) ? "Interested" : "Mark Interest"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-3">
                      <Button variant="ghost" size="sm" className="w-full hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
                        View All Events
                      </Button>
                    </CardFooter>
                  </Card>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Community Leaders
                  </h2>
                  <Card className="glass-card border-sage-200/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {leaderboard.map((user, index) => (
                          <div 
                            key={user.id} 
                            className="p-3 flex items-center gap-3 hover:bg-background/40 transition-colors"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-medium text-sm">
                              {index + 1}
                            </div>
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{user.name}</h3>
                              <p className="text-xs text-muted-foreground">{user.tasks} tasks</p>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">{user.points}</span>
                              <p className="text-xs text-muted-foreground">points</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors"
                        onClick={() => {
                          toast({
                            title: "Leaderboard",
                            description: "Full leaderboard will be available soon!",
                          });
                        }}
                      >
                        View Leaderboard
                      </Button>
                    </CardFooter>
                  </Card>
                </section>
              </div>

              <section className={`mt-16 transition-all duration-700 delay-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
                  Sustainability Guide
                </h2>
                <EcoTips />
              </section>
            </TabsContent>
            
            <TabsContent value="history" className="animate-fade-up">
              <TaskHistory />
            </TabsContent>
          </Tabs>
        )}

        {!user && (
          <div>
            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-8 text-sage-800 dark:text-sage-200">
                Join the DailyGreen Community
              </h2>
              <p className="text-lg text-sage-600 dark:text-sage-300 max-w-2xl mx-auto mb-12">
                Track your sustainability efforts, connect with like-minded individuals,
                and make a real impact on the planet. Sign up or log in to get started!
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white hover-scale">
                  Sign Up
                </Button>
                <Button variant="outline" size="lg" className="hover-scale">
                  Log In
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
