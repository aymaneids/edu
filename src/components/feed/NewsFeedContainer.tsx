import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NewsFeed from "./NewsFeed";
import PostEditor from "../post/PostEditor";
import PostDetail from "../post/PostDetail";
import {
  getPosts,
  createPost,
  togglePostLike,
  toggleSavePost,
  addComment,
} from "@/lib/api/posts";

const NewsFeedContainer = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Mock data for posts
  const mockPosts = [
    {
      id: "1",
      author_name: "Sarah Johnson",
      author_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      author_department: "Computer Science",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: "Notes on Advanced Data Structures",
      content:
        "Just finished compiling my notes on advanced data structures including AVL trees, Red-Black trees, and B-trees. These structures are crucial for optimizing search operations in large datasets. Check out the attached PDF for detailed explanations and examples!",
      attachments: [
        { type: "pdf", name: "AdvancedDataStructures.pdf", url: "#" },
        {
          type: "image",
          name: "DataStructureDiagram.png",
          url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&q=80",
        },
      ],
      tags: ["Computer Science", "Data Structures", "Algorithms"],
      like_count: 24,
      comment_count: 8,
    },
    {
      id: "2",
      author_name: "Michael Chen",
      author_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      author_department: "Physics",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: "Quantum Mechanics Study Group",
      content:
        "I'm organizing a study group for our upcoming quantum mechanics exam. We'll be covering wave functions, Schrödinger's equation, and quantum operators. Let me know if you're interested in joining!",
      attachments: [],
      tags: ["Physics", "Quantum Mechanics", "Study Group"],
      like_count: 15,
      comment_count: 12,
    },
    {
      id: "3",
      author_name: "Emily Rodriguez",
      author_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      author_department: "Biology",
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      title: "Cell Biology Lab Results",
      content:
        "Sharing my lab results from our recent cell membrane permeability experiment. The data shows some interesting patterns regarding selective transport mechanisms. I've attached both the raw data and my analysis.",
      attachments: [
        { type: "doc", name: "CellBiologyLabResults.doc", url: "#" },
        {
          type: "image",
          name: "MembraneDiagram.jpg",
          url: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=500&q=80",
        },
      ],
      tags: ["Biology", "Cell Biology", "Lab Results"],
      like_count: 32,
      comment_count: 7,
    },
  ];

  useEffect(() => {
    // Simulate loading posts from API
    setIsLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreatePost = () => {
    setIsPostEditorOpen(true);
  };

  const handleSavePost = (postData: any) => {
    // Create a new post with the data
    const newPost = {
      id: Date.now().toString(),
      author_name: profile?.full_name || "Student User",
      author_avatar:
        profile?.avatar_url ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
      author_department: profile?.department || "Computer Science",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: postData.title,
      content: postData.content,
      attachments: postData.attachments,
      tags: postData.tags,
      like_count: 0,
      comment_count: 0,
    };

    // Add the new post to the beginning of the posts array
    setPosts([newPost, ...posts]);
    setIsPostEditorOpen(false);
  };

  const handleViewPost = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsPostDetailOpen(true);
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, like_count: post.like_count + 1 };
        }
        return post;
      }),
    );
  };

  const handleCommentPost = (postId: string) => {
    // Open post detail view when commenting
    handleViewPost(postId);
  };

  const handleSavePostToggle = (postId: string) => {
    console.log(`Saved post ${postId}`);
  };

  const handleSharePost = (postId: string) => {
    console.log(`Shared post ${postId}`);
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, comment_count: post.comment_count + 1 };
        }
        return post;
      }),
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  };

  const handleFilter = () => {
    console.log("Filter posts");
  };

  return (
    <>
      <NewsFeed
        posts={posts}
        onCreatePost={handleCreatePost}
        onRefresh={handleRefresh}
        onFilter={handleFilter}
        isLoading={isLoading}
      />

      <PostEditor
        isOpen={isPostEditorOpen}
        onClose={() => setIsPostEditorOpen(false)}
        onSave={handleSavePost}
      />

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
          onComment={(content) => handleAddComment(selectedPost.id, content)}
          onSave={() => handleSavePostToggle(selectedPost.id)}
          onShare={() => handleSharePost(selectedPost.id)}
        />
      )}
    </>
  );
};

export default NewsFeedContainer;
