import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSavedPosts } from "@/lib/api/posts";
import { PostWithDetails } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/feed/PostCard";
import { Card, CardHeader } from "@/components/ui/card";

const SavedPostsPage = () => {
  const { user, profile } = useAuth();
  const [savedPosts, setSavedPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedPosts();
    }
  }, [user]);

  const fetchSavedPosts = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await getSavedPosts(user.id);
      if (error) throw error;
      if (data) setSavedPosts(data);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
  };

  return (
    <Layout activeNavItem="saved-content">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Saved Content</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-64 bg-gray-200 animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          ) : savedPosts.length > 0 ? (
            <div className="space-y-4">
              {savedPosts.map((post) => (
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
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">
                  No saved posts yet
                </h3>
                <p className="mt-2 text-gray-500">
                  Save posts to access them later by clicking the bookmark icon
                  on any post.
                </p>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default SavedPostsPage;
