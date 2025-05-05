
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommunityEvents } from "@/components/CommunityEvents";
import { CommunityDiscussions } from "@/components/CommunityDiscussions";
import { CommunityLeaderboard } from "@/components/CommunityLeaderboard";
import { Users, CalendarDays, MessageSquare, Trophy } from "lucide-react";

export default function Community() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discussions");
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-sage-900">Community</h1>
        <p className="text-sm md:text-base text-sage-600 mt-2">
          Connect with sustainability enthusiasts and participate in events
        </p>
      </header>
      
      <Card className="border-sage-200/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Community Hub</CardTitle>
              <CardDescription>
                Share ideas and participate in green initiatives
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="discussions" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Discussions
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Events
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Leaderboard
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discussions" className="space-y-4">
              <CommunityDiscussions />
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <CommunityEvents />
            </TabsContent>
            
            <TabsContent value="leaderboard" className="space-y-4">
              <CommunityLeaderboard />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
