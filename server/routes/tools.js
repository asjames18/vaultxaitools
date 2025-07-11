const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { validateTool } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

// GET /api/tools - Get all tools with pagination and filtering
router.get('/', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tools', message: error.message });
  }
});

// GET /api/tools/trending - Get trending tools
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const tools = await Tool.findTrending(parseInt(limit));
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trending tools', message: error.message });
  }
});

// GET /api/tools/categories - Get tools by category
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;
    
    const tools = await Tool.findByCategory(category).limit(parseInt(limit));
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tools by category', message: error.message });
  }
});

// GET /api/tools/search - Search tools
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const tools = await Tool.find({
      $text: { $search: q },
      isActive: true
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .select('-reviews');
    
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Error searching tools', message: error.message });
  }
});

// GET /api/tools/:id - Get single tool by ID
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('reviews.user', 'username firstName lastName avatar');
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tool', message: error.message });
  }
});

// POST /api/tools - Create new tool (Admin only)
router.post('/', auth, validateTool, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const tool = new Tool(req.body);
    await tool.save();
    
    res.status(201).json(tool);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Tool with this name already exists' });
    }
    res.status(500).json({ error: 'Error creating tool', message: error.message });
  }
});

// PUT /api/tools/:id - Update tool (Admin only)
router.put('/:id', auth, validateTool, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json(tool);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Tool with this name already exists' });
    }
    res.status(500).json({ error: 'Error updating tool', message: error.message });
  }
});

// DELETE /api/tools/:id - Delete tool (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const tool = await Tool.findByIdAndDelete(req.params.id);
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting tool', message: error.message });
  }
});

// POST /api/tools/:id/reviews - Add review to tool
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const tool = await Tool.findById(req.params.id);
    
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

// GET /api/tools/:id/reviews - Get reviews for a tool
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const tool = await Tool.findById(req.params.id)
      .populate('reviews.user', 'username firstName lastName avatar')
      .select('reviews');
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews', message: error.message });
  }
});

module.exports = router; 