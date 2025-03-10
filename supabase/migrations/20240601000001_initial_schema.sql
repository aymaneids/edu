-- Create profiles table that extends the auth.users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  department TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create post_attachments table
CREATE TABLE IF NOT EXISTS post_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create post_tags table
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(post_id, tag)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT likes_post_or_comment CHECK (
    (post_id IS NULL AND comment_id IS NOT NULL) OR
    (post_id IS NOT NULL AND comment_id IS NULL)
  ),
  UNIQUE(post_id, user_id),
  UNIQUE(comment_id, user_id)
);

-- Create saved_posts table
CREATE TABLE IF NOT EXISTS saved_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Create study_groups table
CREATE TABLE IF NOT EXISTS study_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  avatar_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create study_group_members table
CREATE TABLE IF NOT EXISTS study_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Post attachments policies
CREATE POLICY "Post attachments are viewable by everyone" ON post_attachments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert attachments to their own posts" ON post_attachments
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT author_id FROM posts WHERE id = post_id
    )
  );

CREATE POLICY "Users can delete attachments from their own posts" ON post_attachments
  FOR DELETE USING (
    auth.uid() IN (
      SELECT author_id FROM posts WHERE id = post_id
    )
  );

-- Post tags policies
CREATE POLICY "Post tags are viewable by everyone" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can insert tags to their own posts" ON post_tags
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT author_id FROM posts WHERE id = post_id
    )
  );

CREATE POLICY "Users can delete tags from their own posts" ON post_tags
  FOR DELETE USING (
    auth.uid() IN (
      SELECT author_id FROM posts WHERE id = post_id
    )
  );

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Saved posts policies
CREATE POLICY "Saved posts are viewable by the owner" ON saved_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts" ON saved_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave posts" ON saved_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Study groups policies
CREATE POLICY "Study groups are viewable by everyone" ON study_groups
  FOR SELECT USING (true);

CREATE POLICY "Users can create study groups" ON study_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update study groups" ON study_groups
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM study_group_members 
      WHERE group_id = id AND is_admin = true
    )
  );

CREATE POLICY "Group admins can delete study groups" ON study_groups
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM study_group_members 
      WHERE group_id = id AND is_admin = true
    )
  );

-- Study group members policies
CREATE POLICY "Group members are viewable by everyone" ON study_group_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join groups" ON study_group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group admins can update members" ON study_group_members
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM study_group_members 
      WHERE group_id = group_id AND is_admin = true
    )
  );

CREATE POLICY "Users can leave groups or admins can remove members" ON study_group_members
  FOR DELETE USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM study_group_members 
      WHERE group_id = group_id AND is_admin = true
    )
  );

-- Create functions
-- Function to get posts with author, tags, attachments, like count, and comment count
CREATE OR REPLACE FUNCTION get_posts()
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  author_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  author_department TEXT,
  tags TEXT[],
  attachments JSONB,
  like_count BIGINT,
  comment_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.created_at,
    p.updated_at,
    p.author_id,
    pr.full_name AS author_name,
    pr.avatar_url AS author_avatar,
    pr.department AS author_department,
    ARRAY(
      SELECT pt.tag 
      FROM post_tags pt 
      WHERE pt.post_id = p.id
    ) AS tags,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', pa.id,
          'name', pa.name,
          'url', pa.url,
          'type', pa.type
        )
      ) FROM post_attachments pa WHERE pa.post_id = p.id),
      '[]'::jsonb
    ) AS attachments,
    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
  FROM posts p
  JOIN profiles pr ON p.author_id = pr.id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get a single post with all details
CREATE OR REPLACE FUNCTION get_post_details(post_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  author_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  author_department TEXT,
  tags TEXT[],
  attachments JSONB,
  like_count BIGINT,
  comment_count BIGINT,
  comments JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.created_at,
    p.updated_at,
    p.author_id,
    pr.full_name AS author_name,
    pr.avatar_url AS author_avatar,
    pr.department AS author_department,
    ARRAY(
      SELECT pt.tag 
      FROM post_tags pt 
      WHERE pt.post_id = p.id
    ) AS tags,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', pa.id,
          'name', pa.name,
          'url', pa.url,
          'type', pa.type
        )
      ) FROM post_attachments pa WHERE pa.post_id = p.id),
      '[]'::jsonb
    ) AS attachments,
    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'content', c.content,
          'created_at', c.created_at,
          'author_id', c.author_id,
          'author_name', cp.full_name,
          'author_avatar', cp.avatar_url,
          'author_department', cp.department,
          'likes', (SELECT COUNT(*) FROM likes cl WHERE cl.comment_id = c.id)
        )
      ) FROM comments c
      JOIN profiles cp ON c.author_id = cp.id
      WHERE c.post_id = p.id
      ORDER BY c.created_at DESC),
      '[]'::jsonb
    ) AS comments
  FROM posts p
  JOIN profiles pr ON p.author_id = pr.id
  WHERE p.id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table post_attachments;
alter publication supabase_realtime add table post_tags;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table likes;
alter publication supabase_realtime add table saved_posts;
alter publication supabase_realtime add table study_groups;
alter publication supabase_realtime add table study_group_members;

-- Create trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_study_groups_updated_at
    BEFORE UPDATE ON study_groups
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create trigger to create a profile after a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
