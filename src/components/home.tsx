import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import RightSidebar from "./layout/RightSidebar";
import PostCard from "./feed/PostCard";
import CreatePostCard from "./feed/CreatePostCard";
import { Button } from "./ui/button";
import { RefreshCw, Filter } from "lucide-react";
import PostEditor from "./post/PostEditor";
import PostDetail from "./post/PostDetail";
import {
  getPosts,
  createPost,
  togglePostLike,
  toggleSavePost,
  addComment,
} from "@/lib/api/posts";

const Home = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState("news-feed");
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getPosts();
      if (error) throw error;
      if (data) setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Set empty posts array on error to prevent infinite loading
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for navigation items in sidebar
  const handleNavigate = (item: string) => {
    setActiveNavItem(item);
  };

  // Handler for search
  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
  };

  const handleCreatePost = () => {
    setIsPostEditorOpen(true);
  };

  const handleSavePost = async (postData: any) => {
    if (!user) return;

    try {
      const { data, error } = await createPost(postData, user.id);
      if (error) throw error;
      if (data) {
        setPosts([data, ...posts]);
      }
      setIsPostEditorOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleViewPost = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsPostDetailOpen(true);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      const { data, error } = await togglePostLike(postId, user.id);
      if (error) throw error;

      // Update the post in the local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              like_count: data.liked
                ? post.like_count + 1
                : post.like_count - 1,
            };
          }
          return post;
        }),
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSavePostToggle = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await toggleSavePost(postId, user.id);
      if (error) throw error;
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { data, error } = await addComment(postId, content, user.id);
      if (error) throw error;

      // Update the post in the local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comment_count: post.comment_count + 1,
            };
          }
          return post;
        }),
      );

      // If the post detail is open, refresh it
      if (selectedPost && selectedPost.id === postId) {
        // In a real implementation, you would fetch the updated post details
        // For now, just close and reopen the detail view
        setIsPostDetailOpen(false);
        setTimeout(() => {
          handleViewPost(postId);
        }, 100);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Navbar
        userName={profile?.full_name || "Student User"}
        userAvatar={
          profile?.avatar_url ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=student"
        }
        onSearch={handleSearch}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeItem={activeNavItem}
          onNavigate={handleNavigate}
          userProfile={{
            name: profile?.full_name || "Student User",
            avatar:
              profile?.avatar_url ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
            department: profile?.department || "Computer Science",
          }}
        />

        {/* Main Content - News Feed */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto bg-gray-50">
            <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
              <h1 className="text-xl font-semibold">Knowledge Feed</h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchPosts}
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
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>

            <div className="p-4">
              <CreatePostCard
                userAvatar={
                  profile?.avatar_url ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=student"
                }
                userName={profile?.full_name || "Student User"}
                onCreatePost={handleCreatePost}
              />

              {isLoading ? (
                <div className="space-y-4 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full h-64 bg-gray-200 animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {posts.map((post) => (
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
                      onLike={() => handleLikePost(post.id)}
                      onComment={() => handleViewPost(post.id)}
                      onSave={() => handleSavePostToggle(post.id)}
                      onShare={() => console.log(`Shared post ${post.id}`)}
                      onViewPost={() => handleViewPost(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center p-8 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900">
                    No posts yet
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Be the first to share educational content with your peers!
                  </p>
                  <Button className="mt-4" onClick={handleCreatePost}>
                    Create a Post
                  </Button>
                </div>
              )}

              {posts.length > 0 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" className="w-full">
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Post Editor Modal */}
      <PostEditor
        isOpen={isPostEditorOpen}
        onClose={() => setIsPostEditorOpen(false)}
        onSave={handleSavePost}
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetail
          open={isPostDetailOpen}
          onOpenChange={setIsPostDetailOpen}
          post={{
            id: selectedPost.id,
            author: {
              name: selectedPost.author_name,
              avatar: selectedPost.author_avatar,
              department: selectedPost.author_department,
            },
            timestamp: new Date(selectedPost.created_at).toLocaleString(),
            title: selectedPost.title,
            content: selectedPost.content,
            attachments: selectedPost.attachments,
            tags: selectedPost.tags,
            likes: selectedPost.like_count,
            comments: [],
          }}
          onLike={() => handleLikePost(selectedPost.id)}
          onComment={(comment) => handleAddComment(selectedPost.id, comment)}
          onSave={() => handleSavePostToggle(selectedPost.id)}
          onShare={() => console.log(`Shared post ${selectedPost.id}`)}
        />
      )}
    </div>
  );
};

export default Home;
