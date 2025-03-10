import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BookOpen,
  MessageSquare,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  BookMarked,
} from "lucide-react";

interface NavbarProps {
  userAvatar?: string;
  userName?: string;
  unreadNotifications?: number;
  unreadMessages?: number;
  onSearch?: (query: string) => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onMessagesClick?: () => void;
  onSignOut?: () => Promise<void>;
}

const Navbar = ({
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
  userName = "Student User",
  unreadNotifications = 3,
  unreadMessages = 2,
  onSearch = () => {},
  onProfileClick = () => {},
  onNotificationsClick = () => {},
  onMessagesClick = () => {},
  onSignOut = async () => {},
}: NavbarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleMessagesClick = () => {
    navigate("/discussions");
  };

  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="w-full h-16 px-4 border-b border-gray-200 flex items-center justify-between bg-white">
      {/* Logo and Brand */}
      <Link to="/" className="flex items-center">
        <BookOpen className="h-8 w-8 text-primary mr-2" />
        <span className="text-xl font-bold text-primary">EduShare</span>
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center max-w-md w-full mx-4 relative"
      >
        <Input
          type="text"
          placeholder="Search for educational content..."
          className="pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Navigation Icons */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationsClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>

        {/* Messages */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMessagesClick}
            className="relative"
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessages > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadMessages}
              </Badge>
            )}
          </Button>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 p-0 ml-2"
            >
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/saved")}>
                <BookMarked className="mr-2 h-4 w-4" />
                <span>Saved Content</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
