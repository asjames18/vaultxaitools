# VaultX AI Tools - Backend API

A comprehensive Node.js/Express.js backend API for managing AI tools, users, reviews, and categories with MongoDB integration.

## Features

- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with bcrypt password hashing
- **Input Validation** using Joi
- **Rate Limiting** and security middleware
- **CRUD Operations** for tools, users, reviews, and categories
- **Search and Filtering** capabilities
- **Pagination** support
- **Admin Role Management**

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer (optional)
- **Cloud Storage**: Cloudinary (optional)

## Project Structure

```
server/
├── index.js              # Main server file
├── models/               # Database models
│   ├── Tool.js          # Tool schema and methods
│   └── User.js          # User schema and methods
├── routes/               # API routes
│   ├── tools.js         # Tool CRUD operations
│   ├── users.js         # User authentication & management
│   ├── categories.js    # Category operations
│   └── reviews.js       # Review management
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── validation.js    # Input validation
├── seed.js              # Database seeding script
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vaultxaitools
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development with auto-reload
   npm run server:dev
   
   # Production
   npm run server
   
   # Full stack (frontend + backend)
   npm run dev:full
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Tools
- `GET /api/tools` - Get all tools (with pagination, filtering, search)
- `GET /api/tools/:id` - Get single tool by ID
- `POST /api/tools` - Create new tool (Admin only)
- `PUT /api/tools/:id` - Update tool (Admin only)
- `DELETE /api/tools/:id` - Delete tool (Admin only)
- `GET /api/tools/trending` - Get trending tools
- `GET /api/tools/search` - Search tools
- `GET /api/tools/categories/:category` - Get tools by category

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/recent` - Get recent reviews
- `GET /api/reviews/user/:userId` - Get reviews by user
- `POST /api/reviews` - Add review to tool
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `GET /api/reviews/stats` - Get review statistics

### Categories
- `GET /api/categories` - Get all categories with stats
- `GET /api/categories/:name` - Get category details with tools
- `GET /api/categories/:name/trending` - Get trending tools in category

### User Management (Admin)
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### User Favorites
- `GET /api/users/favorites` - Get user's favorite tools
- `POST /api/users/favorites/:toolId` - Add tool to favorites
- `DELETE /api/users/favorites/:toolId` - Remove tool from favorites

## Database Models

### Tool Schema
```javascript
{
  name: String (required, unique),
  logo: String (required),
  description: String (required, max 200),
  longDescription: String (required, max 2000),
  category: String (required, enum),
  website: String (required, URL),
  github: String (optional, GitHub URL),
  pricing: Array of pricing plans,
  features: Array of strings,
  pros: Array of strings,
  cons: Array of strings,
  tags: Array of strings,
  screenshots: Array of URLs,
  videoUrl: String (optional, URL),
  reviews: Array of review objects,
  rating: Number (0-5),
  reviewCount: Number,
  weeklyUsers: Number,
  growth: String,
  isActive: Boolean
}
```

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String (required),
  lastName: String (required),
  avatar: String (optional),
  bio: String (optional),
  role: String (enum: user, admin, moderator),
  isVerified: Boolean,
  isActive: Boolean,
  reviewCount: Number,
  favoriteTools: Array of tool IDs,
  lastLogin: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get a JWT token
2. **Include token** in request headers:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Protected routes** require valid JWT token
4. **Admin routes** require admin role

## Query Parameters

### Tools Endpoint
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `search` - Search in name/description
- `sortBy` - Sort field (rating, weeklyUsers, createdAt)
- `sortOrder` - Sort direction (asc, desc)

### Reviews Endpoint
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `toolId` - Filter by tool ID
- `userId` - Filter by user ID
- `rating` - Filter by rating

## Error Handling

The API returns consistent error responses:

```javascript
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password Hashing** with bcryptjs
- **JWT Authentication** with expiration
- **Input Validation** with Joi schemas
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **Request Size Limits** to prevent attacks

## Development

### Running Tests
```bash
# Add test scripts to package.json
npm test
```

### Database Seeding
```bash
npm run seed
```

### Environment Variables
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `FRONTEND_URL` - Frontend URL for CORS

## Production Deployment

1. **Set environment variables** for production
2. **Use MongoDB Atlas** or production MongoDB instance
3. **Set strong JWT_SECRET**
4. **Enable HTTPS**
5. **Set up monitoring** and logging
6. **Configure rate limiting** appropriately
7. **Set up backup** strategies

## API Documentation

For detailed API documentation, you can use tools like:
- Postman
- Swagger/OpenAPI
- Insomnia

The API follows RESTful conventions and includes proper HTTP status codes and error handling.

## Contributing

1. Follow the existing code style
2. Add validation for new endpoints
3. Include error handling
4. Update documentation
5. Test thoroughly

## License

This project is part of the VaultX AI Tools platform. 