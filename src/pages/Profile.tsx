
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  Trophy,
  Bell,
  LogOut,
  Camera,
  Edit,
  MessageSquare,
  LogIn,
} from "lucide-react";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('feedback')
        .insert([{ content: feedback }]);

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-700 mx-auto"></div>
          <p className="mt-4 text-sage-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <Card className="p-8">
          <User className="h-16 w-16 text-sage-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-sage-600 mb-6">
            Please sign in to view and manage your profile.
          </p>
          <Button asChild>
            <Link to="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-sage-900">Profile</h1>
        <p className="text-sage-600">Manage your account and view your impact</p>
      </header>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <aside className="space-y-6">
          <Card className="p-6 text-center glass-card">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-sage-100 mx-auto mb-4 relative overflow-hidden">
                <img
                  src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <button className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-1 text-xs flex items-center justify-center gap-1">
                  <Camera className="w-3 h-3" />
                  Change
                </button>
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="bg-sage-100 text-sage-600 rounded-full p-1">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-1">
              {user.user_metadata?.name || user.email || "User"}
            </h2>
            <p className="text-sm text-sage-600 mb-4">
              {user.email}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-sage-600" />
              Achievements
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Daily Streak</span>
                  <span className="font-medium">7 days</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasks Completed</span>
                  <span className="font-medium">24/100</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CO₂ Saved</span>
                  <span className="font-medium">45kg</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-sage-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Display Name
                </label>
                <Input defaultValue={user.user_metadata?.name || ""} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Email Address
                </label>
                <Input defaultValue={user.email || ""} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input defaultValue="San Francisco, CA" />
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-sage-600" />
              Preferences
            </h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => supabase.auth.signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sage-600" />
              Send Feedback
            </h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, suggestions, or report issues..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleFeedbackSubmit} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
