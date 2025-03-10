import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  User,
  Users,
  Bookmark,
  Bell,
  Settings,
  HelpCircle,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  activeItem?: string;
  onNavigate?: (item: string) => void;
  userProfile?: {
    name: string;
    avatar: string;
    department: string;
  };
}

const Sidebar = ({
  className,
  activeItem = "news-feed",
  onNavigate = () => {},
  userProfile = {
    name: "Student User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
    department: "Computer Science",
  },
}: SidebarProps) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "news-feed",
      label: "News Feed",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: <User className="h-5 w-5" />,
      path: "/profile",
    },
    {
      id: "study-groups",
      label: "Study Groups",
      icon: <Users className="h-5 w-5" />,
      path: "/study-groups",
    },
    {
      id: "saved-content",
      label: "Saved Content",
      icon: <Bookmark className="h-5 w-5" />,
      path: "/saved",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      path: "/notifications",
    },
  ];

  const educationalItems = [
    {
      id: "courses",
      label: "My Courses",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/courses",
    },
    {
      id: "events",
      label: "Academic Events",
      icon: <Calendar className="h-5 w-5" />,
      path: "/events",
    },
    {
      id: "resources",
      label: "Learning Resources",
      icon: <GraduationCap className="h-5 w-5" />,
      path: "/resources",
    },
    {
      id: "discussions",
      label: "Discussion Forums",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/discussions",
    },
  ];

  const supportItems = [
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/help",
    },
  ];

  const handleNavigation = (item: { id: string; path: string }) => {
    onNavigate(item.id);
    navigate(item.path);
  };

  const renderNavItem = (item: {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
  }): React.ReactNode => {
    const isActive = activeItem === item.id;
    return (
      <TooltipProvider key={item.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1 text-left",
                isActive ? "bg-secondary font-medium" : "text-muted-foreground",
              )}
              onClick={() => handleNavigation(item)}
            >
              <span className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </span>
              {item.id === "notifications" && (
                <Badge className="ml-auto" variant="destructive">
                  3
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div
      className={cn(
        "w-[280px] h-full bg-background border-r p-4 flex flex-col",
        className,
      )}
    >
      {/* User Profile Section */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
        <Avatar>
          <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
          <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{userProfile.name}</h3>
          <p className="text-sm text-muted-foreground">
            {userProfile.department}
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1 mb-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
          Main Navigation
        </h4>
        {navigationItems.map(renderNavItem)}
      </div>

      {/* Educational Resources */}
      <div className="space-y-1 mb-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
          Educational Resources
        </h4>
        {educationalItems.map(renderNavItem)}
      </div>

      {/* Support & Settings */}
      <div className="space-y-1 mt-auto">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
          Support & Settings
        </h4>
        {supportItems.map(renderNavItem)}
      </div>
    </div>
  );
};

export default Sidebar;
