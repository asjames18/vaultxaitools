# VaultX AI Tools

A modern, responsive platform for discovering and reviewing AI tools with a full-stack architecture including Next.js frontend and Node.js/Express.js backend with MongoDB.

## 🚀 Features

### Frontend (Next.js + React + Tailwind CSS)
- **Modern UI/UX** with responsive design and dark mode support
- **Search & Filter** functionality for AI tools
- **Dynamic Routing** with Next.js App Router
- **Tool Profiles** with detailed information, screenshots, and reviews
- **Category-based Browsing** with statistics
- **Trending Tools** with growth metrics
- **User Reviews** with star ratings and comments

### Backend (Node.js + Express.js + MongoDB)
- **RESTful API** with comprehensive CRUD operations
- **JWT Authentication** with bcrypt password hashing
- **MongoDB Database** with Mongoose ODM
- **Input Validation** using Joi schemas
- **Rate Limiting** and security middleware
- **Search & Filtering** capabilities
- **Pagination** support
- **Admin Role Management**

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **State Management**: React Hooks
- **Icons**: Heroicons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
vaultxaitools/
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   └── lib/              # Utilities and API client
├── server/                # Backend source code
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Custom middleware
│   ├── index.js          # Main server file
│   └── seed.js           # Database seeding
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vaultxaitools
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp env.example .env
   
   # Update .env with your configuration
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vaultxaitools
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually:
   # Frontend only
   npm run dev
   
   # Backend only
   npm run server:dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start Next.js frontend
npm run server:dev       # Start Express backend with nodemon
npm run dev:full         # Start both frontend and backend

# Production
npm run build           # Build Next.js application
npm run start           # Start production server

# Database
npm run seed            # Seed database with sample data

# Utilities
npm run lint            # Run ESLint
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get current user profile

### Tools
- `GET /api/tools` - Get all tools (with pagination, filtering, search)
- `GET /api/tools/:id` - Get single tool by ID
- `GET /api/tools/trending` - Get trending tools
- `POST /api/tools` - Create new tool (Admin only)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Add review to tool
- `GET /api/reviews/stats` - Get review statistics

### Categories
- `GET /api/categories` - Get all categories with stats
- `GET /api/categories/:name` - Get category details with tools

## 🗄️ Database Schema

### Tool Collection
```javascript
{
  name: String (required, unique),
  logo: String (required),
  description: String (required, max 200),
  longDescription: String (required, max 2000),
  category: String (required, enum),
  website: String (required, URL),
  pricing: Array of pricing plans,
  features: Array of strings,
  pros: Array of strings,
  cons: Array of strings,
  screenshots: Array of URLs,
  reviews: Array of review objects,
  rating: Number (0-5),
  weeklyUsers: Number,
  growth: String
}
```

### User Collection
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: user, admin, moderator),
  favoriteTools: Array of tool IDs
}
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get a JWT token
2. **Include token** in request headers: `Authorization: Bearer <token>`
3. **Protected routes** require valid JWT token
4. **Admin routes** require admin role

## 🎨 Frontend Features

### Pages
- **Home** - Tool listings with search and filters
- **Categories** - Browse tools by category
- **Tool Details** - Comprehensive tool profiles with reviews
- **Trending** - Popular tools with growth metrics
- **About** - Platform information

### Components
- **Search Bar** - Real-time search functionality
- **Tool Cards** - Responsive tool information display
- **Review System** - Star ratings and comments
- **Category Filters** - Easy category navigation
- **Pagination** - Efficient data loading

## 🔒 Security Features

- **Password Hashing** with bcryptjs
- **JWT Authentication** with expiration
- **Input Validation** with Joi schemas
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku/Render)
1. Set environment variables
2. Connect MongoDB database
3. Deploy the server

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation in `/server/README.md`
- Review the code comments for implementation details
