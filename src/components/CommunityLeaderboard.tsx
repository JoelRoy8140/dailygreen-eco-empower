
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Medal, Trees, Droplet } from "lucide-react";

// Sample leaderboard data
const leaderboardMock = [
  {
    id: 1,
    rank: 1,
    user: {
      name: "Emma Johnson",
      avatar: null,
      initials: "EJ",
    },
    points: 3250,
    impact: {
      trees: 35,
      water: 2500,
    },
    badges: ["Top Planter", "Water Warrior", "Community Leader"],
    level: 8,
  },
  {
    id: 2,
    rank: 2,
    user: {
      name: "Michael Liu",
      avatar: null,
      initials: "ML",
    },
    points: 2840,
    impact: {
      trees: 28,
      water: 3200,
    },
    badges: ["Recycling Expert", "Energy Saver"],
    level: 7,
  },
  {
    id: 3,
    rank: 3,
    user: {
      name: "Sofia Rodriguez",
      avatar: null,
      initials: "SR",
    },
    points: 2580,
    impact: {
      trees: 22,
      water: 4100,
    },
    badges: ["Water Warrior", "Community Leader"],
    level: 7,
  },
  {
    id: 4,
    rank: 4,
    user: {
      name: "James Walker",
      avatar: null,
      initials: "JW",
    },
    points: 2340,
    impact: {
      trees: 18,
      water: 2800,
    },
    badges: ["Energy Saver"],
    level: 6,
  },
  {
    id: 5,
    rank: 5,
    user: {
      name: "Aisha Patel",
      avatar: null,
      initials: "AP",
    },
    points: 2120,
    impact: {
      trees: 15,
      water: 3600,
    },
    badges: ["Recycling Expert"],
    level: 6,
  },
];

export function CommunityLeaderboard() {
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Top Planter":
        return <Trees className="h-3 w-3" />;
      case "Water Warrior":
        return <Droplet className="h-3 w-3" />;
      case "Community Leader":
        return <Trophy className="h-3 w-3" />;
      case "Recycling Expert":
        return <Award className="h-3 w-3" />;
      case "Energy Saver":
        return <Medal className="h-3 w-3" />;
      default:
        return <Award className="h-3 w-3" />;
    }
  };
  
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-700";
      default:
        return "text-muted-foreground";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-semibold">{rank}</span>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Impact Leaderboard</h3>
      </div>
      
      {/* Top 3 podium display */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
        {/* Second place */}
        <div className="flex flex-col items-center order-1">
          <div className="relative mb-2">
            <Trophy className="h-8 w-8 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
          </div>
          <Avatar className="h-16 w-16 border-4 border-gray-400">
            <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">{leaderboardMock[1].user.initials}</AvatarFallback>
          </Avatar>
          <p className="font-semibold mt-2 text-center">{leaderboardMock[1].user.name}</p>
          <p className="text-sm text-muted-foreground">{leaderboardMock[1].points} pts</p>
        </div>
        
        {/* First place */}
        <div className="flex flex-col items-center order-0">
          <div className="relative mb-3">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
          </div>
          <Avatar className="h-20 w-20 border-4 border-yellow-500">
            <AvatarFallback className="bg-yellow-100 text-yellow-800 text-2xl">{leaderboardMock[0].user.initials}</AvatarFallback>
          </Avatar>
          <p className="font-bold mt-2 text-lg text-center">{leaderboardMock[0].user.name}</p>
          <p className="text-sm text-muted-foreground">{leaderboardMock[0].points} pts</p>
        </div>
        
        {/* Third place */}
        <div className="flex flex-col items-center order-2">
          <div className="relative mb-2">
            <Trophy className="h-8 w-8 text-amber-700" />
            <span className="absolute -top-1 -right-1 bg-amber-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
          </div>
          <Avatar className="h-16 w-16 border-4 border-amber-700">
            <AvatarFallback className="bg-amber-100 text-amber-800 text-xl">{leaderboardMock[2].user.initials}</AvatarFallback>
          </Avatar>
          <p className="font-semibold mt-2 text-center">{leaderboardMock[2].user.name}</p>
          <p className="text-sm text-muted-foreground">{leaderboardMock[2].points} pts</p>
        </div>
      </div>
      
      {/* Full leaderboard */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left text-sm">
                <th className="p-3 w-12 text-center">Rank</th>
                <th className="p-3">User</th>
                <th className="p-3 hidden md:table-cell">Level</th>
                <th className="p-3 hidden md:table-cell">Badges</th>
                <th className="p-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardMock.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center">
                      {getRankIcon(item.rank)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {item.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{item.user.name}</span>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-0.5">
                        Level {item.level}
                      </span>
                      <Progress value={(item.level / 10) * 100} className="h-1.5 w-16" />
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.badges.slice(0, 2).map((badge, i) => (
                        <Badge key={i} variant="outline" className="flex items-center gap-1 text-xs">
                          {getBadgeIcon(badge)}
                          {badge}
                        </Badge>
                      ))}
                      {item.badges.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.badges.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {item.points.toLocaleString()} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
