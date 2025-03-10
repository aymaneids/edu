import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, FileTextIcon, LinkIcon } from "lucide-react";

interface CreatePostCardProps {
  onCreatePost?: () => void;
  userAvatar?: string;
  userName?: string;
}

const CreatePostCard = ({
  onCreatePost = () => {},
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
  userName = "Student User",
}: CreatePostCardProps) => {
  return (
    <Card className="w-full mb-4 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            className="flex-1 h-10 justify-start text-gray-500 bg-gray-100 hover:bg-gray-200 border-gray-200"
            onClick={onCreatePost}
          >
            Share your knowledge or ask a question...
          </Button>
        </div>

        <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onCreatePost}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Image</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onCreatePost}
          >
            <FileTextIcon className="h-4 w-4" />
            <span>Document</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onCreatePost}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Link</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
