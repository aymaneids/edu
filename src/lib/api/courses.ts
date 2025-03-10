import { supabase } from "../supabase";

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  instructor_name: string;
  instructor_avatar: string;
  cover_image: string;
  enrolled_at: string;
}

export async function getUserCourses() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: [], error: new Error("Not authenticated") };

  const { data, error } = await supabase.rpc("get_user_courses", {
    user_id: user.user.id,
  });

  if (error) {
    console.error("Error fetching courses:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getAllCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      description,
      subject,
      cover_image,
      profiles!instructor_id(full_name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all courses:", error);
    return { data: null, error };
  }

  // Format the data to match the Course interface
  const formattedData = data.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    subject: course.subject,
    instructor_name: course.profiles?.full_name || "Unknown Instructor",
    instructor_avatar: course.profiles?.avatar_url || "",
    cover_image: course.cover_image,
    enrolled_at: "", // This will be empty for non-enrolled courses
  }));

  return { data: formattedData, error: null };
}

export async function enrollInCourse(courseId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: new Error("Not authenticated") };

  const { error } = await supabase.from("course_enrollments").insert({
    course_id: courseId,
    user_id: user.user.id,
  });

  if (error) {
    // If the error is a duplicate key error, the user is already enrolled
    if (error.code === "23505") {
      return { error: null };
    }
    console.error("Error enrolling in course:", error);
    return { error };
  }

  return { error: null };
}

export async function unenrollFromCourse(courseId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("course_enrollments")
    .delete()
    .eq("course_id", courseId)
    .eq("user_id", user.user.id);

  if (error) {
    console.error("Error unenrolling from course:", error);
    return { error };
  }

  return { error: null };
}

export async function isEnrolledInCourse(courseId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user)
    return { enrolled: false, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error checking enrollment status:", error);
    return { enrolled: false, error };
  }

  return { enrolled: !!data, error: null };
}
