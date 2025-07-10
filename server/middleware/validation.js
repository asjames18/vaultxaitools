const Joi = require('joi');

// Tool validation schema
const toolSchema = Joi.object({
  name: Joi.string().required().min(1).max(100).trim(),
  logo: Joi.string().required(),
  description: Joi.string().required().min(1).max(200).trim(),
  longDescription: Joi.string().required().min(1).max(2000).trim(),
  category: Joi.string().required().valid(
    'Language', 'Design', 'Development', 'Productivity', 
    'Marketing', 'Writing', 'Media', 'Analytics', 'Communication'
  ),
  website: Joi.string().required().uri(),
  github: Joi.string().uri().allow(null, ''),
  pricing: Joi.array().items(
    Joi.object({
      plan: Joi.string().required().valid(
        'free', 'basic', 'pro', 'enterprise', 'individual', 'business', 'education'
      ),
      price: Joi.string().required(),
      description: Joi.string().required()
    })
  ).min(1),
  features: Joi.array().items(Joi.string().max(100)).min(1),
  pros: Joi.array().items(Joi.string().max(200)).min(1),
  cons: Joi.array().items(Joi.string().max(200)).min(1),
  tags: Joi.array().items(Joi.string().max(50)),
  screenshots: Joi.array().items(Joi.string().uri()),
  videoUrl: Joi.string().uri().allow(null, ''),
  weeklyUsers: Joi.number().min(0),
  growth: Joi.string(),
  isActive: Joi.boolean()
});

// User validation schema
const userSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).trim(),
  email: Joi.string().required().email().trim(),
  password: Joi.string().required().min(6),
  firstName: Joi.string().required().max(50).trim(),
  lastName: Joi.string().required().max(50).trim(),
  bio: Joi.string().max(500).trim(),
  avatar: Joi.string().uri().allow(null, '')
});

// Review validation schema
const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required().min(1).max(1000).trim()
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().required().email().trim(),
  password: Joi.string().required()
});

// Validation middleware functions
const validateTool = (req, res, next) => {
  const { error } = toolSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

// Partial validation for updates
const validateToolUpdate = (req, res, next) => {
  const { error } = toolSchema.fork(
    Object.keys(toolSchema.describe().keys),
    (schema) => schema.optional()
  ).validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

const validateUserUpdate = (req, res, next) => {
  const { error } = userSchema.fork(
    ['username', 'email', 'password', 'firstName', 'lastName'],
    (schema) => schema.optional()
  ).validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details.map(detail => detail.message) 
    });
  }
  next();
};

module.exports = {
  validateTool,
  validateUser,
  validateReview,
  validateLogin,
  validateToolUpdate,
  validateUserUpdate
}; 