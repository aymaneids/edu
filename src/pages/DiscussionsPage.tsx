import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDiscussionForums,
  getForumTopics,
  createDiscussionTopic,
} from "@/lib/api/discussions";
import { DiscussionForum, DiscussionTopic } from "@/lib/api/discussions";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus, Search, MessageCircle } from "lucide-react";

const DiscussionsPage = () => {
  const { profile } = useAuth();
  const [forums, setForums] = useState<DiscussionForum[]>([]);
  const [selectedForum, setSelectedForum] = useState<DiscussionForum | null>(
    null,
  );
  const [topics, setTopics] = useState<DiscussionTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTopicDialogOpen, setIsNewTopicDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getDiscussionForums();
      if (error) throw error;
      if (data) setForums(data);
    } catch (error) {
      console.error("Error fetching forums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async (forumId: string) => {
    setIsTopicsLoading(true);
    try {
      const { data, error } = await getForumTopics(forumId);
      if (error) throw error;
      if (data) setTopics(data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setIsTopicsLoading(false);
    }
  };

  const handleForumSelect = (forum: DiscussionForum) => {
    setSelectedForum(forum);
    fetchTopics(forum.id);
  };

  const handleBackToForums = () => {
    setSelectedForum(null);
    setTopics([]);
  };

  const handleCreateTopic = async () => {
    if (!selectedForum) return;

    try {
      const { data, error } = await createDiscussionTopic(
        selectedForum.id,
        newTopicTitle,
        newTopicContent,
      );

      if (error) throw error;

      // Refresh topics
      fetchTopics(selectedForum.id);

      // Close dialog and reset form
      setIsNewTopicDialogOpen(false);
      setNewTopicTitle("");
      setNewTopicContent("");
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter forums based on search query
  const filteredForums = forums.filter(
    (forum) =>
      searchQuery === "" ||
      forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout activeNavItem="discussions">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {selectedForum ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Button
                    variant="ghost"
                    onClick={handleBackToForums}
                    className="mb-2"
                  >
                    ← Back to Forums
                  </Button>
                  <h1 className="text-2xl font-bold">{selectedForum.title}</h1>
                  <p className="text-muted-foreground">
                    {selectedForum.description}
                  </p>
                </div>
                <Button
                  onClick={() => setIsNewTopicDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Topic</span>
                </Button>
              </div>

              {isTopicsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full h-24 bg-gray-200 animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : topics.length > 0 ? (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <Card key={topic.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">
                            {topic.title}
                          </h3>
                          <Badge variant="secondary">
                            {topic.reply_count}{" "}
                            {topic.reply_count === 1 ? "reply" : "replies"}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Started by: {topic.author_name}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(topic.created_at)}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {topic.content}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>View Discussion</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No topics yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Be the first to start a discussion in this forum.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsNewTopicDialogOpen(true)}
                    >
                      Create New Topic
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Discussion Forums</h1>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative max-w-md">
                  <Input
                    type="text"
                    placeholder="Search forums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-gray-200 animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : filteredForums.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredForums.map((forum) => (
                    <Card
                      key={forum.id}
                      className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleForumSelect(forum)}
                    >
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-lg">{forum.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Created by: {forum.created_by_name}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <Badge variant="secondary" className="mb-2">
                          {forum.subject}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {forum.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex items-center text-sm">
                          <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                          <span>
                            {forum.topic_count}{" "}
                            {forum.topic_count === 1 ? "topic" : "topics"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(forum.created_at)}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No forums found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      {searchQuery
                        ? "Try adjusting your search query."
                        : "There are no discussion forums available at the moment."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {/* New Topic Dialog */}
      <Dialog
        open={isNewTopicDialogOpen}
        onOpenChange={setIsNewTopicDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="topic-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="topic-title"
                placeholder="Enter topic title"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="topic-content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="topic-content"
                placeholder="Write your discussion topic here..."
                rows={8}
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewTopicDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTopic}
              disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
            >
              Create Topic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DiscussionsPage;
