
import { useState, useEffect } from "react";
import { DailyChallenge } from "@/components/DailyChallenge";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { EcoTips } from "@/components/EcoTips";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Zap, Droplet, Leaf, Award, Clock, Calendar, TrendingUp, LineChart, Users, Globe, CheckCircle2 } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [streakCount, setStreakCount] = useState(7);
  const [userRank, setUserRank] = useState(124);
  const [totalUsers, setTotalUsers] = useState(2567);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [tasksCompleted, setTasksCompleted] = useState(3);

  // Simulate loading progress values with animation
  useEffect(() => {
    const timer = setTimeout(() => setWeeklyProgress(tasksCompleted), 800);
    return () => clearTimeout(timer);
  }, [tasksCompleted]);

  // Sample data for recent achievements
  const recentAchievements = [
    { id: 1, title: "Sustainability Week", description: "Completed 5 eco-friendly tasks in a week", date: "2 days ago", icon: <Award className="h-8 w-8 text-amber-500" /> },
    { id: 2, title: "Water Saver", description: "Reduced water consumption by 15%", date: "5 days ago", icon: <Droplet className="h-8 w-8 text-blue-500" /> },
    { id: 3, title: "Energy Champion", description: "Saved 20kWh through energy-efficient habits", date: "1 week ago", icon: <Zap className="h-8 w-8 text-yellow-500" /> },
    { id: 4, title: "Tree Planter", description: "Planted your first tree", date: "2 weeks ago", icon: <Leaf className="h-8 w-8 text-green-500" /> },
  ];

  // Sample data for upcoming events
  const upcomingEvents = [
    { id: 1, title: "Earth Day Cleanup", description: "Join the community cleanup event", date: "April 22", location: "City Park" },
    { id: 2, title: "Sustainable Cooking Workshop", description: "Learn to cook with seasonal ingredients", date: "Next Friday", location: "Community Center" },
    { id: 3, title: "Solar Panel Information Session", description: "Learn about home solar installation", date: "May 5", location: "Virtual Event" },
  ];

  // Sample data for community leaderboard
  const leaderboard = [
    { id: 1, name: "GreenWarrior", points: 1250, tasks: 45, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "EcoChampion", points: 1180, tasks: 41, avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "EarthDefender", points: 1050, tasks: 38, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "PlanetProtector", points: 980, tasks: 35, avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "SustainableHero", points: 920, tasks: 33, avatar: "https://i.pravatar.cc/150?img=5" },
  ];

  // Weekly eco-impact stats
  const weeklyStats = [
    { name: "CO2 Saved", value: "12.4 kg", change: "+2.3", color: "text-green-500" },
    { name: "Water Saved", value: "85 L", change: "+15", color: "text-blue-500" },
    { name: "Energy Reduced", value: "8.2 kWh", change: "+1.4", color: "text-yellow-500" },
    { name: "Waste Diverted", value: "3.1 kg", change: "+0.5", color: "text-purple-500" },
  ];

  return (
    <>
      <header className="text-center mb-10 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-sage-900 dark:text-sage-50">
          DailyGreen
        </h1>
        <p className="text-lg text-sage-600 dark:text-sage-300 max-w-2xl mx-auto">
          Small actions, big impact. Join our community in making sustainable
          choices every day.
        </p>
        {user && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {streakCount} Day Streak
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-1">
              <Users className="h-3.5 w-3.5 mr-1" />
              Rank #{userRank} of {totalUsers}
            </Badge>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {user && (
          <section className="mb-12">
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="col-span-3 glass-card">
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
                          className={`h-10 rounded-md flex items-center justify-center ${
                            i < tasksCompleted 
                              ? 'bg-primary/20 border border-primary/30' 
                              : 'bg-background/50 border border-border'
                          }`}
                        >
                          {i < tasksCompleted && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
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
                      <div key={i} className="flex justify-between items-center">
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
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
              Today's Challenge
            </h2>
            <DailyChallenge />
          </section>

          {user && (
            <section>
              <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
                Recent Achievements
              </h2>
              <Card className="glass-card overflow-hidden">
                <ScrollArea className="h-[330px]">
                  <div className="p-2">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="p-3 flex gap-4 hover:bg-background/40 rounded-lg transition-colors">
                        <div className="shrink-0">
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <CardFooter className="border-t px-4 py-3 bg-card/50">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>
            </section>
          )}
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
            Your Impact
          </h2>
          <ImpactMetrics />
        </section>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
          {user && (
            <>
              <section className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </h2>
                <Card className="glass-card">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="p-4 hover:bg-background/40 transition-colors">
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
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-3">
                    <Button variant="ghost" size="sm" className="w-full">
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
                <Card className="glass-card">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {leaderboard.map((user, index) => (
                        <div key={user.id} className="p-3 flex items-center gap-3 hover:bg-background/40 transition-colors">
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
                    <Button variant="ghost" size="sm" className="w-full">
                      View Leaderboard
                    </Button>
                  </CardFooter>
                </Card>
              </section>
            </>
          )}
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-6 text-sage-800 dark:text-sage-200">
            Sustainability Guide
          </h2>
          <EcoTips />
        </section>
      </div>
    </>
  );
};

export default Index;
