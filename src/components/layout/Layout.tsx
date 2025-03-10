import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";

interface LayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
  activeNavItem?: string;
}

const Layout = ({
  children,
  showRightSidebar = false,
  activeNavItem = "news-feed",
}: LayoutProps) => {
  const { profile } = useAuth();
  const [activeItem, setActiveItem] = useState(activeNavItem);

  const handleNavigate = (item: string) => {
    setActiveItem(item);
  };

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
  };

  const userName = profile?.full_name || "Student User";
  const userAvatar =
    profile?.avatar_url ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=student";
  const userDepartment = profile?.department || "Computer Science";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar
        userName={userName}
        userAvatar={userAvatar}
        onSearch={handleSearch}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeItem={activeItem}
          onNavigate={handleNavigate}
          userProfile={{
            name: userName,
            avatar: userAvatar,
            department: userDepartment,
          }}
        />

        <main className="flex-1 overflow-y-auto">{children}</main>

        {showRightSidebar && <RightSidebar />}
      </div>
    </div>
  );
};

export default Layout;
