# 📰 AI News & Tools Automation System

A comprehensive automation system that pulls in trending AI tools and news from multiple sources daily, keeping your platform fresh and up-to-date.

## 🚀 Features

### **AI Tools Automation**
- **Multi-Source Discovery**: GitHub, Product Hunt, Reddit, News APIs
- **Smart Categorization**: Automatic categorization based on tool type
- **Deduplication**: Prevents duplicate tools
- **Rating Calculation**: Converts popularity metrics to ratings
- **User Estimation**: Estimates weekly users based on engagement

### **AI News Automation**
- **News Aggregation**: Reddit, TechCrunch, Hacker News, ArXiv, News API
- **Sentiment Analysis**: Automatically detects positive/negative/neutral sentiment
- **Topic Extraction**: Identifies key AI topics and entities
- **Read Time Calculation**: Estimates reading time for articles
- **Engagement Tracking**: Tracks engagement metrics

### **Combined System**
- **Unified Scheduling**: Runs both tools and news automation daily
- **Comprehensive Reporting**: Detailed reports for both systems
- **Error Handling**: Robust error handling and recovery
- **Admin Dashboard**: Web interface for monitoring and control

## 📊 Data Sources

### **AI Tools Sources**
1. **GitHub API**: Trending AI repositories
2. **Product Hunt**: Popular AI products
3. **Reddit**: AI discussions and tool mentions
4. **News API**: AI-related news articles

### **AI News Sources**
1. **Reddit r/artificial**: AI community discussions
2. **TechCrunch**: Tech industry news
3. **Hacker News**: Tech community stories
4. **ArXiv**: AI research papers
5. **News API**: General AI news

## 🛠️ Installation & Setup

### **1. Install Dependencies**
```bash
npm install node-cron axios cheerio
```

### **2. Environment Variables**
Add to your `.env.local` file:
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (for enhanced functionality)
GITHUB_TOKEN=your_github_token
NEWS_API_KEY=your_news_api_key
```

### **3. Create Logs Directory**
```bash
mkdir logs
```

## 🎯 Usage Commands

### **Individual Automation**
```bash
# Run AI tools automation only
npm run automation:run

# Run AI news automation only
npm run automation:news

# Run combined automation (both tools and news)
npm run automation:combined
```

### **Scheduled Automation**
```bash
# Start daily scheduler (runs at 6 AM UTC)
npm run automation:start

# Check automation status
npm run automation:status
```

### **Testing & Setup**
```bash
# Test the automation system
npm run automation:test

# Setup news database (if needed)
npm run setup:news-db
```

## 📈 What Gets Collected

### **AI Tools Data**
- **Basic Info**: Name, description, website, logo
- **Metrics**: Rating, weekly users, growth percentage
- **Categorization**: Language, Design, Development, etc.
- **Pricing**: Free, Freemium, Paid
- **Source**: Where the tool was discovered

### **AI News Data**
- **Article Info**: Title, content, URL, author
- **Metadata**: Published date, read time, engagement
- **Analysis**: Sentiment, topics, category
- **Source**: News source and credibility
- **Processing**: Cleaned and categorized content

## 🔧 Configuration

### **Automation Settings**
Edit `scripts/ai-tools-automation.js` and `scripts/ai-news-automation.js`:

```javascript
const config = {
  maxToolsPerRun: 50,    // Max tools per automation run
  maxNewsPerRun: 50,     // Max news articles per run
  sources: {
    // Configure data sources
  }
};
```

### **Schedule Settings**
Edit `scripts/scheduler.js`:
```javascript
// Daily at 6 AM UTC
const schedule = '0 6 * * *';

// Every 6 hours
const schedule = '0 */6 * * *';

// Weekdays only
const schedule = '0 6 * * 1-5';
```

## 📊 Monitoring & Reports

### **Generated Reports**
- `logs/automation-report.json` - AI tools automation report
- `logs/news-automation-report.json` - AI news automation report
- `logs/combined-automation-report.json` - Combined system report

### **Report Structure**
```json
{
  "timestamp": "2025-07-20T21:51:18.831Z",
  "tools": {
    "success": true,
    "count": "completed",
    "errors": []
  },
  "news": {
    "success": true,
    "count": "completed",
    "errors": []
  },
  "duration": 14764
}
```

### **Admin Dashboard**
Access at `http://localhost:3000/admin/automation`:
- Real-time status monitoring
- Manual trigger controls
- Historical data viewing
- Source breakdown statistics
- Error tracking and reporting

## 🎨 Frontend Integration

### **AI News Feed Component**
```tsx
import AINewsFeed from '@/components/AINewsFeed';

// Basic usage
<AINewsFeed limit={10} />

// With filters
<AINewsFeed 
  limit={20} 
  showFilters={true} 
  category="Language Models" 
/>
```

### **News Page**
Visit `/news` to see the AI news feed with:
- Search functionality
- Category filtering
- Source filtering
- Sorting options
- Sentiment indicators

## 🔒 Security & Privacy

### **Data Protection**
- **Input Sanitization**: All content is cleaned and validated
- **Rate Limiting**: Respectful API usage
- **Error Handling**: Graceful failure handling
- **Access Control**: Admin-only automation controls

### **API Security**
- **Authentication**: Supabase authentication required
- **Role-Based Access**: Admin-only automation triggers
- **Environment Variables**: Secure credential management

## 🚨 Troubleshooting

### **Common Issues**

1. **GitHub API 401 Error**:
   ```bash
   # Add GitHub token to .env.local
   GITHUB_TOKEN=your_github_personal_access_token
   ```

2. **News API 401 Error**:
   ```bash
   # Add News API key to .env.local
   NEWS_API_KEY=your_news_api_key
   ```

3. **Database Connection Issues**:
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure database permissions

4. **Scheduler Not Running**:
   - Check cron syntax
   - Verify process is running
   - Check timezone settings

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=automation:* npm run automation:combined
```

### **Manual Database Check**
```sql
-- Check recent tools
SELECT COUNT(*) FROM tools WHERE created_at > NOW() - INTERVAL '1 day';

-- Check recent news
SELECT COUNT(*) FROM ai_news WHERE created_at > NOW() - INTERVAL '1 day';
```

## 📝 Customization

### **Adding New Data Sources**
1. Add source to `config.sources`
2. Create fetch function in `newsSources` or `dataSources`
3. Add to main automation function
4. Update categorization logic

### **Custom Categorization**
```javascript
categorizeNews(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  // Add your custom logic
  if (text.includes('your-keyword')) return 'Your Category';
  
  return 'General AI';
}
```

### **Custom Scheduling**
```javascript
// Multiple times per day
const schedule = '0 6,12,18 * * *';

// Weekends only
const schedule = '0 6 * * 6,0';

// Custom timezone
const schedule = '0 6 * * *';
const timezone = 'America/New_York';
```

## 🔄 Maintenance

### **Regular Tasks**
1. **Monitor Logs**: Check for errors weekly
2. **Update Dependencies**: Keep packages updated
3. **Review Data Quality**: Check categorization accuracy
4. **API Limits**: Monitor rate limit usage
5. **Database Cleanup**: Remove old/duplicate data

### **Performance Optimization**
1. **Parallel Processing**: Fetch from multiple sources simultaneously
2. **Caching**: Cache API responses
3. **Batch Operations**: Bulk database operations
4. **Connection Pooling**: Optimize database connections

## 📞 Support

### **Getting Help**
1. Check the troubleshooting section
2. Review logs in `logs/` directory
3. Verify environment variables
4. Check API keys and permissions

### **Success Metrics**
Track these metrics to measure automation success:
- **Tools Added**: Number of new tools per day
- **News Articles**: Number of news articles per day
- **Data Quality**: Accuracy of categorization
- **Uptime**: Automation reliability
- **Coverage**: Content from different sources
- **User Engagement**: Content discovery vs. usage

## 🎉 Benefits

### **For Your Platform**
- **Always Fresh Content**: Daily updates keep your platform current
- **Comprehensive Coverage**: Multiple sources ensure diverse content
- **Minimal Maintenance**: Fully automated with monitoring
- **Scalable**: Easy to add new sources and features
- **User Engagement**: Fresh content drives user engagement

### **For Your Users**
- **Latest AI Tools**: Discover new tools as they emerge
- **Breaking News**: Stay informed about AI developments
- **Curated Content**: Smart categorization and filtering
- **Quality Content**: Cleaned and validated information
- **Personalized Experience**: Filter by interests and preferences

---

**Happy Automating! 🤖📰✨** 