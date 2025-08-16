# Data Management Guide

This folder contains centralized data structures for the VaultX AI Tools website. All tool and category information is stored here and can be easily updated.

## File Structure

- `tools.ts` - Contains all tool data and helper functions
- `reviews.ts` - Contains review data and helper functions  
- `index.ts` - Exports all data and functions for easy importing

## How to Update Tools

### Adding a New Tool

1. Open `src/data/tools.ts`
2. Add a new tool object to the `tools` array:

```typescript
{
  id: "unique-tool-id",
  name: "Tool Name",
  logo: "🎨",
  description: "Short description",
  longDescription: "Detailed description...",
  category: "Design", // Must match a category name
  rating: 4.5,
  reviewCount: 123,
  weeklyUsers: 5000,
  growth: "+25%",
  website: "https://example.com",
  pricing: "Freemium",
  features: ["Feature 1", "Feature 2"],
  pros: ["Pro 1", "Pro 2"],
  cons: ["Con 1", "Con 2"],
  alternatives: [
    { name: "Alternative Tool", rating: 4.3, logo: "🔧" }
  ],
  tags: ["AI", "Design", "Creative"],
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15"
}
```

### Updating an Existing Tool

1. Find the tool in the `tools` array by its `id`
2. Update the desired properties
3. Update the `updatedAt` field with the current date

### Adding Reviews

1. Open `src/data/reviews.ts`
2. Add a new review object to the `reviews` array:

```typescript
{
  id: "unique-review-id",
  toolId: "tool-id-to-match",
  user: "User Name",
  rating: 5,
  date: "2 days ago",
  comment: "Review text...",
  helpful: 10,
  verified: true
}
```

## Helper Functions

### Tools Functions

- `getToolsByCategory(category)` - Get all tools in a category
- `getPopularTools(limit)` - Get most popular tools
- `getTrendingTools(limit)` - Get tools with highest growth
- `searchTools(query)` - Search tools by name, description, or tags
- `getToolById(id)` - Get a specific tool by ID

### Reviews Functions

- `getReviewsByToolId(toolId)` - Get all reviews for a tool
- `getAverageRating(toolId)` - Calculate average rating for a tool
- `getReviewCount(toolId)` - Get number of reviews for a tool

## Using Data in Components

Import the data and functions in your components:

```typescript
import { 
  tools, 
  categories, 
  getPopularTools, 
  searchTools,
  getToolById 
} from '@/data';

// Use in your component
const popularTools = getPopularTools(6);
const tool = getToolById('chatgpt');
```

## Admin Interface

Visit `/admin` to view all tools and categories in a user-friendly interface. This makes it easy to see what data exists and plan updates.

## Best Practices

1. **Always use unique IDs** for tools and reviews
2. **Keep category names consistent** between tools and categories
3. **Update the `updatedAt` field** when modifying tools
4. **Use descriptive tags** to improve search functionality
5. **Test your changes** by visiting the relevant pages

## Data Validation

The TypeScript interfaces ensure data consistency:

- `Tool` interface defines the structure for tools
- `Category` interface defines the structure for categories  
- `Review` interface defines the structure for reviews

## Future Enhancements

- Database integration for persistent storage
- API endpoints for dynamic data updates
- User authentication for admin access
- Image upload for tool logos
- Automated data validation 