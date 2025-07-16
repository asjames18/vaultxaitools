const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { validateReview } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth-jwt');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// GET /api/reviews - Get all reviews with pagination
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, toolId, userId, rating } = req.query;
  const skip = (page - 1) * limit;
  
  const query = {};
  if (toolId) query['reviews.tool'] = toolId;
  if (userId) query['reviews.user'] = userId;
  if (rating) query['reviews.rating'] = parseInt(rating);
  
  const tools = await Tool.find(query)
    .populate('reviews.user', 'username firstName lastName avatar')
    .select('name logo category reviews')
    .skip(skip)
    .limit(parseInt(limit));
  
  // Flatten reviews from all tools
  const allReviews = tools.reduce((acc, tool) => {
    const toolReviews = tool.reviews.map(review => ({
      ...review.toObject(),
      tool: {
        id: tool._id,
        name: tool.name,
        logo: tool.logo,
        category: tool.category
      }
    }));
    return acc.concat(toolReviews);
  }, []);
  
  res.json({
    reviews: allReviews,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(allReviews.length / limit),
      totalReviews: allReviews.length
    }
  });
}));

// GET /api/reviews/recent - Get recent reviews
router.get('/recent', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const tools = await Tool.find({ 'reviews.0': { $exists: true } })
    .populate('reviews.user', 'username firstName lastName avatar')
    .select('name logo category reviews')
    .sort({ 'reviews.date': -1 })
    .limit(parseInt(limit));
  
  const recentReviews = tools.reduce((acc, tool) => {
    const toolReviews = tool.reviews
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map(review => ({
        ...review.toObject(),
        tool: {
          id: tool._id,
          name: tool.name,
          logo: tool.logo,
          category: tool.category
        }
      }));
    return acc.concat(toolReviews);
  }, []);
  
  // Sort by date and limit
  recentReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.json(recentReviews.slice(0, parseInt(limit)));
}));

// GET /api/reviews/user/:userId - Get reviews by user
router.get('/user/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  
  const tools = await Tool.find({ 'reviews.user': userId })
    .populate('reviews.user', 'username firstName lastName avatar')
    .select('name logo category reviews');
  
  const userReviews = tools.reduce((acc, tool) => {
    const toolReviews = tool.reviews
      .filter(review => review.user._id.toString() === userId)
      .map(review => ({
        ...review.toObject(),
        tool: {
          id: tool._id,
          name: tool.name,
          logo: tool.logo,
          category: tool.category
        }
      }));
    return acc.concat(toolReviews);
  }, []);
  
  // Sort by date
  userReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const paginatedReviews = userReviews.slice(skip, skip + parseInt(limit));
  
  res.json({
    reviews: paginatedReviews,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(userReviews.length / limit),
      totalReviews: userReviews.length
    }
  });
}));

// POST /api/reviews - Add review to tool
router.post('/', authMiddleware, validateReview, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized: req.user missing', 401);
  }
  
  const { toolId, rating, comment } = req.body;
  if (!toolId) {
    throw new AppError('Tool ID is required', 400);
  }
  
  const tool = await Tool.findById(toolId);
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

// PUT /api/reviews/:reviewId - Update review
router.put('/:reviewId', authMiddleware, validateReview, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized: req.user missing', 401);
  }
  
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  
  const tool = await Tool.findOne({ 'reviews._id': reviewId });
  if (!tool) {
    throw new AppError('Review not found', 404);
  }
  
  const review = tool.reviews.id(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }
  
  // Check if user owns this review
  if (review.user.toString() !== req.user.id) {
    throw new AppError('You can only edit your own reviews', 403);
  }
  
  review.rating = rating;
  review.comment = comment;
  review.date = new Date();
  await tool.save();
  
  res.json({ message: 'Review updated successfully' });
}));

// DELETE /api/reviews/:reviewId - Delete review
router.delete('/:reviewId', authMiddleware, asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized: req.user missing', 401);
  }
  
  const { reviewId } = req.params;
  
  const tool = await Tool.findOne({ 'reviews._id': reviewId });
  if (!tool) {
    throw new AppError('Review not found', 404);
  }
  
  const review = tool.reviews.id(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }
  
  // Check if user owns this review
  if (review.user.toString() !== req.user.id) {
    throw new AppError('You can only delete your own reviews', 403);
  }
  
  review.remove();
  await tool.save();
  
  // Update user's review count
  const User = require('../models/User');
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { reviewCount: -1 }
  });
  
  res.json({ message: 'Review deleted successfully' });
}));

// GET /api/reviews/stats - Get review statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Tool.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: '$reviewCount' },
        avgRating: { $avg: '$rating' },
        totalTools: { $sum: 1 }
      }
    },
    {
      $project: {
        totalReviews: 1,
        avgRating: { $round: ['$avgRating', 2] },
        totalTools: 1
      }
    }
  ]);
  
  // Get rating distribution
  const ratingDistribution = await Tool.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: { $floor: '$rating' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  res.json({
    stats: stats[0] || { totalReviews: 0, avgRating: 0, totalTools: 0 },
    ratingDistribution
  });
}));

module.exports = router; 