import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserEvents,
  getAllEvents,
  updateEventAttendance,
} from "@/lib/api/events";
import { Event } from "@/lib/api/events";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Bell } from "lucide-react";

const EventsPage = () => {
  const { profile } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("my-events");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch user's events
      const { data: userEvents, error: userEventsError } =
        await getUserEvents();
      if (userEventsError) throw userEventsError;
      if (userEvents) setMyEvents(userEvents);

      // Fetch all available events
      const { data: events, error: eventsError } = await getAllEvents();
      if (eventsError) throw eventsError;
      if (events) setAllEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendEvent = async (eventId: string, status: string) => {
    try {
      const { error } = await updateEventAttendance(eventId, status);
      if (error) throw error;

      // Find the event in allEvents and add it to myEvents or update its status
      const event = allEvents.find((e) => e.id === eventId);
      if (event) {
        const attendingEvent = {
          ...event,
          status,
        };

        // Check if the event is already in myEvents
        const existingEventIndex = myEvents.findIndex((e) => e.id === eventId);
        if (existingEventIndex >= 0) {
          // Update the existing event
          const updatedEvents = [...myEvents];
          updatedEvents[existingEventIndex] = attendingEvent;
          setMyEvents(updatedEvents);
        } else {
          // Add the new event
          setMyEvents([...myEvents, attendingEvent]);
        }
      }
    } catch (error) {
      console.error("Error updating event attendance:", error);
    }
  };

  // Filter out past events
  const currentDate = new Date();
  const upcomingEvents = allEvents.filter(
    (event) => new Date(event.event_date) > currentDate,
  );

  // Format date and time
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <Layout activeNavItem="events">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Academic Events</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="my-events">My Events</TabsTrigger>
              <TabsTrigger value="discover">Discover Events</TabsTrigger>
            </TabsList>

            <TabsContent value="my-events" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : myEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myEvents.map((event) => {
                    const { date, time } = formatEventDate(event.event_date);
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">
                              {event.title}
                            </h3>
                            <Badge
                              variant={
                                event.status === "attending"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {event.status === "attending"
                                ? "Attending"
                                : "Interested"}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            <span>Organizer: {event.organizer_name}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              <span>
                                {date} at {time}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 mt-2">
                              {event.description}
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <Button
                            variant={
                              event.status === "attending"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleAttendEvent(event.id, "attending")
                            }
                          >
                            {event.status === "attending"
                              ? "Attending"
                              : "Attend"}
                          </Button>
                          <Button
                            variant={
                              event.status === "interested"
                                ? "secondary"
                                : "ghost"
                            }
                            size="sm"
                            onClick={() =>
                              handleAttendEvent(event.id, "interested")
                            }
                          >
                            {event.status === "interested"
                              ? "Interested"
                              : "Interested"}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No events yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                      You haven't joined any events yet. Discover events to get
                      started.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setActiveTab("discover")}
                    >
                      Discover Events
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="discover" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.map((event) => {
                    const { date, time } = formatEventDate(event.event_date);
                    const isAttending = myEvents.some(
                      (e) => e.id === event.id && e.status === "attending",
                    );
                    const isInterested = myEvents.some(
                      (e) => e.id === event.id && e.status === "interested",
                    );

                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <h3 className="font-semibold text-lg">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            <span>Organizer: {event.organizer_name}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              <span>
                                {date} at {time}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 mt-2">
                              {event.description}
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <Button
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              handleAttendEvent(event.id, "attending")
                            }
                          >
                            {isAttending ? "Attending" : "Attend"}
                          </Button>
                          <Button
                            variant={isInterested ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() =>
                              handleAttendEvent(event.id, "interested")
                            }
                          >
                            <Bell className="h-3 w-3 mr-1" />
                            {isInterested ? "Interested" : "Interested"}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No upcoming events
                    </h3>
                    <p className="mt-2 text-gray-500">
                      There are no upcoming events at the moment. Check back
                      later.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  );
};

export default EventsPage;
