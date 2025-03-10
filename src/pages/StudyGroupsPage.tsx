import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import StudyGroupCard from "@/components/study-group/StudyGroupCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const StudyGroupsPage = () => {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [studyGroups, setStudyGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudyGroups();
    }
  }, [user]);

  const fetchStudyGroups = async () => {
    setIsLoading(true);
    try {
      // Fetch all study groups
      const { data, error } = await supabase.from("study_groups").select(`
          id,
          name,
          description,
          subject,
          avatar_url,
          created_at,
          profiles!created_by(full_name)
        `);

      if (error) throw error;

      // Fetch user's memberships to determine which groups they're in
      const { data: memberships, error: membershipError } = await supabase
        .from("study_group_members")
        .select("group_id")
        .eq("user_id", user.id);

      if (membershipError) throw membershipError;

      // Create a set of group IDs the user is a member of
      const memberGroupIds = new Set(memberships?.map((m) => m.group_id) || []);

      // Format the data
      const formattedGroups = data.map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description || "No description provided",
        subject: group.subject,
        avatar:
          group.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${group.name}`,
        memberCount: 0, // We'll update this in a separate query
        isMember: memberGroupIds.has(group.id),
      }));

      // Get member counts for each group
      for (const group of formattedGroups) {
        const { count, error: countError } = await supabase
          .from("study_group_members")
          .select("id", { count: "exact" })
          .eq("group_id", group.id);

        if (!countError) {
          group.memberCount = count || 0;
        }
      }

      setStudyGroups(formattedGroups);
    } catch (error) {
      console.error("Error fetching study groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching for study groups: ${searchQuery}`);
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      // Add user to the group members
      const { error } = await supabase.from("study_group_members").insert({
        group_id: groupId,
        user_id: user.id,
        is_admin: false,
        joined_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Update the local state
      setStudyGroups(
        studyGroups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              isMember: true,
              memberCount: group.memberCount + 1,
            };
          }
          return group;
        }),
      );
    } catch (error) {
      console.error(`Error joining group ${groupId}:`, error);
    }
  };

  const handleViewGroup = (groupId: string) => {
    // In a full implementation, this would navigate to a group detail page
    console.log(`Viewing group ${groupId}`);
  };

  const handleCreateGroup = async () => {
    if (!user) return;

    // In a full implementation, this would open a modal to create a new group
    // For now, we'll create a sample group
    try {
      const newGroup = {
        name: "New Study Group",
        description: "A new study group created by the user",
        subject: "General",
        created_by: user.id,
        avatar_url: null,
      };

      const { data, error } = await supabase
        .from("study_groups")
        .insert(newGroup)
        .select()
        .single();

      if (error) throw error;

      // Add the creator as an admin member
      const { error: memberError } = await supabase
        .from("study_group_members")
        .insert({
          group_id: data.id,
          user_id: user.id,
          is_admin: true,
          joined_at: new Date().toISOString(),
        });

      if (memberError) throw memberError;

      // Refresh the groups
      fetchStudyGroups();
    } catch (error) {
      console.error("Error creating study group:", error);
    }
  };

  const filteredGroups = searchQuery
    ? studyGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : studyGroups;

  return (
    <Layout activeNavItem="study-groups">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Study Groups</h1>
            <Button
              onClick={handleCreateGroup}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Create Group</span>
            </Button>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for study groups by name, subject, or description..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? // Loading skeletons
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 animate-pulse rounded-md"
                    ></div>
                  ))
              : filteredGroups.map((group) => (
                  <StudyGroupCard
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    description={group.description}
                    subject={group.subject}
                    avatar={group.avatar}
                    memberCount={group.memberCount}
                    onJoin={handleJoinGroup}
                    onView={handleViewGroup}
                    isMember={group.isMember}
                  />
                ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center p-8 bg-white rounded-lg border mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                No study groups found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or create a new study group.
              </p>
              <Button className="mt-4" onClick={handleCreateGroup}>
                Create a Study Group
              </Button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default StudyGroupsPage;
