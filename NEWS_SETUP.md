# AI News Page Setup Guide

## Overview

The AI News page provides real-time updates on:
- **AI News**: Latest developments in artificial intelligence
- **Tool Updates**: Updates about tools integrated on VaultX
- **Industry News**: AI industry trends and developments

## Features

### ✅ Real-time News
- Fetches latest AI news from NewsAPI
- Auto-refreshes every 5 minutes
- Manual refresh button
- Fallback news when API is unavailable

### ✅ Tool Updates
- Shows recent updates to tools in your database
- Displays impact level (major/minor/new)
- Real-time from your Supabase database

### ✅ Advanced Filtering
- Filter by category (All, AI News, Tool Updates, Industry)
- Search functionality across titles, descriptions, and tags
- Responsive design for all devices

### ✅ User Experience
- Loading states and error handling
- Last updated timestamp
- Trending topics sidebar
- Clean, modern UI

## Setup Instructions

### 1. Get News API Key (Optional)

For real-time news, get a free API key from [NewsAPI](https://newsapi.org/):

1. Go to https://newsapi.org/
2. Sign up for a free account
3. Get your API key
4. Add to your `.env.local`:

```bash
NEXT_PUBLIC_NEWS_API_KEY=your-api-key-here
```

**Note**: The page works without an API key using fallback news data.

### 2. Environment Variables

Add to your `.env.local`:

```bash
# News API (optional)
NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key-here
```

### 3. Database Setup

The tool updates are automatically pulled from your existing `tools` table. No additional setup required.

### 4. Navigation

The "News" link has been added to the main navigation. Users can access it at `/news`.

## How It Works

### News Sources
1. **NewsAPI**: Real-time AI news (when API key is provided)
2. **Fallback News**: Curated AI news when API is unavailable
3. **Tool Updates**: Real-time from your Supabase database
4. **Industry News**: AI industry developments

### Auto-refresh
- News refreshes automatically every 5 minutes
- Manual refresh button available
- Shows last updated timestamp

### Categories
- **AI News**: Latest AI model releases and breakthroughs
- **Tool Updates**: Updates to tools in your database
- **Industry**: AI industry trends and business news

## Customization

### Adding More News Sources

Edit `app/news/NewsClient.tsx` to add more news sources:

```typescript
// Add new fetch function
const fetchCustomNews = async () => {
  // Your custom news fetching logic
};
```

### Modifying Fallback News

Edit `app/news/fallbackNews.ts` to update the fallback news content.

### Styling

The page uses Tailwind CSS classes. Customize the styling in `app/news/NewsClient.tsx`.

## API Endpoints

### `/api/news`
- GET: Fetches news from NewsAPI or returns fallback data
- Used as an alternative to client-side fetching

## Troubleshooting

### News Not Loading
1. Check if NewsAPI key is valid
2. Verify network connectivity
3. Check browser console for errors
4. Fallback news should load automatically

### Tool Updates Not Showing
1. Verify Supabase connection
2. Check if tools table has recent updates
3. Ensure RLS policies allow reading tools

### Performance Issues
1. News auto-refresh is set to 5 minutes
2. Consider increasing interval if needed
3. API calls are cached to prevent excessive requests

## Future Enhancements

- [ ] Add news bookmarking
- [ ] Email newsletter integration
- [ ] Social media sharing
- [ ] News categories and tags
- [ ] User preferences for news sources
- [ ] News analytics and trending topics

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure Supabase connection is working
4. Test with fallback news (remove API key temporarily) 