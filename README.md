# VaultX AI Tools

A comprehensive directory and discovery platform for AI tools, built with Next.js, Express.js, and Supabase.

## Features

### 🔥 Dynamic Trending System
- **Real-time Trending Algorithm**: Sophisticated scoring system based on multiple factors:
  - User ratings (25% weight)
  - Review count (20% weight) 
  - Weekly user engagement (25% weight)
  - Growth rate (20% weight)
  - Recency factor (10% weight)
- **Time-based Filtering**: View trending tools by day, week, or month
- **Trending Categories**: See which categories are gaining popularity
- **Trending Insights**: Analytics showing most popular, fastest growing, highest rated, and most reviewed tools
- **Visual Indicators**: Trending badges (🔥 Hot, ⚡ Rising, 📈 Trending, ⭐ Popular) and growth indicators

### 💎 Affiliate & Sponsored Content System
- **Affiliate Link Tracking**: Automatic UTM parameter generation and click tracking
- **Sponsored Content Slots**: Dedicated placement areas for sponsored tools with clear disclosure
- **Transparent Disclosure**: Clear labeling of sponsored content and affiliate links
- **Performance Analytics**: Track clicks, impressions, and revenue from affiliate links
- **Admin Management**: Complete admin interface for managing sponsored slots and affiliate performance
- **Multiple Placement Options**: Top banner, sidebar, category pages, and search results
- **Revenue Tracking**: Monitor affiliate earnings and conversion rates

### 🎯 Advanced Search & Filtering
- **Instant Search**: Real-time search across tool names, descriptions, and categories
- **Multi-field Filtering**: Filter by category, rating, pricing, and popularity
- **Advanced Filters**: Category multi-select, rating slider, pricing filter
- **Sorting Options**: Sort by rating, popularity, growth, or alphabetical order
- **Active Filter Display**: Clear visual indication of applied filters
- **Responsive Design**: Works seamlessly on desktop and mobile

### ⭐ Rating & Review System
- **User Reviews**: Submit ratings (1-5 stars) and written reviews
- **Review Management**: View, edit, and delete reviews
- **Helpful Voting**: Users can mark reviews as helpful
- **Quick Voting**: Simple thumbs up/down voting system
- **Review Analytics**: Track review counts and average ratings
- **Real-time Updates**: Reviews update immediately without page refresh

### 📊 Comprehensive Tool Database
- **Live Data**: All tools fetched from Supabase database
- **Rich Metadata**: Detailed tool information including pricing, features, and usage statistics
- **Category Organization**: Tools organized into logical categories
- **Growth Tracking**: Monitor tool popularity and user engagement trends
- **SEO Optimized**: Each tool has dedicated pages with proper metadata

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for all device sizes
- **Dark Mode Support**: Automatic theme switching
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Proper loading indicators and skeleton screens
- **Error Handling**: Graceful error states and fallbacks

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern state management
- **Supabase Client**: Real-time database integration

### Backend
- **Express.js**: Node.js web framework
- **Supabase**: PostgreSQL database with real-time features
- **JWT Authentication**: Secure user authentication
- **RESTful API**: Clean API design

### Database
- **PostgreSQL**: Robust relational database
- **Real-time Subscriptions**: Live data updates
- **Row Level Security**: Data protection
- **Automatic Backups**: Data safety

## Trending Algorithm

The trending system uses a sophisticated scoring algorithm that considers multiple factors:

```typescript
const calculateTrendingScore = (tool: Tool) => {
  const growthRate = parseFloat(tool.growth.replace('%', ''));
  
  // Rating factor (25% weight)
  const ratingScore = (tool.rating / 5) * 0.25;
  
  // Review count factor (20% weight)
  const reviewScore = Math.min(tool.reviewCount / 100, 1) * 0.20;
  
  // User engagement factor (25% weight)
  const userScore = Math.min(tool.weeklyUsers / 10000, 1) * 0.25;
  
  // Growth factor (20% weight)
  const growthScore = Math.max(growthRate / 100, 0) * 0.20;
  
  // Recency factor (10% weight)
  const recencyScore = 0.10;
  
  return ratingScore + reviewScore + userScore + growthScore + recencyScore;
};
```

### Trending Features

1. **Time-based Filtering**: Different weights for day/week/month views
2. **Category Trending**: Aggregate trending scores by category
3. **Trending Insights**: Analytics dashboard with key metrics
4. **Visual Indicators**: Color-coded badges and growth indicators
5. **Real-time Updates**: Trending data updates as user interactions change

## Affiliate System

The affiliate system provides comprehensive tracking and management capabilities:

### Affiliate Link Generation
```typescript
const affiliateUrl = generateAffiliateUrl(
  originalUrl, 
  toolId, 
  config
);
// Adds UTM parameters: utm_source=vaultx&utm_medium=affiliate&utm_campaign=ai-tools&utm_content=toolId&ref=vaultx
```

### Sponsored Content Management
- **Multiple Placement Options**: Top banner, sidebar, category pages, search results
- **Scheduling**: Set start and end dates for sponsored campaigns
- **Priority System**: Manage multiple sponsored slots with priority levels
- **Performance Tracking**: Monitor impressions, clicks, and conversion rates
- **Budget Management**: Track campaign budgets and spending

### Disclosure & Transparency
- **Clear Labeling**: Sponsored content clearly marked with 💎 badges
- **Hover Disclosures**: Tooltips explaining affiliate relationships
- **Admin Controls**: Toggle disclosure visibility and customize messages
- **Compliance**: Built-in features for FTC and advertising compliance

### Analytics & Reporting
- **Click Tracking**: Monitor affiliate link performance
- **Revenue Analytics**: Track earnings and conversion rates
- **Performance Metrics**: CTR, impressions, and engagement data
- **Admin Dashboard**: Comprehensive reporting interface

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vaultxaitools.git
   cd vaultxaitools
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Add your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the backend server** (in a new terminal)
   ```bash
   cd server
   npm install
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
vaultxaitools/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── trending/          # Trending page with dynamic algorithms
│   │   ├── search/            # Advanced search functionality
│   │   ├── tool/[id]/         # Individual tool pages with reviews
│   │   ├── categories/        # Category browsing
│   │   └── admin/             # Admin interface for sponsored content
│   ├── components/            # Reusable React components
│   │   ├── AffiliateLink.tsx  # Affiliate link component with tracking
│   │   └── SponsoredContent.tsx # Sponsored content display
│   ├── lib/                   # Utility functions and database helpers
│   │   ├── trending.ts        # Trending algorithms and utilities
│   │   ├── affiliate.ts       # Affiliate system and sponsored content
│   │   └── database.ts        # Database connection and queries
│   └── data/                  # Data layer and type definitions
├── server/                    # Express.js backend API
│   ├── routes/               # API endpoints
│   ├── models/               # Database models
│   └── middleware/           # Authentication and validation
└── public/                   # Static assets
```

## API Endpoints

### Tools
- `GET /api/tools` - Get all tools
- `GET /api/tools/:id` - Get specific tool
- `POST /api/tools` - Create new tool (admin)
- `PUT /api/tools/:id` - Update tool (admin)
- `DELETE /api/tools/:id` - Delete tool (admin)

### Reviews
- `GET /api/reviews/:toolId` - Get reviews for a tool
- `POST /api/reviews` - Submit a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

### Affiliate Analytics
- `POST /api/analytics/affiliate-click` - Track affiliate link clicks
- `GET /api/analytics/affiliate-click` - Get affiliate click data

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (admin)

## Database Schema

### Affiliate System Tables
```sql
-- Affiliate clicks tracking
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Sponsored slots management
CREATE TABLE sponsored_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  position VARCHAR(20) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  priority INTEGER DEFAULT 1,
  budget DECIMAL(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add affiliate clicks column to tools table
ALTER TABLE tools ADD COLUMN affiliate_clicks INTEGER DEFAULT 0;
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@vaultxaitools.com or join our Discord community.

---

Built with ❤️ by the VaultX team
