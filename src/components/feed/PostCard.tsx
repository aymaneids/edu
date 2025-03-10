import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from "lucide-react";

interface PostCardProps {
  author?: {
    name: string;
    avatar: string;
    department?: string;
  };
  timestamp?: string;
  title?: string;
  content?: string;
  attachments?: Array<{
    type: "pdf" | "doc" | "image";
    name: string;
    url: string;
  }>;
  tags?: string[];
  likes?: number;
  comments?: number;
  onLike?: () => void;
  onComment?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onViewPost?: () => void;
}

const PostCard = ({
  author = {
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    department: "Computer Science",
  },
  timestamp = "2 hours ago",
  title = "Notes on Advanced Data Structures",
  content = "Just finished compiling my notes on advanced data structures including AVL trees, Red-Black trees, and B-trees. These structures are crucial for optimizing search operations in large datasets. Check out the attached PDF for detailed explanations and examples!",
  attachments = [
    { type: "pdf", name: "AdvancedDataStructures.pdf", url: "#" },
    {
      type: "image",
      name: "DataStructureDiagram.png",
      url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&q=80",
    },
  ],
  tags = ["Computer Science", "Data Structures", "Algorithms"],
  likes = 24,
  comments = 8,
  onLike = () => console.log("Liked post"),
  onComment = () => console.log("Comment on post"),
  onSave = () => console.log("Saved post"),
  onShare = () => console.log("Shared post"),
  onViewPost = () => console.log("Viewing full post"),
}: PostCardProps) => {
  return (
    <Card className="w-full mb-4 bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{author.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{author.department}</span>
                <span className="mx-1">•</span>
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            •••
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div onClick={onViewPost} className="cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-700 mb-3">{content}</p>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mb-3">
              {attachments.map((attachment, index) => (
                <div key={index} className="mb-2">
                  {attachment.type === "image" && (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="rounded-md max-h-64 object-cover"
                    />
                  )}
                  {attachment.type === "pdf" && (
                    <div className="flex items-center p-2 bg-gray-100 rounded-md">
                      <svg
                        className="w-6 h-6 text-red-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{attachment.name}</span>
                    </div>
                  )}
                  {attachment.type === "doc" && (
                    <div className="flex items-center p-2 bg-gray-100 rounded-md">
                      <svg
                        className="w-6 h-6 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{attachment.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 flex justify-between">
        <TooltipProvider>
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className="flex items-center space-x-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{likes}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like this post</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onComment}
                  className="flex items-center space-x-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comment on this post</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onSave}>
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save this post</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this post</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
