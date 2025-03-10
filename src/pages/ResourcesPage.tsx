import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getLearningResources,
  getLearningResourcesBySubject,
} from "@/lib/api/resources";
import { LearningResource } from "@/lib/api/resources";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Link,
  Video,
  Book,
  Download,
  ExternalLink,
  Search,
} from "lucide-react";

const ResourcesPage = () => {
  const { profile } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchResources();
  }, [subjectFilter]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      let data;
      if (subjectFilter === "all") {
        const response = await getLearningResources();
        data = response.data;
      } else {
        const response = await getLearningResourcesBySubject(subjectFilter);
        data = response.data;
      }

      if (data) setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter resources based on search query
    console.log(`Searching for: ${searchQuery}`);
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "video":
        return <Video className="h-6 w-6 text-blue-500" />;
      case "article":
        return <Book className="h-6 w-6 text-green-500" />;
      case "link":
        return <Link className="h-6 w-6 text-purple-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter resources based on search query and type filter
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || resource.resource_type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Get unique subjects for the filter
  const subjects = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
  ];

  return (
    <Layout activeNavItem="resources">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Learning Resources</h1>
            <Button className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Upload Resource</span>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for resources..."
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

            <div className="flex gap-2">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Resource Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="pb-2 flex flex-row items-start gap-3">
                    {getResourceIcon(resource.resource_type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {resource.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>By: {resource.author_name}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(resource.created_at)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Badge variant="secondary" className="mb-2">
                      {resource.subject}
                    </Badge>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {resource.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    {resource.resource_type === "link" || resource.url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Visit</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No resources found
                </h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery ||
                  subjectFilter !== "all" ||
                  typeFilter !== "all"
                    ? "Try adjusting your search filters."
                    : "There are no learning resources available at the moment."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ResourcesPage;
