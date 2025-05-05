
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

// Sample events data
const eventsMock = [
  {
    id: 1,
    title: "Community Garden Cleanup",
    description: "Join us for a day of cleaning and planting in the community garden. All tools and materials will be provided.",
    location: "Central Community Garden",
    date: new Date("2025-05-15T10:00:00"),
    duration: "3 hours",
    attendees: 12,
    capacity: 20,
    type: "in-person",
    tags: ["gardening", "cleanup"],
  },
  {
    id: 2,
    title: "Online Workshop: Sustainable Home Solutions",
    description: "Learn practical tips and tricks to make your home more environmentally friendly and reduce your carbon footprint.",
    location: "Zoom Meeting",
    date: new Date("2025-05-20T18:30:00"),
    duration: "1.5 hours",
    attendees: 45,
    capacity: 100,
    type: "online",
    tags: ["workshop", "home", "energy"],
  },
  {
    id: 3,
    title: "Beach Cleanup Initiative",
    description: "Help clean our local beaches and protect marine wildlife. Gloves, bags, and refreshments will be provided.",
    location: "Sunrise Beach",
    date: new Date("2025-05-22T09:00:00"),
    duration: "4 hours",
    attendees: 28,
    capacity: 50,
    type: "in-person",
    tags: ["cleanup", "ocean"],
  },
  {
    id: 4,
    title: "Tree Planting Day",
    description: "Be part of our mission to make the city greener! We'll be planting native tree species in the park.",
    location: "Riverside Park",
    date: new Date("2025-05-25T08:30:00"),
    duration: "5 hours",
    attendees: 32,
    capacity: 40,
    type: "in-person",
    tags: ["planting", "trees"],
  },
];

export function CommunityEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState(eventsMock);
  const [filter, setFilter] = useState("all"); // all, in-person, online
  
  const handleRSVP = (eventId: number) => {
    setEvents(
      events.map(event =>
        event.id === eventId && event.attendees < event.capacity
          ? { ...event, attendees: event.attendees + 1 }
          : event
      )
    );
    
    toast({
      title: "RSVP Confirmed",
      description: "You've successfully signed up for this event!",
    });
  };
  
  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.type === filter);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Upcoming Events</h3>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Events
          </Button>
          <Button
            variant={filter === "in-person" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("in-person")}
          >
            In Person
          </Button>
          <Button
            variant={filter === "online" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("online")}
          >
            Online
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 ${event.type === 'in-person' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{event.title}</h4>
                  <div className="flex gap-1 mt-1">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant={event.type === 'in-person' ? 'default' : 'secondary'}>
                  {event.type === 'in-person' ? 'In Person' : 'Online'}
                </Badge>
              </div>
              
              <p className="text-sm mt-3 text-muted-foreground">{event.description}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(event.date, 'h:mm a')} • {event.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.attendees} / {event.capacity} attending</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  disabled={event.attendees >= event.capacity}
                  variant={event.attendees >= event.capacity ? "outline" : "default"}
                  onClick={() => handleRSVP(event.id)}
                >
                  {event.attendees >= event.capacity ? "Event Full" : "RSVP"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
