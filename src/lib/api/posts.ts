import { supabase } from "../supabase";

export interface PostWithDetails {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_department: string;
  tags: string[];
  attachments: any[];
  like_count: number;
  comment_count: number;
  comments?: any[];
}

export interface PostData {
  title: string;
  content: string;
  tags: string[];
  attachments?: any[];
}

export async function getPosts() {
  const { data, error } = await supabase.rpc("get_posts");

  if (error) {
    console.error("Error fetching posts:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getPostDetails(postId: string) {
  const { data, error } = await supabase.rpc("get_post_details", {
    post_id: postId,
  });

  if (error) {
    console.error("Error fetching post details:", error);
    return { data: null, error };
  }

  return { data: data?.[0] || null, error: null };
}

export async function createPost(postData: PostData, authorId: string) {
  // First create the post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      title: postData.title,
      content: postData.content,
      author_id: authorId,
    })
    .select()
    .single();

  if (postError) {
    console.error("Error creating post:", postError);
    return { data: null, error: postError };
  }

  // Add tags if provided
  if (postData.tags && postData.tags.length > 0) {
    const tagInserts = postData.tags.map((tag) => ({
      post_id: post.id,
      tag,
    }));

    const { error: tagError } = await supabase
      .from("post_tags")
      .insert(tagInserts);

    if (tagError) {
      console.error("Error adding tags:", tagError);
      // We don't return here as the post was created successfully
    }
  }

  // Add attachments if provided
  if (postData.attachments && postData.attachments.length > 0) {
    const attachmentInserts = postData.attachments.map((attachment) => ({
      post_id: post.id,
      name: attachment.name,
      type: attachment.type,
      url: attachment.url,
    }));

    const { error: attachmentError } = await supabase
      .from("post_attachments")
      .insert(attachmentInserts);

    if (attachmentError) {
      console.error("Error adding attachments:", attachmentError);
      // We don't return here as the post was created successfully
    }
  }

  // Get the complete post details to return
  return getPostDetails(post.id);
}

export async function togglePostLike(postId: string, userId: string) {
  // Check if the user has already liked the post
  const { data: existingLike, error: checkError } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking like status:", checkError);
    return { data: null, error: checkError };
  }

  if (existingLike) {
    // User has already liked the post, so unlike it
    const { error: unlikeError } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);

    if (unlikeError) {
      console.error("Error unliking post:", unlikeError);
      return { data: null, error: unlikeError };
    }

    return { data: { liked: false }, error: null };
  } else {
    // User hasn't liked the post, so like it
    const { error: likeError } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: userId,
    });

    if (likeError) {
      console.error("Error liking post:", likeError);
      return { data: null, error: likeError };
    }

    return { data: { liked: true }, error: null };
  }
}

export async function toggleSavePost(postId: string, userId: string) {
  // Check if the user has already saved the post
  const { data: existingSave, error: checkError } = await supabase
    .from("saved_posts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking save status:", checkError);
    return { data: null, error: checkError };
  }

  if (existingSave) {
    // User has already saved the post, so unsave it
    const { error: unsaveError } = await supabase
      .from("saved_posts")
      .delete()
      .eq("id", existingSave.id);

    if (unsaveError) {
      console.error("Error unsaving post:", unsaveError);
      return { data: null, error: unsaveError };
    }

    return { data: { saved: false }, error: null };
  } else {
    // User hasn't saved the post, so save it
    const { error: saveError } = await supabase.from("saved_posts").insert({
      post_id: postId,
      user_id: userId,
    });

    if (saveError) {
      console.error("Error saving post:", saveError);
      return { data: null, error: saveError };
    }

    return { data: { saved: true }, error: null };
  }
}

export async function addComment(
  postId: string,
  content: string,
  authorId: string,
) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      content,
      author_id: authorId,
    })
    .select(
      `
      id,
      content,
      created_at,
      profiles!author_id(full_name, avatar_url, department)
    `,
    )
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    return { data: null, error };
  }

  // Format the comment data
  const formattedComment = {
    id: data.id,
    content: data.content,
    created_at: data.created_at,
    author_name: data.profiles.full_name,
    author_avatar: data.profiles.avatar_url,
    author_department: data.profiles.department,
    likes: 0,
  };

  return { data: formattedComment, error: null };
}

export async function getSavedPosts(userId: string) {
  const { data, error } = await supabase
    .from("saved_posts")
    .select(
      `
      post_id,
      posts!post_id(id, title, content, created_at, updated_at, author_id)
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching saved posts:", error);
    return { data: null, error };
  }

  // Get the post IDs to fetch additional details
  const postIds = data.map((item) => item.posts.id);

  if (postIds.length === 0) {
    return { data: [], error: null };
  }

  // Fetch complete post details for each saved post
  const { data: postsData, error: postsError } = await supabase
    .rpc("get_posts")
    .in("id", postIds);

  if (postsError) {
    console.error("Error fetching saved post details:", postsError);
    return { data: null, error: postsError };
  }

  return { data: postsData, error: null };
}
