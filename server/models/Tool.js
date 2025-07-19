const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const pricingSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
    enum: ['free', 'basic', 'pro', 'enterprise', 'individual', 'business', 'education']
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  logo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  longDescription: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['Language', 'Design', 'Development', 'Productivity', 'Marketing', 'Writing', 'Media', 'Analytics', 'Communication']
  },
  website: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  github: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/github\.com\/.+/.test(v);
      },
      message: 'GitHub must be a valid GitHub URL'
    }
  },
  pricing: [pricingSchema],
  features: [{
    type: String,
    required: true,
    maxlength: 100
  }],
  pros: [{
    type: String,
    required: true,
    maxlength: 200
  }],
  cons: [{
    type: String,
    required: true,
    maxlength: 200
  }],
  tags: [{
    type: String,
    maxlength: 50
  }],
  screenshots: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Screenshot must be a valid URL'
    }
  }],
  videoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Video URL must be a valid URL'
    }
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  weeklyUsers: {
    type: Number,
    default: 0
  },
  growth: {
    type: String,
    default: "0%"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
toolSchema.index({ name: 'text', description: 'text', longDescription: 'text' });
toolSchema.index({ category: 1 });
toolSchema.index({ rating: -1 });
toolSchema.index({ weeklyUsers: -1 });
toolSchema.index({ isActive: 1 });

// Pre-save middleware to update rating and review count
toolSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
  this.updatedAt = Date.now();
  next();
});

// Static method to get tools by category
toolSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ rating: -1 });
};

// Static method to get trending tools
toolSchema.statics.findTrending = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ weeklyUsers: -1, rating: -1 })
    .limit(limit);
};

// Instance method to add review
toolSchema.methods.addReview = function(userId, rating, comment) {
  const review = {
    user: userId,
    rating,
    comment,
    date: new Date()
  };
  
  this.reviews.push(review);
  return this.save();
};

module.exports = mongoose.model('Tool', toolSchema); 