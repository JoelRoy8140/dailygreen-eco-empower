
import { useState, useEffect } from "react";
import { BookOpen, Search, Filter, BookmarkPlus, BookmarkCheck, ArrowRight, Check, Clock, Star, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EcoTips } from "@/components/EcoTips";
import { GuidesContent } from "@/components/GuidesContent";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Guides() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("featured");
  
  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Sustainability Guides</h1>
        <p className="text-muted-foreground">
          Explore comprehensive guides to help you live more sustainably.
        </p>
      </div>

      <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="all">All Guides</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="tips">Quick Tips</TabsTrigger>
          </TabsList>
          
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search guides..."
                className="w-full pl-8 sm:w-[250px]"
              />
            </div>
          </div>
        </div>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GuidesContent activeFilter="featured" />
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GuidesContent activeFilter="all" />
          </div>
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-4">
          {user ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GuidesContent activeFilter="bookmarked" />
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Sign in to save guides</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account to bookmark your favorite guides and track your progress.
                </p>
                <Button asChild>
                  <a href="/auth">Sign In</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <EcoTips />
        </TabsContent>
      </Tabs>
    </div>
  );
}
