# AI Data Fetching System

This document explains how to use the AI data fetching scripts to populate your database with real AI product information, reviews, and live data from external sources.

## Overview

The AI data fetching system consists of three main scripts:

1. **`fetch-real-ai-data.js`** - Seeds the database with comprehensive real AI tools data
2. **`fetch-live-ai-data.js`** - Fetches live data from external APIs and sources
3. **`update-ai-data.js`** - Main script that runs both above scripts and updates statistics

## Quick Start

### 1. Set up Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PRODUCT_HUNT_TOKEN=your_product_hunt_token  # Optional
```

### 2. Run the Complete Data Update

```bash
npm run update:ai-data
```

This will:
- Seed the database with real AI tools data
- Fetch live data from external sources
- Update database statistics
- Update the `data/tools.json` file

## Individual Scripts

### Seed Real AI Data

```bash
npm run seed:ai-data
```

This script populates your database with comprehensive information about popular AI tools including:

- **Tools**: ChatGPT, Midjourney, GitHub Copilot, Notion AI, Jasper, etc.
- **Details**: Descriptions, features, pros/cons, pricing, alternatives
- **Metrics**: Ratings, review counts, weekly users, growth rates
- **Reviews**: Realistic user reviews with ratings and helpful votes

### Fetch Live Data

```bash
npm run fetch:live-data
```

This script fetches live data from external sources:

- **Product Hunt API** - Latest AI tools and products
- **G2 Reviews** - Real user ratings and reviews (simulated)
- **Capterra** - Business software reviews (simulated)
- **Trending Tools** - Current trending AI tools

### Seed Database Schema

```bash
npm run seed:database
```

This script sets up the basic database schema and categories.

## Data Sources

### Real AI Tools Data

The system includes comprehensive data for popular AI tools:

| Tool | Category | Rating | Features |
|------|----------|--------|----------|
| ChatGPT | Language | 4.8 | Natural language conversations, Code generation |
| Midjourney | Design | 4.6 | Text-to-image generation, High-resolution outputs |
| GitHub Copilot | Development | 4.5 | AI code completion, Multi-language support |
| Notion AI | Productivity | 4.4 | AI writing assistance, Content generation |
| Jasper | Marketing | 4.3 | Content creation, Marketing copy |
| Grammarly | Writing | 4.6 | Grammar checking, Style suggestions |
| Otter.ai | Productivity | 4.3 | Meeting transcription, Speaker identification |
| Canva AI | Design | 4.4 | AI image generation, Design suggestions |
| Copy.ai | Marketing | 4.2 | Copywriting, Content generation |
| Synthesia | Video | 4.2 | AI video creation, Virtual avatars |

### External APIs

#### Product Hunt API
- Fetches latest AI tools and products
- Includes ratings, descriptions, and website links
- Requires API token (optional)

#### G2 Reviews (Simulated)
- Realistic business software reviews
- User ratings and feedback
- Category-specific insights

#### Capterra (Simulated)
- Business software recommendations
- Pricing information
- User testimonials

## Database Schema

### Tools Table

```sql
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

### Reviews Table

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date TEXT NOT NULL,
    comment TEXT NOT NULL,
    helpful INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Categories

The system includes the following AI tool categories:

- **Language** - AI chatbots, text generation, translation
- **Design** - AI art generation, design tools, graphics
- **Development** - AI coding assistants, debugging tools
- **Productivity** - AI assistants, note-taking, organization
- **Marketing** - AI copywriting, content creation
- **Writing** - Grammar checking, style improvement
- **Video** - AI video creation, editing tools
- **Audio** - AI audio processing, music generation
- **Data** - AI data analysis, visualization

## Customization

### Adding New Tools

To add new AI tools, edit the `realAITools` array in `scripts/fetch-real-ai-data.js`:

```javascript
{
  name: "Your AI Tool",
  logo: "🎯",
  description: "Brief description",
  long_description: "Detailed description...",
  category: "Category Name",
  rating: 4.5,
  review_count: 1000,
  weekly_users: 5000,
  growth: "+25%",
  website: "https://example.com",
  pricing: "Freemium",
  features: ["Feature 1", "Feature 2"],
  pros: ["Pro 1", "Pro 2"],
  cons: ["Con 1", "Con 2"],
  alternatives: [
    { name: "Alternative", rating: 4.3, logo: "🔧" }
  ],
  tags: ["AI", "Category", "Tags"]
}
```

### Adding New Data Sources

To add new external data sources, edit `scripts/fetch-live-ai-data.js`:

```javascript
async function fetchNewSourceData() {
  // Your API call logic here
  return data;
}
```

### Customizing Reviews

To customize review generation, edit the `generateReviews` function in `scripts/fetch-live-ai-data.js`.

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   Error: Missing Supabase URL or Service Role Key
   ```
   Solution: Set up your `.env.local` file with the required variables.

2. **Database Connection Issues**
   ```
   Error: Error fetching tools
   ```
   Solution: Check your Supabase credentials and network connection.

3. **API Rate Limits**
   ```
   Error: Rate limit exceeded
   ```
   Solution: Wait and retry, or check your API token limits.

### Debug Mode

To run scripts in debug mode, add console logging:

```javascript
console.log('Debug: Processing tool:', tool.name);
```

## Best Practices

1. **Regular Updates**: Run the update script weekly to keep data fresh
2. **Backup**: Always backup your database before running updates
3. **Testing**: Test scripts in a development environment first
4. **Monitoring**: Monitor API rate limits and database performance
5. **Validation**: Verify data quality after updates

## API Keys and Limits

### Product Hunt API
- **Rate Limit**: 1000 requests per hour
- **Authentication**: Bearer token required
- **Endpoint**: GraphQL API

### G2 API (Simulated)
- Currently using simulated data
- Can be replaced with real G2 API when available

### Capterra API (Simulated)
- Currently using simulated data
- Can be replaced with real Capterra API when available

## Support

For issues or questions about the AI data fetching system:

1. Check the troubleshooting section above
2. Review the script logs for error messages
3. Verify your environment variables
4. Test with a small dataset first

## Contributing

To contribute to the AI data fetching system:

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly
5. Submit a pull request

## License

This AI data fetching system is part of the VaultX AI Tools project and follows the same license terms. 