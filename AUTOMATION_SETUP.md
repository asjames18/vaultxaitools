# 🤖 AI Tools Automation System

This automation system automatically discovers and updates trending AI tools from multiple sources daily, keeping your AI tools database fresh and up-to-date.

## 🚀 Features

- **Multi-Source Data Collection**: Fetches from GitHub, Product Hunt, Reddit, and News APIs
- **Smart Categorization**: Automatically categorizes tools based on name and description
- **Deduplication**: Prevents duplicate tools from being added
- **Daily Scheduling**: Runs automatically every day at 6:00 AM UTC
- **Admin Dashboard**: Web interface to monitor and control automation
- **Detailed Reporting**: Generates comprehensive reports of each run
- **Error Handling**: Robust error handling and logging

## 📋 Prerequisites

1. **Environment Variables**: Add these to your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub API (for repository data)
GITHUB_TOKEN=your_github_token

# News API (optional, for news articles)
NEWS_API_KEY=your_news_api_key

# OpenAI API (optional, for enhanced categorization)
OPENAI_API_KEY=your_openai_api_key
```

2. **Database Setup**: Ensure your Supabase database has the required tables:
   - `tools` table with all necessary columns
   - `categories` table for tool categorization

## 🛠️ Installation

1. **Install Dependencies**:
```bash
npm install
```

2. **Install Automation Dependencies**:
```bash
npm install node-cron axios cheerio
```

3. **Create Logs Directory**:
```bash
mkdir logs
```

## 🎯 Usage

### Manual Execution

Run the automation manually:
```bash
npm run automation:run
```

### Scheduled Execution

Start the scheduler for daily automation:
```bash
npm run automation:start
```

### Check Status

Check automation status:
```bash
npm run automation:status
```

### Admin Dashboard

Access the automation dashboard at:
```
http://localhost:3000/admin/automation
```

## 📊 Data Sources

### 1. GitHub
- **What**: Trending AI repositories
- **Data**: Repository name, description, stars, language
- **Rate Limit**: 5000 requests/hour (with token)
- **Frequency**: Daily

### 2. Product Hunt
- **What**: Trending AI products
- **Data**: Product name, description, votes, category
- **Rate Limit**: Respectful scraping
- **Frequency**: Daily

### 3. Reddit
- **What**: AI discussions and tool mentions
- **Data**: Post titles, content, upvotes
- **Rate Limit**: Respectful API usage
- **Frequency**: Daily

### 4. News API
- **What**: AI-related news articles
- **Data**: Article titles, descriptions, URLs
- **Rate Limit**: 1000 requests/day (free tier)
- **Frequency**: Daily

## 🔧 Configuration

### Automation Settings

Edit `scripts/ai-tools-automation.js` to modify:

- **Max tools per run**: `config.maxToolsPerRun`
- **Data sources**: `config.sources`
- **Categorization logic**: `helpers.categorizeTool()`
- **Logo generation**: `helpers.generateLogo()`

### Schedule Settings

Edit `scripts/scheduler.js` to modify:

- **Schedule**: `schedule` variable (cron format)
- **Timezone**: `timezone` option
- **Error handling**: Add custom error handling

## 📈 Monitoring

### Logs

Automation logs are stored in:
- `logs/automation-report.json` - Detailed run reports
- Console output - Real-time execution logs

### Metrics Tracked

- Total tools discovered
- Tools by source
- Tools by category
- New vs updated tools
- Error rates
- Execution time

### Admin Dashboard Features

- **Real-time Status**: Current automation status
- **Historical Data**: Last run information
- **Manual Trigger**: Run automation on-demand
- **Source Breakdown**: Tools by data source
- **Category Breakdown**: Tools by category
- **Schedule Info**: Next scheduled run

## 🔒 Security

### Authentication

- Admin-only access to automation controls
- Supabase authentication required
- Role-based access control

### API Rate Limiting

- Respectful API usage
- Exponential backoff on errors
- Request throttling

### Data Validation

- Input sanitization
- Duplicate prevention
- Data quality checks

## 🚨 Troubleshooting

### Common Issues

1. **GitHub API Rate Limit**:
   - Solution: Use GitHub token
   - Check: `GITHUB_TOKEN` environment variable

2. **Supabase Connection**:
   - Solution: Verify environment variables
   - Check: Database permissions

3. **Scheduler Not Running**:
   - Solution: Check cron syntax
   - Check: Process is running

4. **No Tools Found**:
   - Solution: Check API responses
   - Check: Network connectivity

### Debug Mode

Enable debug logging:
```bash
DEBUG=automation:* npm run automation:run
```

### Manual Database Check

Check database directly:
```sql
SELECT COUNT(*) FROM tools WHERE created_at > NOW() - INTERVAL '1 day';
```

## 📝 Customization

### Adding New Data Sources

1. Add source to `config.sources`
2. Create fetch function in `dataSources`
3. Add to `runAutomation()` function
4. Update categorization logic

### Custom Categorization

Modify `helpers.categorizeTool()`:
```javascript
categorizeTool(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  // Add your custom logic here
  if (text.includes('your-keyword')) return 'Your Category';
  
  return 'Other';
}
```

### Custom Scheduling

Modify cron schedule in `scheduler.js`:
```javascript
// Run every 6 hours
const schedule = '0 */6 * * *';

// Run on weekdays only
const schedule = '0 6 * * 1-5';

// Run twice daily
const schedule = '0 6,18 * * *';
```

## 🔄 Maintenance

### Regular Tasks

1. **Monitor Logs**: Check for errors weekly
2. **Update Dependencies**: Keep packages updated
3. **Review Data Quality**: Check categorization accuracy
4. **API Limits**: Monitor rate limit usage
5. **Database Cleanup**: Remove old/duplicate data

### Performance Optimization

1. **Parallel Processing**: Fetch from multiple sources simultaneously
2. **Caching**: Cache API responses
3. **Batch Operations**: Bulk database operations
4. **Connection Pooling**: Optimize database connections

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review logs in `logs/` directory
3. Check environment variables
4. Verify API keys and permissions

## 🎉 Success Metrics

Track these metrics to measure automation success:

- **Tools Added**: Number of new tools per day
- **Data Quality**: Accuracy of categorization
- **Uptime**: Automation reliability
- **Coverage**: Tools from different sources
- **User Engagement**: Tools discovered vs. used

---

**Happy Automating! 🤖✨** 