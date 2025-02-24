
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Settings,
  Trophy,
  Bell,
  LogOut,
  Camera,
  Edit,
} from "lucide-react";

export default function Profile() {
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
                  src="/placeholder.svg"
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
            <h2 className="text-xl font-semibold mb-1">Guest User</h2>
            <p className="text-sm text-sage-600 mb-4">San Francisco, CA</p>
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
                <Input defaultValue="Guest User" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Email Address
                </label>
                <Input defaultValue="guest@example.com" />
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
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
