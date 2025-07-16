const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateUser, validateLogin, validateUserUpdate } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// POST /api/users/register - Register new user
router.post('/register', validateUser, asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName, bio, avatar } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findByEmail(email) || await User.findByUsername(username);
  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
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
}));

// POST /api/users/login - Login user
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await User.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401);
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
}));

// GET /api/users/profile - Get current user profile
router.get('/profile', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('favoriteTools', 'name description category logo');
  
  res.json({
    user: user.getPublicProfile(),
    favoriteTools: user.favoriteTools
  });
}));

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, validateUserUpdate, asyncHandler(async (req, res) => {
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
}));

// POST /api/users/favorites/:toolId - Add tool to favorites
router.post('/favorites/:toolId', auth, asyncHandler(async (req, res) => {
  const { toolId } = req.params;
  
  const user = await User.findById(req.user.id);
  if (user.favoriteTools.includes(toolId)) {
    throw new AppError('Tool already in favorites', 400);
  }
  
  user.favoriteTools.push(toolId);
  await user.save();
  
  res.json({ message: 'Tool added to favorites' });
}));

// DELETE /api/users/favorites/:toolId - Remove tool from favorites
router.delete('/favorites/:toolId', auth, asyncHandler(async (req, res) => {
  const { toolId } = req.params;
  
  const user = await User.findById(req.user.id);
  user.favoriteTools = user.favoriteTools.filter(
    id => id.toString() !== toolId
  );
  await user.save();
  
  res.json({ message: 'Tool removed from favorites' });
}));

// GET /api/users/favorites - Get user's favorite tools
router.get('/favorites', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('favoriteTools', 'name description category logo rating reviewCount');
  
  res.json({ favoriteTools: user.favoriteTools });
}));

// GET /api/users/:id - Get user profile by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('username firstName lastName avatar bio reviewCount createdAt');
  
  if (!user || !user.isActive) {
    throw new AppError('User not found', 404);
  }
  
  res.json({ user });
}));

// Admin routes
// GET /api/users - Get all users (Admin only)
router.get('/', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin only.', 403);
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
}));

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin only.', 403);
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.json({
    message: 'User updated successfully',
    user: user.getPublicProfile()
  });
}));

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin only.', 403);
  }
  
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.json({ message: 'User deleted successfully' });
}));

module.exports = router; 