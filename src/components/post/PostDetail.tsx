import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Download,
} from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    department?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface Attachment {
  type: "pdf" | "doc" | "image";
  name: string;
  url: string;
}

interface PostDetailProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  post?: {
    id: string;
    author: {
      name: string;
      avatar: string;
      department?: string;
    };
    timestamp: string;
    title: string;
    content: string;
    attachments: Attachment[];
    tags: string[];
    likes: number;
    comments: Comment[];
  };
  onLike?: () => void;
  onComment?: (comment: string) => void;
  onSave?: () => void;
  onShare?: () => void;
}

const PostDetail = ({
  open = true,
  onOpenChange = () => {},
  post = {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      department: "Computer Science",
    },
    timestamp: "2 hours ago",
    title: "Notes on Advanced Data Structures",
    content:
      "Just finished compiling my notes on advanced data structures including AVL trees, Red-Black trees, and B-trees. These structures are crucial for optimizing search operations in large datasets. I've included detailed explanations of time complexity analysis and practical implementation examples in various programming languages.\n\nThe PDF contains code samples in Python, Java, and C++ along with visualizations of how these structures work. I've also added a section on when to use each type of data structure based on your specific use case.\n\nFeel free to ask questions in the comments if anything isn't clear!",
    attachments: [
      { type: "pdf", name: "AdvancedDataStructures.pdf", url: "#" },
      {
        type: "image",
        name: "DataStructureDiagram.png",
        url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80",
      },
    ],
    tags: ["Computer Science", "Data Structures", "Algorithms", "Study Notes"],
    likes: 42,
    comments: [
      {
        id: "c1",
        author: {
          name: "Alex Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
          department: "Computer Engineering",
        },
        content:
          "This is incredibly helpful! I've been struggling with Red-Black trees. Could you explain the rotation operations in more detail?",
        timestamp: "1 hour ago",
        likes: 8,
      },
      {
        id: "c2",
        author: {
          name: "Maya Patel",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
          department: "Data Science",
        },
        content:
          "Thanks for sharing! The time complexity analysis is particularly useful for my current project.",
        timestamp: "45 minutes ago",
        likes: 5,
      },
    ],
  },
  onLike = () => {},
  onComment = () => {},
  onSave = () => {},
  onShare = () => {},
}: PostDetailProps) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0">
        <div className="sticky top-0 z-10 bg-white border-b p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {post.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* Author info */}
          <div className="flex items-center mb-4">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{post.author.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{post.author.department}</span>
                <span className="mx-1">•</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Post content */}
          <div className="mb-6">
            <div className="text-gray-700 whitespace-pre-line mb-6">
              {post.content}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Attachments */}
            {post.attachments.length > 0 && (
              <div className="mb-6 space-y-3">
                <h3 className="font-medium text-lg">Attachments</h3>
                {post.attachments.map((attachment, index) => (
                  <div key={index} className="mb-2">
                    {attachment.type === "image" && (
                      <div className="relative">
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="rounded-md w-full max-h-96 object-cover"
                        />
                        <div className="absolute bottom-2 right-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex items-center gap-1 bg-white/80 backdrop-blur-sm"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </div>
                    )}
                    {attachment.type === "pdf" && (
                      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-red-500 mr-2" />
                          <span>{attachment.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    )}
                    {attachment.type === "doc" && (
                      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-blue-500 mr-2" />
                          <span>{attachment.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Interaction buttons */}
            <div className="flex justify-between border-t border-b py-3 my-4">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className="flex items-center space-x-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes} Likes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => {
                    const commentBox = document.getElementById("comment-box");
                    if (commentBox) {
                      commentBox.focus();
                    }
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length} Comments</span>
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSave}
                  className="flex items-center space-x-1"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="flex items-center space-x-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-4">Comments</h3>

            {/* Comment list */}
            <div className="space-y-4 mb-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-3 mt-1">
                      <AvatarImage
                        src={comment.author.avatar}
                        alt={comment.author.name}
                      />
                      <AvatarFallback>
                        {comment.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {comment.author.name}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {comment.author.department}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="mt-2">{comment.content}</p>
                      </div>
                      <div className="flex items-center mt-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{comment.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  alt="Your avatar"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  id="comment-box"
                  placeholder="Add a comment..."
                  className="min-h-[80px] mb-2"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      <span>Image</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      <span>Link</span>
                    </Button>
                  </div>
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="flex items-center gap-1"
                  >
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetail;
