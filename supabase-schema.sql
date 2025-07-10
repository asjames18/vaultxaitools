-- Create tables
CREATE TABLE IF NOT EXISTS public.tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    category TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    weekly_users INTEGER DEFAULT 0,
    growth TEXT DEFAULT '+0%',
    website TEXT NOT NULL,
    pricing TEXT NOT NULL,
    features TEXT[],
    pros TEXT[],
    cons TEXT[],
    alternatives JSONB,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    color TEXT NOT NULL,
    popular_tools TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date TEXT NOT NULL,
    comment TEXT NOT NULL,
    helpful INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_rating ON public.tools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tools_weekly_users ON public.tools(weekly_users DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON public.reviews(tool_id);

-- Enable Row Level Security
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to tools" ON public.tools
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to reviews" ON public.reviews
    FOR SELECT USING (true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow authenticated users to manage tools" ON public.tools
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage categories" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage reviews" ON public.reviews
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.categories (name, icon, description, count, color, popular_tools) VALUES
('Language', '💬', 'AI tools for text generation, translation, and language processing', 45, 'from-blue-500 to-cyan-500', ARRAY['ChatGPT', 'Claude', 'Bard', 'Perplexity']),
('Design', '🎨', 'AI-powered design tools for graphics, UI/UX, and creative work', 38, 'from-purple-500 to-pink-500', ARRAY['Midjourney', 'DALL-E', 'Stable Diffusion', 'Canva AI']),
('Development', '💻', 'AI tools for coding, debugging, and software development', 52, 'from-green-500 to-emerald-500', ARRAY['GitHub Copilot', 'Cursor', 'Tabnine', 'CodeWhisperer']),
('Productivity', '⚡', 'AI assistants and tools to boost your productivity', 29, 'from-yellow-500 to-orange-500', ARRAY['Notion AI', 'Grammarly', 'Otter.ai', 'Fireflies']),
('Marketing', '📈', 'AI tools for marketing, advertising, and business growth', 31, 'from-red-500 to-rose-500', ARRAY['Jasper', 'Copy.ai', 'Surfer SEO', 'Phrasee'])
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES
('ChatGPT', '🤖', 'Advanced language model for conversation and text generation', 'ChatGPT is an AI-powered conversational agent that can engage in natural language conversations, answer questions, provide explanations, and assist with various tasks.', 'Language', 4.8, 1247, 15420, '+45%', 'https://chat.openai.com', 'Freemium', ARRAY['Natural language conversations', 'Context-aware responses', 'Multi-language support', 'Code generation and debugging'], ARRAY['Highly accurate and contextual responses', 'Excellent for learning and education', 'Free tier available'], ARRAY['Can sometimes provide incorrect information', 'Limited to training data cutoff'], '[{"name": "Claude", "rating": 4.7, "logo": "🧠"}, {"name": "Bard", "rating": 4.5, "logo": "🤖"}]', ARRAY['AI', 'Language', 'Conversation', 'OpenAI']),
('Midjourney', '🎨', 'AI-powered image generation from text descriptions', 'Midjourney is a cutting-edge AI art generation tool that creates stunning images from text prompts.', 'Design', 4.6, 892, 12850, '+32%', 'https://midjourney.com', 'Paid', ARRAY['Text-to-image generation', 'High-resolution outputs', 'Multiple art styles'], ARRAY['Exceptional artistic quality', 'Wide range of styles', 'Active community'], ARRAY['Requires Discord account', 'No free tier', 'Limited commercial usage'], '[{"name": "DALL-E", "rating": 4.6, "logo": "🖼️"}, {"name": "Stable Diffusion", "rating": 4.4, "logo": "🎭"}]', ARRAY['AI Art', 'Image Generation', 'Design', 'Creative'])
ON CONFLICT DO NOTHING; 