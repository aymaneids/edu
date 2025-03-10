import { supabase } from "../supabase";

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  url: string;
  file_path: string;
  subject: string;
  author_name: string;
  created_at: string;
}

export async function getLearningResources() {
  const { data, error } = await supabase
    .from("learning_resources")
    .select(
      `
      id,
      title,
      description,
      resource_type,
      url,
      file_path,
      subject,
      created_at,
      profiles!author_id(full_name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching learning resources:", error);
    return { data: null, error };
  }

  // Format the data to match the LearningResource interface
  const formattedData = data.map((resource) => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    resource_type: resource.resource_type,
    url: resource.url,
    file_path: resource.file_path,
    subject: resource.subject,
    author_name: resource.profiles?.full_name || "Unknown Author",
    created_at: resource.created_at,
  }));

  return { data: formattedData, error: null };
}

export async function addLearningResource(resourceData: {
  title: string;
  description: string;
  resource_type: string;
  url?: string;
  file_path?: string;
  subject: string;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("learning_resources")
    .insert({
      ...resourceData,
      author_id: user.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding learning resource:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getLearningResourcesBySubject(subject: string) {
  const { data, error } = await supabase
    .from("learning_resources")
    .select(
      `
      id,
      title,
      description,
      resource_type,
      url,
      file_path,
      subject,
      created_at,
      profiles!author_id(full_name)
    `,
    )
    .eq("subject", subject)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching learning resources by subject:", error);
    return { data: null, error };
  }

  // Format the data to match the LearningResource interface
  const formattedData = data.map((resource) => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    resource_type: resource.resource_type,
    url: resource.url,
    file_path: resource.file_path,
    subject: resource.subject,
    author_name: resource.profiles?.full_name || "Unknown Author",
    created_at: resource.created_at,
  }));

  return { data: formattedData, error: null };
}
