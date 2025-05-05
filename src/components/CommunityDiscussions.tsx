
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Heart, Reply, ArrowUp, Send } from "lucide-react";

// Sample discussion data
const discussionsMock = [
  {
    id: 1,
    user: {
      name: "Morgan Chen",
      avatar: null,
      initials: "MC",
    },
    topic: "Zero Waste Tips",
    content: "I've been trying to reduce my household waste recently. Does anyone have tips on reducing plastic packaging when grocery shopping?",
    timestamp: "2 hours ago",
    likes: 24,
    replies: 8,
    tags: ["Zero Waste", "Tips"],
  },
  {
    id: 2,
    user: {
      name: "Alex Rivera",
      avatar: null,
      initials: "AR",
    },
    topic: "Community Garden Project",
    content: "We're starting a community garden in the downtown area. Looking for volunteers and plant donations!",
    timestamp: "Yesterday",
    likes: 42,
    replies: 15,
    tags: ["Community", "Gardening"],
  },
  {
    id: 3,
    user: {
      name: "Sam Taylor",
      avatar: null,
      initials: "ST",
    },
    topic: "Renewable Energy at Home",
    content: "Just installed solar panels on my roof. Happy to share my experience and the cost savings so far.",
    timestamp: "3 days ago",
    likes: 37,
    replies: 21,
    tags: ["Renewable Energy", "Home"],
  },
];

export function CommunityDiscussions() {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState(discussionsMock);
  const [newPost, setNewPost] = useState("");
  const [postTopic, setPostTopic] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  
  const handleCreatePost = () => {
    if (!postTopic.trim() || !newPost.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both a topic and content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    const newDiscussion = {
      id: discussions.length + 1,
      user: {
        name: "You",
        avatar: null,
        initials: "YO",
      },
      topic: postTopic,
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      replies: 0,
      tags: [],
    };
    
    setDiscussions([newDiscussion, ...discussions]);
    setNewPost("");
    setPostTopic("");
    setShowNewPostForm(false);
    
    toast({
      title: "Post created",
      description: "Your discussion has been posted successfully!",
    });
  };
  
  const handleLike = (id: number) => {
    setDiscussions(
      discussions.map(discussion =>
        discussion.id === id
          ? { ...discussion, likes: discussion.likes + 1 }
          : discussion
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Community Discussions</h3>
        <Button 
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          variant={showNewPostForm ? "outline" : "default"}
        >
          {showNewPostForm ? "Cancel" : "Start Discussion"}
        </Button>
      </div>
      
      {showNewPostForm && (
        <Card className="p-4 mb-6 border border-border">
          <CardContent className="p-0 space-y-4">
            <Input 
              placeholder="Topic or Question" 
              value={postTopic}
              onChange={(e) => setPostTopic(e.target.value)}
              className="font-medium"
            />
            <Textarea 
              placeholder="Share your thoughts, questions, or ideas with the community..." 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewPostForm(false)}>Cancel</Button>
              <Button onClick={handleCreatePost}>
                <Send className="mr-2 h-4 w-4" /> Post Discussion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="p-4 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {discussion.user.avatar && (
                      <AvatarImage src={discussion.user.avatar} alt={discussion.user.name} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {discussion.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{discussion.user.name}</p>
                    <p className="text-xs text-muted-foreground">{discussion.timestamp}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {discussion.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-base">{discussion.topic}</h4>
                <p className="mt-2 text-sm">{discussion.content}</p>
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1"
                  onClick={() => handleLike(discussion.id)}
                >
                  <Heart className="h-4 w-4" /> {discussion.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                  <Reply className="h-4 w-4" /> {discussion.replies}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
