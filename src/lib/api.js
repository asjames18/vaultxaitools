const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Tools endpoints
  async getTools(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tools?${queryString}`);
  }

  async getTool(id) {
    return this.request(`/tools/${id}`);
  }

  async getTrendingTools(limit = 10) {
    return this.request(`/tools/trending?limit=${limit}`);
  }

  async searchTools(query, limit = 20) {
    return this.request(`/tools/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getToolsByCategory(category, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tools/categories/${encodeURIComponent(category)}?${queryString}`);
  }

  // Admin tools endpoints
  async createTool(toolData) {
    return this.request('/tools', {
      method: 'POST',
      body: JSON.stringify(toolData),
    });
  }

  async updateTool(id, toolData) {
    return this.request(`/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toolData),
    });
  }

  async deleteTool(id) {
    return this.request(`/tools/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews endpoints
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews?${queryString}`);
  }

  async getRecentReviews(limit = 10) {
    return this.request(`/reviews/recent?limit=${limit}`);
  }

  async getUserReviews(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/user/${userId}?${queryString}`);
  }

  async addReview(toolId, reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ toolId, ...reviewData }),
    });
  }

  async updateReview(reviewId, reviewData) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async getReviewStats() {
    return this.request('/reviews/stats');
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(name, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories/${encodeURIComponent(name)}?${queryString}`);
  }

  async getCategoryTrending(name, limit = 10) {
    return this.request(`/categories/${encodeURIComponent(name)}/trending?limit=${limit}`);
  }

  // User favorites endpoints
  async getFavorites() {
    return this.request('/users/favorites');
  }

  async addToFavorites(toolId) {
    return this.request(`/users/favorites/${toolId}`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(toolId) {
    return this.request(`/users/favorites/${toolId}`, {
      method: 'DELETE',
    });
  }

  // Admin user management endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

// Utility functions for common operations
export const api = {
  // Authentication
  auth: {
    register: (userData) => apiClient.register(userData),
    login: (credentials) => apiClient.login(credentials),
    getProfile: () => apiClient.getProfile(),
    updateProfile: (profileData) => apiClient.updateProfile(profileData),
  },

  // Tools
  tools: {
    getAll: (params) => apiClient.getTools(params),
    getById: (id) => apiClient.getTool(id),
    getTrending: (limit) => apiClient.getTrendingTools(limit),
    search: (query, limit) => apiClient.searchTools(query, limit),
    getByCategory: (category, params) => apiClient.getToolsByCategory(category, params),
    create: (toolData) => apiClient.createTool(toolData),
    update: (id, toolData) => apiClient.updateTool(id, toolData),
    delete: (id) => apiClient.deleteTool(id),
  },

  // Reviews
  reviews: {
    getAll: (params) => apiClient.getReviews(params),
    getRecent: (limit) => apiClient.getRecentReviews(limit),
    getByUser: (userId, params) => apiClient.getUserReviews(userId, params),
    add: (toolId, reviewData) => apiClient.addReview(toolId, reviewData),
    update: (reviewId, reviewData) => apiClient.updateReview(reviewId, reviewData),
    delete: (reviewId) => apiClient.deleteReview(reviewId),
    getStats: () => apiClient.getReviewStats(),
  },

  // Categories
  categories: {
    getAll: () => apiClient.getCategories(),
    getByName: (name, params) => apiClient.getCategory(name, params),
    getTrending: (name, limit) => apiClient.getCategoryTrending(name, limit),
  },

  // User favorites
  favorites: {
    getAll: () => apiClient.getFavorites(),
    add: (toolId) => apiClient.addToFavorites(toolId),
    remove: (toolId) => apiClient.removeFromFavorites(toolId),
  },

  // Admin
  admin: {
    getUsers: (params) => apiClient.getUsers(params),
    updateUser: (id, userData) => apiClient.updateUser(id, userData),
    deleteUser: (id) => apiClient.deleteUser(id),
  },

  // Health
  health: () => apiClient.healthCheck(),
};

// Export the client instance as well
export default apiClient; 