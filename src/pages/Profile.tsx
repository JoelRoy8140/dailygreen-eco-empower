
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";
import PasswordChangeModal from "@/components/PasswordChangeModal";
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
  Save,
  X,
  Moon,
  Sun,
  Key,
  Shield,
  RefreshCw,
  AlertTriangle,
  Trash2,
} from "lucide-react";

export default function Profile() {
  const { user, isLoading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    location: "",
    avatarUrl: "",
    emailNotifications: true,
    pushNotifications: true,
    dailyDigest: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("profile"); // profile, notifications, account
  const fileInputRef = useRef(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Fetch profile data
  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfileData({
            displayName: data.display_name || "",
            location: "", // Add location to the profile table if needed
            avatarUrl: data.avatar_url || "",
            emailNotifications: data.email_notifications,
            pushNotifications: data.push_notifications,
            dailyDigest: data.daily_digest,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    }
    
    getProfile();
  }, [user]);

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

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setProfileData(prev => ({
        ...prev,
        avatarUrl: data.publicUrl
      }));
      
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const saveProfile = async () => {
    try {
      setIsSubmitting(true);
      
      // Update the Supabase profile
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.displayName,
          email_notifications: profileData.emailNotifications,
          push_notifications: profileData.pushNotifications,
          daily_digest: profileData.dailyDigest,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) throw error;
        
        await signOut();
        toast.success("Your account has been deleted");
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account. Please try again.");
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <Card className="p-8">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
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
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and view your impact</p>
      </header>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <aside className="space-y-6">
          <Card className="p-6 text-center glass-card">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-4 relative overflow-hidden">
                <img
                  src={profileData.avatarUrl || user.user_metadata?.avatar_url || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={triggerFileInput}
                  className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-1 text-xs flex items-center justify-center gap-1"
                  disabled={uploading}
                >
                  <Camera className="w-3 h-3" />
                  {uploading ? "Uploading..." : "Change"}
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={uploadAvatar}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="bg-secondary text-secondary-foreground rounded-full p-1">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-1">
              {profileData.displayName || user.user_metadata?.name || user.email?.split('@')[0] || "User"}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {user.email}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                setIsEditing(true);
                setActiveSection("profile");
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-muted-foreground" />
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

          <Card className="p-4 glass-card">
            <nav className="space-y-1">
              <Button 
                variant={activeSection === "profile" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveSection("profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile Information
              </Button>
              <Button 
                variant={activeSection === "notifications" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveSection("notifications")}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button 
                variant={activeSection === "account" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveSection("account")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </nav>
          </Card>
        </aside>

        <div className="space-y-6">
          {activeSection === "profile" && (
            <Card className="p-6 glass-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Personal Information
                </h3>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={saveProfile}
                      disabled={isSubmitting}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Display Name
                  </label>
                  <Input 
                    name="displayName"
                    value={profileData.displayName} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Email Address
                  </label>
                  <Input 
                    value={user.email || ""} 
                    readOnly 
                    className="bg-muted"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Location
                  </label>
                  <Input 
                    name="location"
                    value={profileData.location} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card className="p-6 glass-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  Notification Settings
                </h3>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={saveProfile}
                      disabled={isSubmitting}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates and reminders via email</p>
                  </div>
                  <Switch 
                    name="emailNotifications"
                    checked={profileData.emailNotifications} 
                    onCheckedChange={(checked) => setProfileData(prev => ({...prev, emailNotifications: checked}))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch 
                    name="pushNotifications"
                    checked={profileData.pushNotifications} 
                    onCheckedChange={(checked) => setProfileData(prev => ({...prev, pushNotifications: checked}))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Daily Digest</h4>
                    <p className="text-sm text-muted-foreground">Receive a daily summary of your activities</p>
                  </div>
                  <Switch 
                    name="dailyDigest"
                    checked={profileData.dailyDigest} 
                    onCheckedChange={(checked) => setProfileData(prev => ({...prev, dailyDigest: checked}))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === "account" && (
            <Card className="p-6 glass-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Account Settings
                </h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Theme Preference
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Choose between light and dark mode</p>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Dark
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Manage your account security settings</p>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
                
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Sessions
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Manage your active sessions</p>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out of All Devices
                  </Button>
                </div>
                
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Permanently delete your account and all your data</p>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
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
      
      <PasswordChangeModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
