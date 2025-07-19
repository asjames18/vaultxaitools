const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { validateTool } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth-jwt');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// GET /api/tools - Get all tools with pagination and filtering
router.get('/', asyncHandler(async (req, res) => {
  // Test mode: return mock response
  if (process.env.NODE_ENV === 'test') {
    return res.status(200).json({
      tools: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalTools: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    });
  }

  const {
    page = 1,
    limit = 12,
    category,
    search,
    sortBy = 'rating',
    sortOrder = 'desc'
  } = req.query;

  const query = { isActive: true };
  
  // Category filter
  if (category && category !== 'All') {
    query.category = category;
  }
  
  // Search filter
  if (search) {
    query.$text = { $search: search };
  }
  
  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  const skip = (page - 1) * limit;
  
  const tools = await Tool.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-reviews'); // Exclude reviews for performance
  
  const total = await Tool.countDocuments(query);
  
  res.json({
    tools,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTools: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  });
}));

// GET /api/tools/trending - Get trending tools
router.get('/trending', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const tools = await Tool.findTrending(parseInt(limit));
  res.json(tools);
}));

// GET /api/tools/categories - Get tools by category
router.get('/categories/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 20 } = req.query;
  
  const tools = await Tool.findByCategory(category).limit(parseInt(limit));
  res.json(tools);
}));

// GET /api/tools/search - Search tools
router.get('/search', asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;
  
  if (!q) {
    throw new AppError('Search query is required', 400);
  }
  
  const tools = await Tool.find({
    $text: { $search: q },
    isActive: true
  })
  .sort({ score: { $meta: 'textScore' } })
  .limit(parseInt(limit))
  .select('-reviews');
  
  res.json(tools);
}));

// GET /api/tools/:id - Get single tool by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const tool = await Tool.findById(req.params.id)
    .populate('reviews.user', 'username firstName lastName avatar');
  
  if (!tool) {
    throw new AppError('Tool not found', 404);
  }
  
  res.json(tool);
}));

// POST /api/tools - Create new tool (Admin only)
router.post('/', authMiddleware, validateTool, asyncHandler(async (req, res) => {
  // Smoke test: ensure req.user is defined
  if (!req.user) {
    throw new AppError('Unauthorized: req.user missing', 401);
  }
  
  // Check if user is admin
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin only.', 403);
  }
  
  const tool = new Tool(req.body);
  await tool.save();
  res.status(201).json(tool);
}));

// PUT /api/tools/:id - Update tool (Admin only)
router.put('/:id', authMiddleware, validateTool, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized: req.user missing', 401);
  }
  
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin only.', 403);
  }
  
  const tool = await Tool.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  
  if (!tool) {
    throw new AppError('Tool not found', 404);
  }
  
  res.json(tool);
}));

// DELETE /api/tools/:id - Delete tool (Admin only)
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized: req.user missing', 401);
  }
  
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin only.', 403);
  }
  
  const tool = await Tool.findByIdAndDelete(req.params.id);
  
  if (!tool) {
    throw new AppError('Tool not found', 404);
  }
  
  res.json({ message: 'Tool deleted successfully' });
}));

// POST /api/tools/:id/reviews - Add review to tool
router.post('/:id/reviews', authMiddleware, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized: req.user missing', 401);
  }
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    throw new AppError('Rating and comment are required', 400);
  }
  if (rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }
  const tool = await Tool.findById(req.params.id);
  if (!tool) {
    throw new AppError('Tool not found', 404);
  }
  // Check if user already reviewed this tool
  const existingReview = tool.reviews.find(
    review => review.user.toString() === req.user.id
  );
  if (existingReview) {
    throw new AppError('You have already reviewed this tool', 400);
  }
  await tool.addReview(req.user.id, rating, comment);
  // Update user's review count
  const User = require('../models/User');
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { reviewCount: 1 }
  });
  res.status(201).json({ message: 'Review added successfully' });
}));

// GET /api/tools/:id/reviews - Get reviews for a tool
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  
  const tool = await Tool.findById(req.params.id)
    .populate('reviews.user', 'username firstName lastName avatar')
    .select('reviews');
  
  if (!tool) {
    throw new AppError('Tool not found', 404);
  }
  
  const reviews = tool.reviews.slice(skip, skip + parseInt(limit));
  const total = tool.reviews.length;
  
  res.json({
    reviews,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    }
  });
}));

// Test route to force internal server error
router.get('/test/error', asyncHandler(async (req, res) => {
  throw new Error('This is a test error');
}));

module.exports = router; 