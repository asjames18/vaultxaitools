const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');

// GET /api/categories - Get all categories with tool counts
router.get('/', async (req, res) => {
  try {
    const categories = await Tool.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          toolCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviewCount' }
        }
      },
      {
        $project: {
          name: '$_id',
          toolCount: 1,
          avgRating: { $round: ['$avgRating', 1] },
          totalReviews: 1
        }
      },
      { $sort: { toolCount: -1 } }
    ]);
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories', message: error.message });
  }
});

// GET /api/categories/:name - Get category details with tools
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { page = 1, limit = 12, sortBy = 'rating', sortOrder = 'desc' } = req.query;
    
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const tools = await Tool.find({ 
      category: name, 
      isActive: true 
    })
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-reviews');
    
    const total = await Tool.countDocuments({ 
      category: name, 
      isActive: true 
    });
    
    // Get category stats
    const stats = await Tool.aggregate([
      { $match: { category: name, isActive: true } },
      {
        $group: {
          _id: null,
          toolCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviewCount' },
          totalUsers: { $sum: '$weeklyUsers' }
        }
      }
    ]);
    
    res.json({
      category: name,
      tools,
      stats: stats[0] || { toolCount: 0, avgRating: 0, totalReviews: 0, totalUsers: 0 },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTools: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category', message: error.message });
  }
});

// GET /api/categories/:name/trending - Get trending tools in category
router.get('/:name/trending', async (req, res) => {
  try {
    const { name } = req.params;
    const { limit = 10 } = req.query;
    
    const tools = await Tool.find({ 
      category: name, 
      isActive: true 
    })
    .sort({ weeklyUsers: -1, rating: -1 })
    .limit(parseInt(limit))
    .select('-reviews');
    
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trending tools', message: error.message });
  }
});

module.exports = router; 