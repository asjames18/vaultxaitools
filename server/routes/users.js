const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateUser, validateLogin, validateUserUpdate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

// POST /api/users/register - Register new user
router.post('/register', validateUser, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, bio, avatar } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email) || await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      bio: bio || '',
      avatar: avatar || null
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', message: error.message });
  }
});

// POST /api/users/login - Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', message: error.message });
  }
});

// GET /api/users/profile - Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favoriteTools', 'name description category logo');
    
    res.json({
      user: user.getPublicProfile(),
      favoriteTools: user.favoriteTools
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile', message: error.message });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, validateUserUpdate, async (req, res) => {
  try {
    const updates = req.body;
    
    // Don't allow role updates through this endpoint
    delete updates.role;
    delete updates.isActive;
    delete updates.isVerified;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Error updating profile', message: error.message });
  }
});

// POST /api/users/favorites/:toolId - Add tool to favorites
router.post('/favorites/:toolId', auth, async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (user.favoriteTools.includes(toolId)) {
      return res.status(400).json({ error: 'Tool already in favorites' });
    }
    
    user.favoriteTools.push(toolId);
    await user.save();
    
    res.json({ message: 'Tool added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding to favorites', message: error.message });
  }
});

// DELETE /api/users/favorites/:toolId - Remove tool from favorites
router.delete('/favorites/:toolId', auth, async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const user = await User.findById(req.user.id);
    user.favoriteTools = user.favoriteTools.filter(
      id => id.toString() !== toolId
    );
    await user.save();
    
    res.json({ message: 'Tool removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing from favorites', message: error.message });
  }
});

// GET /api/users/favorites - Get user's favorite tools
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favoriteTools', 'name description category logo rating reviewCount');
    
    res.json({ favoriteTools: user.favoriteTools });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorites', message: error.message });
  }
});

// GET /api/users/:id - Get user profile by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username firstName lastName avatar bio reviewCount createdAt');
    
    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user', message: error.message });
  }
});

// Admin routes
// GET /api/users - Get all users (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', message: error.message });
  }
});

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user', message: error.message });
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user', message: error.message });
  }
});

module.exports = router; 