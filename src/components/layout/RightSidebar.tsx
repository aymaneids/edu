import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, TrendingUp, Bell } from "lucide-react";

interface StudyGroup {
  id: string;
  name: string;
  members: number;
  subject: string;
  avatar?: string;
}

interface TrendingTopic {
  id: string;
  name: string;
  posts: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  organizer?: string;
}

interface RightSidebarProps {
  suggestedGroups?: StudyGroup[];
  trendingTopics?: TrendingTopic[];
  upcomingEvents?: Event[];
}

const RightSidebar = ({
  suggestedGroups = [
    {
      id: "1",
      name: "Advanced Algorithms",
      members: 42,
      subject: "Computer Science",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=algorithms",
    },
    {
      id: "2",
      name: "Organic Chemistry",
      members: 28,
      subject: "Chemistry",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chemistry",
    },
    {
      id: "3",
      name: "Calculus Study Group",
      members: 35,
      subject: "Mathematics",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=calculus",
    },
  ],
  trendingTopics = [
    { id: "1", name: "Machine Learning", posts: 128 },
    { id: "2", name: "Quantum Physics", posts: 87 },
    { id: "3", name: "Molecular Biology", posts: 64 },
    { id: "4", name: "Linear Algebra", posts: 52 },
    { id: "5", name: "World Literature", posts: 43 },
  ],
  upcomingEvents = [
    {
      id: "1",
      title: "AI Research Symposium",
      date: "May 15, 2023",
      time: "2:00 PM",
      organizer: "CS Department",
    },
    {
      id: "2",
      title: "Biology Lab Workshop",
      date: "May 18, 2023",
      time: "10:00 AM",
      organizer: "Biology Club",
    },
    {
      id: "3",
      title: "Math Tutoring Session",
      date: "May 20, 2023",
      time: "3:30 PM",
      organizer: "Math Society",
    },
  ],
}: RightSidebarProps) => {
  return (
    <div className="w-80 h-full p-4 border-l border-gray-200 overflow-y-auto bg-white">
      {/* Suggested Study Groups */}
      <Card className="mb-6 bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Suggested Study Groups</h3>
            <Button variant="ghost" size="sm" className="text-blue-600">
              See All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestedGroups.map((group) => (
              <div key={group.id} className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{group.name}</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{group.members} members</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Join
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="mb-6 bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Trending Topics</h3>
            <Button variant="ghost" size="sm" className="text-blue-600">
              See All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{topic.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {topic.posts} posts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Upcoming Events</h3>
            <Button variant="ghost" size="sm" className="text-blue-600">
              See All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="border-l-2 border-blue-500 pl-3 py-1"
              >
                <h4 className="font-medium text-sm">{event.title}</h4>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  <span>{event.date}</span>
                  {event.time && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{event.time}</span>
                    </>
                  )}
                </div>
                {event.organizer && (
                  <div className="text-xs text-muted-foreground mt-1">
                    By: {event.organizer}
                  </div>
                )}
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs mr-2"
                  >
                    Interested
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Remind me
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
