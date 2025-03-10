import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPosts } from "@/lib/api/posts";
import { PostWithDetails } from "@/lib/types";
import PostCard from "@/components/feed/PostCard";
import { BookOpen, Users, Bookmark, Settings, Calendar } from "lucide-react";

interface ProfileViewProps {
  userId?: string; // If not provided, show the current user's profile
  onEditProfile?: () => void;
}

const ProfileView = ({ userId, onEditProfile }: ProfileViewProps) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isCurrentUser = !userId || userId === user?.id;
  const displayProfile = isCurrentUser ? profile : null; // In a real app, you'd fetch the other user's profile

  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await getPosts();
        if (data) {
          // Filter posts by the current user or the specified user
          const filteredPosts = data.filter(
            (post) => post.author_id === (userId || user?.id),
          );
          setUserPosts(filteredPosts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user, userId]);

  if (!displayProfile) return null;

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={displayProfile.avatar_url || ""} />
              <AvatarFallback>
                {displayProfile.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{displayProfile.full_name}</h1>
              <p className="text-muted-foreground">
                @{displayProfile.username}
              </p>
              {displayProfile.department && (
                <p className="mt-1 text-sm font-medium">
                  {displayProfile.department}
                </p>
              )}
              {displayProfile.bio && (
                <p className="mt-4 text-sm">{displayProfile.bio}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="font-bold">{userPosts.length}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Study Groups</p>
                </div>
              </div>
            </div>
            {isCurrentUser && (
              <div className="md:self-start">
                <Button onClick={onEditProfile}>Edit Profile</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[400px] mb-6">
          <TabsTrigger value="posts" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            <span className="hidden md:inline">Saved</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Events</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-64 bg-gray-200 animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  author={{
                    name: post.author_name,
                    avatar: post.author_avatar,
                    department: post.author_department,
                  }}
                  timestamp={new Date(post.created_at).toLocaleDateString()}
                  title={post.title}
                  content={post.content}
                  attachments={post.attachments}
                  tags={post.tags}
                  likes={post.like_count}
                  comments={post.comment_count}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <p>No posts yet</p>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader className="text-center">
              <p>Saved posts will appear here</p>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardHeader className="text-center">
              <p>Your study groups will appear here</p>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader className="text-center">
              <p>Your events will appear here</p>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileView;
