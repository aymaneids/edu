import { supabase } from "../supabase";

export interface DiscussionForum {
  id: string;
  title: string;
  description: string;
  subject: string;
  created_by_name: string;
  created_at: string;
  topic_count: number;
}

export interface DiscussionTopic {
  id: string;
  forum_id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
  reply_count: number;
}

export interface DiscussionReply {
  id: string;
  topic_id: string;
  content: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
}

export async function getDiscussionForums() {
  const { data, error } = await supabase
    .from("discussion_forums")
    .select(
      `
      id,
      title,
      description,
      subject,
      created_at,
      profiles!created_by(full_name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching discussion forums:", error);
    return { data: null, error };
  }

  // Get topic counts for each forum
  const forumIds = data.map((forum) => forum.id);
  const { data: topicCounts, error: countError } = await supabase
    .from("discussion_topics")
    .select("forum_id, count")
    .in("forum_id", forumIds)
    .group("forum_id");

  if (countError) {
    console.error("Error fetching topic counts:", countError);
  }

  // Create a map of forum_id to topic count
  const topicCountMap = {};
  if (topicCounts) {
    topicCounts.forEach((item) => {
      topicCountMap[item.forum_id] = parseInt(item.count);
    });
  }

  // Format the data to match the DiscussionForum interface
  const formattedData = data.map((forum) => ({
    id: forum.id,
    title: forum.title,
    description: forum.description,
    subject: forum.subject,
    created_by_name: forum.profiles?.full_name || "Unknown User",
    created_at: forum.created_at,
    topic_count: topicCountMap[forum.id] || 0,
  }));

  return { data: formattedData, error: null };
}

export async function getForumTopics(forumId: string) {
  const { data, error } = await supabase
    .from("discussion_topics")
    .select(
      `
      id,
      forum_id,
      title,
      content,
      created_at,
      profiles!author_id(full_name, avatar_url)
    `,
    )
    .eq("forum_id", forumId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching forum topics:", error);
    return { data: null, error };
  }

  // Get reply counts for each topic
  const topicIds = data.map((topic) => topic.id);
  const { data: replyCounts, error: countError } = await supabase
    .from("discussion_replies")
    .select("topic_id, count")
    .in("topic_id", topicIds)
    .group("topic_id");

  if (countError) {
    console.error("Error fetching reply counts:", countError);
  }

  // Create a map of topic_id to reply count
  const replyCountMap = {};
  if (replyCounts) {
    replyCounts.forEach((item) => {
      replyCountMap[item.topic_id] = parseInt(item.count);
    });
  }

  // Format the data to match the DiscussionTopic interface
  const formattedData = data.map((topic) => ({
    id: topic.id,
    forum_id: topic.forum_id,
    title: topic.title,
    content: topic.content,
    author_name: topic.profiles?.full_name || "Unknown User",
    author_avatar: topic.profiles?.avatar_url || "",
    created_at: topic.created_at,
    reply_count: replyCountMap[topic.id] || 0,
  }));

  return { data: formattedData, error: null };
}

export async function getTopicReplies(topicId: string) {
  const { data, error } = await supabase
    .from("discussion_replies")
    .select(
      `
      id,
      topic_id,
      content,
      created_at,
      profiles!author_id(full_name, avatar_url)
    `,
    )
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching topic replies:", error);
    return { data: null, error };
  }

  // Format the data to match the DiscussionReply interface
  const formattedData = data.map((reply) => ({
    id: reply.id,
    topic_id: reply.topic_id,
    content: reply.content,
    author_name: reply.profiles?.full_name || "Unknown User",
    author_avatar: reply.profiles?.avatar_url || "",
    created_at: reply.created_at,
  }));

  return { data: formattedData, error: null };
}

export async function createDiscussionTopic(
  forumId: string,
  title: string,
  content: string,
) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("discussion_topics")
    .insert({
      forum_id: forumId,
      title,
      content,
      author_id: user.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating discussion topic:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function createTopicReply(topicId: string, content: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("discussion_replies")
    .insert({
      topic_id: topicId,
      content,
      author_id: user.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating topic reply:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
