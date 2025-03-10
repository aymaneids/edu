import { Database } from "@/types/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

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
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: "pdf" | "doc" | "image";
  }>;
  like_count: number;
  comment_count: number;
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    author_id: string;
    author_name: string;
    author_avatar: string;
    author_department: string;
    likes: number;
  }>;
}

export interface PostData {
  title: string;
  content: string;
  tags: string[];
  attachments: Array<{
    type: "image" | "pdf" | "doc";
    name: string;
    url: string;
  }>;
}

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  subject: string;
  avatar_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    avatar: string;
    department?: string;
  };
  likes?: number;
}
