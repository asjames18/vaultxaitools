-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;

-- Create new policies
-- Public can read published posts (no auth required)
CREATE POLICY "Public can read published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

-- Admins can do everything (using service role key)
CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
    FOR ALL USING (true);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY; 