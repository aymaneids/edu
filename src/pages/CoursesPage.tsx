import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserCourses,
  getAllCourses,
  enrollInCourse,
} from "@/lib/api/courses";
import { Course } from "@/lib/api/courses";
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
import { BookOpen, Users, Calendar } from "lucide-react";

const CoursesPage = () => {
  const { profile } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("my-courses");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // Fetch user's enrolled courses
      const { data: userCourses, error: userCoursesError } =
        await getUserCourses();
      if (userCoursesError) throw userCoursesError;
      if (userCourses) setMyCourses(userCourses);

      // Fetch all available courses
      const { data: courses, error: coursesError } = await getAllCourses();
      if (coursesError) throw coursesError;
      if (courses) setAllCourses(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const { error } = await enrollInCourse(courseId);
      if (error) throw error;

      // Find the course in allCourses and add it to myCourses
      const course = allCourses.find((c) => c.id === courseId);
      if (course) {
        const enrolledCourse = {
          ...course,
          enrolled_at: new Date().toISOString(),
        };
        setMyCourses([...myCourses, enrolledCourse]);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  // Filter out courses that the user is already enrolled in
  const availableCourses = allCourses.filter(
    (course) => !myCourses.some((myCourse) => myCourse.id === course.id),
  );

  return (
    <Layout activeNavItem="courses">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Courses</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
              <TabsTrigger value="discover">Discover Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="my-courses" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : myCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{
                          backgroundImage: course.cover_image
                            ? `url(${course.cover_image})`
                            : `url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80)`,
                        }}
                      ></div>
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Instructor: {course.instructor_name}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <Badge variant="secondary" className="mb-2">
                          {course.subject}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {course.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            Enrolled:{" "}
                            {new Date(course.enrolled_at).toLocaleDateString()}
                          </span>
                        </div>
                        <Button size="sm">Continue</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No courses yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                      You haven't enrolled in any courses yet. Discover courses
                      to get started.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setActiveTab("discover")}
                    >
                      Discover Courses
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
              ) : availableCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{
                          backgroundImage: course.cover_image
                            ? `url(${course.cover_image})`
                            : `url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80)`,
                        }}
                      ></div>
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Instructor: {course.instructor_name}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <Badge variant="secondary" className="mb-2">
                          {course.subject}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {course.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No courses available
                    </h3>
                    <p className="mt-2 text-gray-500">
                      There are no additional courses available at the moment.
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

export default CoursesPage;
