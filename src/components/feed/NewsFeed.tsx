import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter } from "lucide-react";

interface NewsFeedProps {
  posts?: any[];
  onCreatePost?: () => void;
  onRefresh?: () => void;
  onFilter?: () => void;
  isLoading?: boolean;
}

const NewsFeed = ({
  posts = [],
  onCreatePost = () => console.log("Create post clicked"),
  onRefresh = () => console.log("Refresh feed"),
  onFilter = () => console.log("Filter feed"),
  isLoading = false,
}: NewsFeedProps) => {
  const { profile } = useAuth();
  const [visiblePosts, setVisiblePosts] = useState(posts);

  useEffect(() => {
    setVisiblePosts(posts);
  }, [posts]);

  // This would normally be handled by actual data fetching
  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-50">
      <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Knowledge Feed</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="p-4">
        <CreatePostCard
          onCreatePost={onCreatePost}
          userAvatar={
            profile?.avatar_url ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=student"
          }
          userName={profile?.full_name || "Student User"}
        />

        {isLoading ? (
          <div className="flex flex-col space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-64 bg-gray-200 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        ) : visiblePosts.length > 0 ? (
          <div className="space-y-4 mt-4">
            {visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                author={{
                  name: post.author_name,
                  avatar: post.author_avatar,
                  department: post.author_department,
                }}
                timestamp={new Date(post.created_at).toLocaleString()}
                title={post.title}
                content={post.content}
                attachments={post.attachments}
                tags={post.tags}
                likes={post.like_count}
                comments={post.comment_count}
                onLike={() => console.log(`Liked post ${post.id}`)}
                onComment={() => console.log(`Comment on post ${post.id}`)}
                onSave={() => console.log(`Saved post ${post.id}`)}
                onShare={() => console.log(`Shared post ${post.id}`)}
                onViewPost={() => console.log(`Viewing full post ${post.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center p-8 bg-white rounded-lg border">
            <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-2 text-gray-500">
              Be the first to share educational content with your peers!
            </p>
            <Button className="mt-4" onClick={onCreatePost}>
              Create a Post
            </Button>
          </div>
        )}

        {visiblePosts.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
