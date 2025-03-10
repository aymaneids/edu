import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar } from "lucide-react";

interface StudyGroupCardProps {
  id: string;
  name: string;
  description?: string;
  subject: string;
  avatar?: string;
  memberCount: number;
  nextMeeting?: {
    date: string;
    time: string;
    topic: string;
  };
  onJoin?: (id: string) => void;
  onView?: (id: string) => void;
  isMember?: boolean;
}

const StudyGroupCard = ({
  id,
  name,
  description = "No description provided",
  subject,
  avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
  memberCount = 0,
  nextMeeting,
  onJoin = () => {},
  onView = () => {},
  isMember = false,
}: StudyGroupCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              <span>{memberCount} members</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <Badge variant="secondary" className="mb-2">
          {subject}
        </Badge>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        {nextMeeting && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md">
            <div className="flex items-center text-sm font-medium">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              <span>Next Meeting</span>
            </div>
            <div className="mt-1 text-xs">
              <p className="font-medium">{nextMeeting.topic}</p>
              <p className="text-muted-foreground">
                {nextMeeting.date} at {nextMeeting.time}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(id)}
          className="flex-1 mr-2"
        >
          View Details
        </Button>
        {!isMember ? (
          <Button size="sm" onClick={() => onJoin(id)} className="flex-1">
            Join Group
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(id)}
            className="flex-1"
          >
            Open Group
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudyGroupCard;
