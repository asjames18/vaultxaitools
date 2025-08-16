
INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'ChatGPT',
  '🤖',
  'Advanced AI language model for conversation and text generation',
  'ChatGPT is OpenAI''s flagship conversational AI that can engage in natural language conversations, answer questions, provide explanations, assist with coding, and help with various creative and analytical tasks. It''s trained on a diverse range of internet text and can understand context, generate human-like responses, and adapt to different conversation styles.',
  'Language',
  4.8,
  1247,
  15420,
  '+45%',
  'https://chat.openai.com',
  'Freemium',
  ARRAY['Natural language conversations', 'Context-aware responses', 'Multi-language support', 'Code generation and debugging', 'Creative writing assistance', 'Problem-solving capabilities', 'Real-time learning and adaptation'],
  ARRAY['Highly accurate and contextual responses', 'Excellent for learning and education', 'Free tier available', 'Regular updates and improvements', 'Strong community support', 'Versatile use cases'],
  ARRAY['Can sometimes provide incorrect information', 'Limited to training data cutoff', 'Requires internet connection', 'May have usage limits on free tier'],
  '[{"name":"Claude","rating":4.7,"logo":"🧠"},{"name":"Bard","rating":4.5,"logo":"🤖"},{"name":"Perplexity","rating":4.6,"logo":"🔍"}]',
  ARRAY['AI', 'Language', 'Conversation', 'OpenAI', 'GPT-4', 'Natural Language Processing']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Midjourney',
  '🎨',
  'AI-powered image generation from text descriptions',
  'Midjourney is a cutting-edge AI art generation tool that creates stunning, high-quality images from text prompts. It''s particularly known for its artistic style and ability to generate beautiful, detailed artwork across various genres and styles. The tool is accessed through Discord and has become a favorite among artists, designers, and creative professionals.',
  'Design',
  4.6,
  892,
  12850,
  '+32%',
  'https://midjourney.com',
  'Paid',
  ARRAY['Text-to-image generation', 'High-resolution outputs', 'Multiple art styles', 'Real-time generation', 'Community features', 'Style customization', 'Batch processing'],
  ARRAY['Exceptional artistic quality', 'Wide range of styles', 'Active community', 'Regular model updates', 'High-resolution outputs', 'Creative freedom'],
  ARRAY['Requires Discord account', 'No free tier', 'Limited commercial usage', 'Learning curve for prompts', 'Generation time can be slow'],
  '[{"name":"DALL-E","rating":4.6,"logo":"🖼️"},{"name":"Stable Diffusion","rating":4.4,"logo":"🎭"},{"name":"Canva AI","rating":4.3,"logo":"🎨"}]',
  ARRAY['AI Art', 'Image Generation', 'Design', 'Creative', 'Text-to-Image']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'GitHub Copilot',
  '💻',
  'AI-powered code completion and pair programming assistant',
  'GitHub Copilot is an AI-powered code completion tool that helps developers write code faster and more efficiently. It uses machine learning to understand context and suggest relevant code snippets, function implementations, and even entire functions. It works as an extension in popular IDEs and can significantly speed up development workflows.',
  'Development',
  4.5,
  2156,
  18920,
  '+67%',
  'https://github.com/features/copilot',
  'Paid',
  ARRAY['AI code completion', 'Multi-language support', 'IDE integration', 'Context-aware suggestions', 'Documentation generation', 'Test case generation', 'Code explanation'],
  ARRAY['Significantly speeds up coding', 'Excellent code quality', 'Multi-language support', 'Seamless IDE integration', 'Learns from your coding style', 'Reduces repetitive coding tasks'],
  ARRAY['Subscription cost', 'Can suggest incorrect code', 'Requires good prompts', 'May not work well with custom frameworks', 'Privacy concerns with code sharing'],
  '[{"name":"Cursor","rating":4.4,"logo":"⌨️"},{"name":"Tabnine","rating":4.2,"logo":"🤖"},{"name":"CodeWhisperer","rating":4.3,"logo":"☁️"}]',
  ARRAY['AI', 'Coding', 'Development', 'IDE', 'Code Completion', 'GitHub']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Notion AI',
  '📝',
  'AI-powered productivity and note-taking platform',
  'Notion AI enhances the popular Notion workspace with artificial intelligence capabilities. It can help users write, edit, brainstorm, and organize content more efficiently. The AI can generate content, summarize text, create outlines, and even help with project management tasks, making it a powerful tool for teams and individuals.',
  'Productivity',
  4.4,
  1567,
  11230,
  '+28%',
  'https://notion.so',
  'Freemium',
  ARRAY['AI-powered writing assistance', 'Content generation', 'Text summarization', 'Brainstorming tools', 'Project management', 'Database organization', 'Collaboration features'],
  ARRAY['Seamless integration with Notion', 'Excellent for content creation', 'Good for team collaboration', 'Flexible workspace', 'Regular feature updates', 'Strong community'],
  ARRAY['AI features require subscription', 'Learning curve for complex features', 'Can be overwhelming for simple use cases', 'Limited offline functionality'],
  '[{"name":"Obsidian","rating":4.3,"logo":"💎"},{"name":"Roam Research","rating":4.2,"logo":"🧠"},{"name":"Logseq","rating":4.1,"logo":"📊"}]',
  ARRAY['AI', 'Productivity', 'Note-taking', 'Collaboration', 'Workspace']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Jasper',
  '✍️',
  'AI writing assistant for content creation and marketing',
  'Jasper is a comprehensive AI writing platform designed specifically for marketers, content creators, and businesses. It can generate various types of content including blog posts, social media content, marketing copy, emails, and more. The platform includes templates, brand voice customization, and collaboration features.',
  'Marketing',
  4.3,
  2341,
  9870,
  '+41%',
  'https://jasper.ai',
  'Paid',
  ARRAY['Content generation', 'Marketing copy creation', 'Blog post writing', 'Social media content', 'Email marketing', 'Brand voice customization', 'SEO optimization'],
  ARRAY['Excellent for marketing content', 'Wide variety of templates', 'Good brand voice features', 'SEO-friendly content', 'Collaboration tools', 'Regular updates'],
  ARRAY['Can be expensive for small teams', 'Content can be generic', 'Requires editing and review', 'Limited free trial'],
  '[{"name":"Copy.ai","rating":4.2,"logo":"📄"},{"name":"Writesonic","rating":4.1,"logo":"✏️"},{"name":"ContentBot","rating":4,"logo":"🤖"}]',
  ARRAY['AI', 'Writing', 'Marketing', 'Content Creation', 'Copywriting']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Synthesia',
  '🎬',
  'AI video creation platform with virtual avatars',
  'Synthesia is an AI-powered video creation platform that allows users to create professional videos using virtual avatars and AI-generated speech. It''s particularly useful for training videos, presentations, marketing content, and educational materials. The platform offers a wide range of avatars, languages, and customization options.',
  'Video',
  4.2,
  892,
  6540,
  '+38%',
  'https://synthesia.io',
  'Paid',
  ARRAY['AI avatar generation', 'Text-to-speech', 'Video templates', 'Multi-language support', 'Custom branding', 'Screen recording', 'Collaboration tools'],
  ARRAY['Professional-looking videos', 'Wide range of avatars', 'Multi-language support', 'Easy to use', 'Good for training content', 'Customizable branding'],
  ARRAY['Can be expensive', 'Limited free trial', 'Avatar movements can be robotic', 'Requires good script writing'],
  '[{"name":"Lumen5","rating":4.1,"logo":"🎥"},{"name":"InVideo","rating":4,"logo":"📹"},{"name":"Pictory","rating":4.2,"logo":"🎬"}]',
  ARRAY['AI', 'Video', 'Avatar', 'Text-to-Speech', 'Training']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Grammarly',
  '📝',
  'AI-powered writing assistant for grammar and style improvement',
  'Grammarly is a comprehensive writing assistant that uses AI to check grammar, spelling, punctuation, and style. It provides real-time suggestions to improve writing clarity, tone, and effectiveness. The tool works across various platforms including web browsers, Microsoft Office, and mobile devices.',
  'Writing',
  4.6,
  3456,
  22340,
  '+23%',
  'https://grammarly.com',
  'Freemium',
  ARRAY['Grammar checking', 'Spell checking', 'Style suggestions', 'Tone detection', 'Plagiarism detection', 'Writing insights', 'Multi-platform support'],
  ARRAY['Excellent grammar checking', 'Real-time suggestions', 'Works across platforms', 'Good free version', 'Detailed explanations', 'Tone and style analysis'],
  ARRAY['Premium features are expensive', 'Can be overly aggressive', 'May suggest unnecessary changes', 'Privacy concerns with text analysis'],
  '[{"name":"ProWritingAid","rating":4.4,"logo":"✍️"},{"name":"Hemingway Editor","rating":4.2,"logo":"📖"},{"name":"LanguageTool","rating":4.3,"logo":"🔧"}]',
  ARRAY['AI', 'Writing', 'Grammar', 'Spelling', 'Style', 'Editing']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Otter.ai',
  '🎤',
  'AI-powered meeting transcription and note-taking',
  'Otter.ai is an AI-powered transcription service that automatically transcribes meetings, interviews, and conversations in real-time. It can identify different speakers, create searchable transcripts, and generate meeting summaries. The platform is particularly useful for teams that need to capture and review meeting content.',
  'Productivity',
  4.3,
  1876,
  8760,
  '+34%',
  'https://otter.ai',
  'Freemium',
  ARRAY['Real-time transcription', 'Speaker identification', 'Meeting summaries', 'Searchable transcripts', 'Integration with Zoom', 'Collaboration tools', 'Export options'],
  ARRAY['Accurate transcription', 'Real-time capabilities', 'Good speaker identification', 'Easy integration', 'Searchable content', 'Meeting insights'],
  ARRAY['Requires good audio quality', 'Limited free minutes', 'Can miss technical terms', 'Privacy concerns with sensitive content'],
  '[{"name":"Rev","rating":4.4,"logo":"🎧"},{"name":"Temi","rating":4.1,"logo":"📝"},{"name":"Trint","rating":4.2,"logo":"🎤"}]',
  ARRAY['AI', 'Transcription', 'Meetings', 'Productivity', 'Voice Recognition']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Canva AI',
  '🎨',
  'AI-powered design tools for graphics and presentations',
  'Canva AI enhances the popular design platform with artificial intelligence capabilities. It can generate images, suggest design layouts, create color palettes, and even write copy for designs. The AI features make it easier for non-designers to create professional-looking graphics and presentations.',
  'Design',
  4.4,
  2987,
  15670,
  '+29%',
  'https://canva.com',
  'Freemium',
  ARRAY['AI image generation', 'Design suggestions', 'Layout optimization', 'Color palette generation', 'Copy writing', 'Background removal', 'Template recommendations'],
  ARRAY['Easy to use', 'Excellent templates', 'AI enhances creativity', 'Good for beginners', 'Collaboration features', 'Regular updates'],
  ARRAY['AI features require subscription', 'Limited customization', 'Can be resource-intensive', 'May not replace professional designers'],
  '[{"name":"Figma","rating":4.5,"logo":"🎯"},{"name":"Adobe Creative Suite","rating":4.6,"logo":"🎨"},{"name":"Sketch","rating":4.3,"logo":"✏️"}]',
  ARRAY['AI', 'Design', 'Graphics', 'Presentations', 'Templates']
);


INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  'Copy.ai',
  '📄',
  'AI copywriting platform for marketing and business content',
  'Copy.ai is an AI-powered copywriting platform that helps businesses create compelling marketing copy, product descriptions, social media content, and other business communications. It uses advanced language models to generate human-like copy that resonates with target audiences.',
  'Marketing',
  4.2,
  1654,
  7430,
  '+36%',
  'https://copy.ai',
  'Freemium',
  ARRAY['Marketing copy generation', 'Product descriptions', 'Social media content', 'Email marketing', 'Blog post writing', 'Brand voice training', 'A/B testing suggestions'],
  ARRAY['Good for marketing copy', 'Easy to use', 'Multiple content types', 'Brand voice features', 'Regular updates', 'Good templates'],
  ARRAY['Content can be generic', 'Requires editing', 'Limited free credits', 'May not capture brand voice perfectly'],
  '[{"name":"Jasper","rating":4.3,"logo":"✍️"},{"name":"Writesonic","rating":4.1,"logo":"✏️"},{"name":"ContentBot","rating":4,"logo":"🤖"}]',
  ARRAY['AI', 'Copywriting', 'Marketing', 'Content', 'Business']
);