const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { validateReview } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

// GET /api/reviews - Get all reviews with pagination
router.get('/', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews', message: error.message });
  }
});

// GET /api/reviews/recent - Get recent reviews
router.get('/recent', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recent reviews', message: error.message });
  }
});

// GET /api/reviews/user/:userId - Get reviews by user
router.get('/user/:userId', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user reviews', message: error.message });
  }
});

// POST /api/reviews - Add review to tool
router.post('/', auth, validateReview, async (req, res) => {
  try {
    const { toolId, rating, comment } = req.body;
    
    if (!toolId) {
      return res.status(400).json({ error: 'Tool ID is required' });
    }
    
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    // Check if user already reviewed this tool
    const existingReview = tool.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this tool' });
    }
    
    await tool.addReview(req.user.id, rating, comment);
    
    // Update user's review count
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { reviewCount: 1 }
    });
    
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding review', message: error.message });
  }
});

// PUT /api/reviews/:reviewId - Update review
router.put('/:reviewId', auth, validateReview, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    const tool = await Tool.findOne({ 'reviews._id': reviewId });
    if (!tool) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const review = tool.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }
    
    review.rating = rating;
    review.comment = comment;
    review.date = new Date();
    
    await tool.save();
    
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating review', message: error.message });
  }
});

// DELETE /api/reviews/:reviewId - Delete review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const tool = await Tool.findOne({ 'reviews._id': reviewId });
    if (!tool) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const review = tool.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }
    
    review.remove();
    await tool.save();
    
    // Update user's review count
    const User = require('../models/User');
    await User.findByIdAndUpdate(review.user, {
      $inc: { reviewCount: -1 }
    });
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting review', message: error.message });
  }
});

// GET /api/reviews/stats - Get review statistics
router.get('/stats', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching review stats', message: error.message });
  }
});

module.exports = router; 