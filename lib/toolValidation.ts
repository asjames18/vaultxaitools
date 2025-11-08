export interface ToolValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ToolValidationRules {
  rating: {
    min: number;
    max: number;
    warningThreshold: number;
  };
  reviewCount: {
    min: number;
    max: number;
    warningThreshold: number;
  };
  weeklyUsers: {
    min: number;
    max: number;
    warningThreshold: number;
  };
  growth: {
    minPercent: number;
    maxPercent: number;
    warningThreshold: number;
  };
}

// Default validation rules for realistic AI tool data
export const DEFAULT_VALIDATION_RULES: ToolValidationRules = {
  rating: {
    min: 1.0,
    max: 5.0,
    warningThreshold: 4.8 // Warn if rating is suspiciously high
  },
  reviewCount: {
    min: 1,
    max: 100000, // Very popular tools might have 100k+ reviews
    warningThreshold: 50000 // Warn if review count is very high
  },
  weeklyUsers: {
    min: 100, // Even niche tools should have some users
    max: 2000000, // Very popular tools like ChatGPT might have millions
    warningThreshold: 500000 // Warn if user count is very high
  },
  growth: {
    minPercent: -50, // Tools can decline
    maxPercent: 200, // New tools can grow very fast
    warningThreshold: 100 // Warn if growth is over 100%
  }
};

export function validateToolData(
  tool: any, 
  rules: ToolValidationRules = DEFAULT_VALIDATION_RULES
): ToolValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Validate rating
  if (typeof tool.rating === 'number') {
    if (tool.rating < rules.rating.min || tool.rating > rules.rating.max) {
      errors.push(`Rating must be between ${rules.rating.min} and ${rules.rating.max}`);
    } else if (tool.rating > rules.rating.warningThreshold) {
      warnings.push(`Rating ${tool.rating} is unusually high. Consider verifying this value.`);
    }
  } else {
    errors.push('Rating must be a number');
  }

  // Validate review count
  if (typeof tool.reviewCount === 'number') {
    if (tool.reviewCount < rules.reviewCount.min || tool.reviewCount > rules.reviewCount.max) {
      errors.push(`Review count must be between ${rules.reviewCount.min} and ${rules.reviewCount.max.toLocaleString()}`);
    } else if (tool.reviewCount > rules.reviewCount.warningThreshold) {
      warnings.push(`Review count ${tool.reviewCount.toLocaleString()} is very high. Consider verifying this value.`);
    }
  } else {
    errors.push('Review count must be a number');
  }

  // Validate weekly users
  if (typeof tool.weeklyUsers === 'number') {
    if (tool.weeklyUsers < rules.weeklyUsers.min || tool.weeklyUsers > rules.weeklyUsers.max) {
      errors.push(`Weekly users must be between ${rules.weeklyUsers.min.toLocaleString()} and ${rules.weeklyUsers.max.toLocaleString()}`);
    } else if (tool.weeklyUsers > rules.weeklyUsers.warningThreshold) {
      warnings.push(`Weekly users ${tool.weeklyUsers.toLocaleString()} is very high. Consider verifying this value.`);
    }
  } else {
    errors.push('Weekly users must be a number');
  }

  // Validate growth
  if (typeof tool.growth === 'string') {
    const growthMatch = tool.growth.match(/^([+-]?)(\d+(?:\.\d+)?)%?$/);
    if (growthMatch) {
      const sign = growthMatch[1] || '+';
      const value = parseFloat(growthMatch[2]);
      const actualValue = sign === '+' ? value : -value;
      
      if (actualValue < rules.growth.minPercent || actualValue > rules.growth.maxPercent) {
        errors.push(`Growth must be between ${rules.growth.minPercent}% and ${rules.growth.maxPercent}%`);
      } else if (Math.abs(actualValue) > rules.growth.warningThreshold) {
        warnings.push(`Growth ${tool.growth} is unusually high. Consider verifying this value.`);
      }
    } else {
      errors.push('Growth must be in format like "+25%" or "-10%"');
    }
  } else {
    errors.push('Growth must be a string');
  }

  // Validate required fields
  if (!tool.name || tool.name.trim().length === 0) {
    errors.push('Tool name is required');
  }

  if (!tool.description || tool.description.trim().length === 0) {
    errors.push('Tool description is required');
  }

  if (!tool.category || tool.category.trim().length === 0) {
    errors.push('Tool category is required');
  }

  if (!tool.website || !tool.website.startsWith('http')) {
    errors.push('Valid website URL is required');
  }

  // Generate suggestions for improvement
  if (tool.rating && tool.rating < 3.5) {
    suggestions.push('Consider if this tool really deserves such a low rating');
  }

  if (tool.reviewCount && tool.reviewCount < 10) {
    suggestions.push('Very few reviews might indicate a new or unpopular tool');
  }

  if (tool.weeklyUsers && tool.weeklyUsers < 1000) {
    suggestions.push('Low user count might indicate a niche or new tool');
  }

  // Check for suspicious patterns
  if (tool.rating === 4.2 && tool.reviewCount === 189 && tool.weeklyUsers === 150000) {
    warnings.push('This data pattern matches known mock data. Please verify all values.');
  }

  if (tool.rating === 4.2 && tool.reviewCount === 189) {
    warnings.push('Rating 4.2 with exactly 189 reviews is suspicious. Please verify.');
  }

  if (tool.weeklyUsers === 150000) {
    warnings.push('Weekly users of exactly 150,000 is suspicious. Please verify.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

// Function to generate realistic data suggestions
export function generateRealisticDataSuggestions(tool: any): any {
  const suggestions: any = {};
  
  if (tool.rating && (tool.rating < 1 || tool.rating > 5)) {
    suggestions.rating = Math.round((Math.random() * 1.1 + 3.8) * 10) / 10; // 3.8-4.9
  }
  
  if (tool.reviewCount && (tool.reviewCount < 1 || tool.reviewCount > 100000)) {
    const baseReviews = Math.floor(Math.random() * 500) + 50;
    const popularityMultiplier = Math.random() * 3 + 0.5;
    suggestions.reviewCount = Math.floor(baseReviews * popularityMultiplier);
  }
  
  if (tool.weeklyUsers && (tool.weeklyUsers < 100 || tool.weeklyUsers > 2000000)) {
    const baseUsers = Math.floor(Math.random() * 5000) + 1000;
    const categoryMultiplier = Math.random() * 2 + 0.5;
    suggestions.weeklyUsers = Math.floor(baseUsers * categoryMultiplier);
  }
  
  if (tool.growth && !tool.growth.match(/^[+-]?\d+(?:\.\d+)?%?$/)) {
    const growthOptions = ['+12%', '+18%', '+23%', '+31%', '+45%', '+52%'];
    suggestions.growth = growthOptions[Math.floor(Math.random() * growthOptions.length)];
  }
  
  return suggestions;
}

// Function to check if data looks like mock data
export function isMockData(tool: any): boolean {
  const suspiciousPatterns = [
    // Exact matches from known mock data
    tool.rating === 4.2 && tool.reviewCount === 189 && tool.weeklyUsers === 150000,
    tool.rating === 4.2 && tool.reviewCount === 189,
    tool.weeklyUsers === 150000,
    tool.growth === '28%' || tool.growth === '+28%',
    
    // Round numbers that are suspicious
    tool.weeklyUsers === 100000,
    tool.weeklyUsers === 50000,
    tool.reviewCount === 100,
    tool.reviewCount === 500,
    
    // Suspicious rating patterns
    tool.rating === 4.0,
    tool.rating === 4.5,
    tool.rating === 5.0
  ];
  
  return suspiciousPatterns.some(pattern => pattern === true);
}
