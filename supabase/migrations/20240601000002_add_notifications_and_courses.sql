-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  cover_image VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'interested',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create learning_resources table
CREATE TABLE IF NOT EXISTS learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(50) NOT NULL,
  url VARCHAR(255),
  file_path VARCHAR(255),
  subject VARCHAR(100) NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discussion_forums table
CREATE TABLE IF NOT EXISTS discussion_forums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discussion_topics table
CREATE TABLE IF NOT EXISTS discussion_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forum_id UUID NOT NULL REFERENCES discussion_forums(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discussion_replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES discussion_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add realtime for all tables
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table courses;
alter publication supabase_realtime add table course_enrollments;
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table event_attendees;
alter publication supabase_realtime add table learning_resources;
alter publication supabase_realtime add table discussion_forums;
alter publication supabase_realtime add table discussion_topics;
alter publication supabase_realtime add table discussion_replies;

-- Create functions for getting notifications
CREATE OR REPLACE FUNCTION get_user_notifications(user_id UUID)
RETURNS TABLE (
  id UUID,
  content TEXT,
  type VARCHAR(50),
  is_read BOOLEAN,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT n.id, n.content, n.type, n.is_read, n.related_id, n.created_at
  FROM notifications n
  WHERE n.user_id = user_id
  ORDER BY n.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function for getting user courses
CREATE OR REPLACE FUNCTION get_user_courses(user_id UUID)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  description TEXT,
  subject VARCHAR(100),
  instructor_name TEXT,
  instructor_avatar TEXT,
  cover_image VARCHAR(255),
  enrolled_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id, 
    c.title, 
    c.description, 
    c.subject, 
    p.full_name as instructor_name, 
    p.avatar_url as instructor_avatar, 
    c.cover_image, 
    ce.enrolled_at
  FROM courses c
  JOIN course_enrollments ce ON c.id = ce.course_id
  LEFT JOIN profiles p ON c.instructor_id = p.id
  WHERE ce.user_id = user_id
  ORDER BY ce.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function for getting user events
CREATE OR REPLACE FUNCTION get_user_events(user_id UUID)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  organizer_name TEXT,
  status VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id, 
    e.title, 
    e.description, 
    e.event_date, 
    e.location, 
    p.full_name as organizer_name, 
    ea.status
  FROM events e
  JOIN event_attendees ea ON e.id = ea.event_id
  LEFT JOIN profiles p ON e.organizer_id = p.id
  WHERE ea.user_id = user_id
  ORDER BY e.event_date;
END;
$$ LANGUAGE plpgsql;
