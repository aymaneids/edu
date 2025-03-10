import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  X,
} from "lucide-react";

interface PostEditorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (postData: PostData) => void;
  initialData?: PostData;
}

interface PostData {
  title: string;
  content: string;
  tags: string[];
  attachments: Array<{
    type: "image" | "pdf" | "doc";
    name: string;
    url: string;
  }>;
}

const PostEditor = ({
  isOpen = true,
  onClose = () => {},
  onSave = () => {},
  initialData = {
    title: "",
    content: "",
    tags: [],
    attachments: [],
  },
}: PostEditorProps) => {
  const [activeTab, setActiveTab] = useState("write");
  const [postData, setPostData] = useState<PostData>(initialData);
  const [newTag, setNewTag] = useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData({ ...postData, content: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData({ ...postData, title: e.target.value });
  };

  const addTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData({
        ...postData,
        tags: [...postData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Mock function for file upload
  const handleFileUpload = () => {
    // In a real implementation, this would handle file uploads
    // For now, we'll just add a mock attachment
    const mockAttachments = [
      ...postData.attachments,
      {
        type: "pdf" as const,
        name: "Sample-Document.pdf",
        url: "#",
      },
    ];
    setPostData({ ...postData, attachments: mockAttachments });
  };

  const handleImageUpload = () => {
    // Mock image upload
    const mockAttachments = [
      ...postData.attachments,
      {
        type: "image" as const,
        name: "Sample-Image.jpg",
        url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=80",
      },
    ];
    setPostData({ ...postData, attachments: mockAttachments });
  };

  const removeAttachment = (index: number) => {
    const updatedAttachments = [...postData.attachments];
    updatedAttachments.splice(index, 1);
    setPostData({ ...postData, attachments: updatedAttachments });
  };

  const handleSave = () => {
    onSave(postData);
    onClose();
  };

  const formatText = (format: string) => {
    // This is a placeholder for text formatting functionality
    // In a real implementation, this would apply formatting to the selected text
    console.log(`Applying ${format} formatting`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create Educational Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Post Title"
            className="text-lg font-medium"
            value={postData.title}
            onChange={handleTitleChange}
          />

          <Tabs
            defaultValue="write"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-4">
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("bullet-list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("numbered-list")}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleImageUpload}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("link")}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                placeholder="Share your knowledge or ask a question..."
                className="min-h-[200px]"
                value={postData.content}
                onChange={handleContentChange}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Tags</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add subject tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {postData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="space-y-2">
                  {postData.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        {attachment.type === "image" ? (
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                        ) : attachment.type === "pdf" ? (
                          <FileText className="h-4 w-4 text-red-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-green-500" />
                        )}
                        <span>{attachment.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {postData.title ? (
                <h2 className="text-2xl font-bold">{postData.title}</h2>
              ) : (
                <p className="text-muted-foreground italic">
                  No title provided
                </p>
              )}

              {postData.content ? (
                <div className="prose max-w-none">
                  <p>{postData.content}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No content provided
                </p>
              )}

              {postData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {postData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {postData.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Attachments</h3>
                  <div className="space-y-2">
                    {postData.attachments.map((attachment, index) => (
                      <div key={index} className="p-2 border rounded-md">
                        {attachment.type === "image" ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-blue-500" />
                              <span>{attachment.name}</span>
                            </div>
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="max-h-64 object-cover rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-500" />
                            <span>{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between items-center mt-4">
          <Select defaultValue="public">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Friends Only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Publish Post</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostEditor;
