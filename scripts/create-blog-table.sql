-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT DEFAULT '5 min read',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON public.blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Admins can do everything
CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'admin' 
                OR auth.users.email = ANY(ARRAY['your-admin-email@example.com'])
            )
        )
    );

-- Public can only read published posts
CREATE POLICY "Public can read published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

-- Insert sample data
INSERT INTO public.blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  author, 
  category, 
  read_time, 
  featured, 
  status, 
  tags, 
  seo_title, 
  seo_description,
  published_at
) VALUES 
(
  'The Future of AI Writing: How ChatGPT is Revolutionizing Content Creation',
  'future-ai-writing-chatgpt',
  'Discover how AI writing tools are transforming the way we create content, from blog posts to marketing copy.',
  'AI writing tools have fundamentally changed how we approach content creation. From simple text generation to complex content strategies, these tools are reshaping the creative landscape...',
  'Sarah Johnson',
  'Writing',
  '5 min read',
  true,
  'published',
  ARRAY['AI Writing', 'ChatGPT', 'Content Creation', 'Productivity'],
  'The Future of AI Writing: How ChatGPT is Revolutionizing Content Creation',
  'Discover how AI writing tools are transforming content creation. Learn about ChatGPT and other AI writing assistants.',
  NOW()
),
(
  'Top 10 AI Design Tools Every Designer Should Know in 2024',
  'top-10-ai-design-tools-2024',
  'From Midjourney to DALL-E, explore the most powerful AI design tools that are reshaping the creative industry.',
  'The design industry is experiencing an AI revolution. Designers now have access to powerful tools that can generate, enhance, and transform their creative work...',
  'Mike Chen',
  'Design',
  '8 min read',
  true,
  'published',
  ARRAY['AI Design', 'Midjourney', 'DALL-E', 'Creative Tools'],
  'Top 10 AI Design Tools Every Designer Should Know in 2024',
  'Explore the most powerful AI design tools including Midjourney, DALL-E, and more. Transform your creative workflow.',
  NOW()
),
(
  'How GitHub Copilot is Changing the Way Developers Code',
  'github-copilot-changing-development',
  'An in-depth look at how AI-powered coding assistants are boosting developer productivity and code quality.',
  'GitHub Copilot has become an essential tool for developers. This AI-powered coding assistant is transforming how we write, debug, and maintain code...',
  'David Lee',
  'Development',
  '6 min read',
  false,
  'published',
  ARRAY['GitHub Copilot', 'AI Coding', 'Development', 'Productivity'],
  'How GitHub Copilot is Changing the Way Developers Code',
  'Learn how GitHub Copilot is revolutionizing software development with AI-powered code assistance.',
  NOW()
)
ON CONFLICT (slug) DO NOTHING; 