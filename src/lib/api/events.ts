import { supabase } from "../supabase";

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  organizer_name: string;
  status: string;
}

export async function getUserEvents() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: [], error: new Error("Not authenticated") };

  const { data, error } = await supabase.rpc("get_user_events", {
    user_id: user.user.id,
  });

  if (error) {
    console.error("Error fetching events:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getAllEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      description,
      event_date,
      location,
      profiles!organizer_id(full_name)
    `,
    )
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching all events:", error);
    return { data: null, error };
  }

  // Format the data to match the Event interface
  const formattedData = data.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    event_date: event.event_date,
    location: event.location,
    organizer_name: event.profiles?.full_name || "Unknown Organizer",
    status: "not_attending", // Default status for non-attending events
  }));

  return { data: formattedData, error: null };
}

export async function updateEventAttendance(eventId: string, status: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: new Error("Not authenticated") };

  // Check if the user is already attending the event
  const { data: existingAttendance, error: checkError } = await supabase
    .from("event_attendees")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error checking attendance status:", checkError);
    return { error: checkError };
  }

  if (existingAttendance) {
    // Update existing attendance
    const { error } = await supabase
      .from("event_attendees")
      .update({ status })
      .eq("id", existingAttendance.id);

    if (error) {
      console.error("Error updating event attendance:", error);
      return { error };
    }
  } else {
    // Create new attendance
    const { error } = await supabase.from("event_attendees").insert({
      event_id: eventId,
      user_id: user.user.id,
      status,
    });

    if (error) {
      console.error("Error creating event attendance:", error);
      return { error };
    }
  }

  return { error: null };
}

export async function getEventAttendanceStatus(eventId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user)
    return { status: "not_attending", error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("event_attendees")
    .select("status")
    .eq("event_id", eventId)
    .eq("user_id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error checking attendance status:", error);
    return { status: "not_attending", error };
  }

  return { status: data?.status || "not_attending", error: null };
}
