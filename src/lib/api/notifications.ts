import { supabase } from "../supabase";

export interface Notification {
  id: string;
  content: string;
  type: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
}

export async function getUserNotifications() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: [], error: new Error("Not authenticated") };

  const { data, error } = await supabase.rpc("get_user_notifications", {
    user_id: user.user.id,
  });

  if (error) {
    console.error("Error fetching notifications:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    return { error };
  }

  return { error: null };
}

export async function markAllNotificationsAsRead() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.user.id)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return { error };
  }

  return { error: null };
}

export async function getUnreadNotificationCount() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { count: 0, error: new Error("Not authenticated") };

  const { data, error, count } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", user.user.id)
    .eq("is_read", false);

  if (error) {
    console.error("Error fetching unread notification count:", error);
    return { count: 0, error };
  }

  return { count: count || 0, error: null };
}
