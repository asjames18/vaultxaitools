// Analytics library for tracking search behavior and user interactions

export interface SearchEvent {
  query: string;
  filters: Record<string, any>;
  results: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  userAgent: string;
  referrer: string;
  page: string;
}

export interface FilterEvent {
  filterType: string;
  filterValue: any;
  previousFilters: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  page: string;
}

export interface ToolInteractionEvent {
  toolId: string;
  toolName: string;
  action: 'view' | 'favorite' | 'share' | 'bookmark' | 'click_external';
  timestamp: number;
  sessionId: string;
  userId?: string;
  page: string;
  searchQuery?: string;
  filters?: Record<string, any>;
}

export interface SearchSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalSearches: number;
  totalResults: number;
  averageResults: number;
  filtersUsed: string[];
  toolsViewed: string[];
  searchQueries: string[];
  userId?: string;
}

class AnalyticsTracker {
  private sessionId: string;
  private userId?: string;
  private searchSessions: Map<string, SearchSession>;
  private isInitialized: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.searchSessions = new Map();
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    // Generate or retrieve session ID
    const existingSessionId = localStorage.getItem('vaultx_session_id');
    if (existingSessionId) {
      this.sessionId = existingSessionId;
    } else {
      localStorage.setItem('vaultx_session_id', this.sessionId);
    }

    // Retrieve user ID if available
    this.userId = localStorage.getItem('vaultx_user_id') || undefined;

    // Start session tracking
    this.startSession();
    this.isInitialized = true;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.endSession();
      } else {
        this.startSession();
      }
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startSession() {
    if (!this.isInitialized) return;

    const session: SearchSession = {
      sessionId: this.sessionId,
      startTime: Date.now(),
      totalSearches: 0,
      totalResults: 0,
      averageResults: 0,
      filtersUsed: [],
      toolsViewed: [],
      searchQueries: []
    };

    this.searchSessions.set(this.sessionId, session);
  }

  private endSession() {
    if (!this.isInitialized) return;

    const session = this.searchSessions.get(this.sessionId);
    if (session) {
      session.endTime = Date.now();
      this.saveSessionData(session);
    }
  }

  private saveSessionData(session: SearchSession) {
    try {
      // Save to localStorage for persistence
      const existingSessions = JSON.parse(localStorage.getItem('vaultx_search_sessions') || '[]');
      existingSessions.push(session);
      
      // Keep only last 50 sessions
      if (existingSessions.length > 50) {
        existingSessions.splice(0, existingSessions.length - 50);
      }
      
      localStorage.setItem('vaultx_search_sessions', JSON.stringify(existingSessions));
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  // Track search events
  trackSearch(event: Omit<SearchEvent, 'sessionId' | 'timestamp' | 'userAgent' | 'referrer'>) {
    if (!this.isInitialized) return;

    const searchEvent: SearchEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Update session data
    const session = this.searchSessions.get(this.sessionId);
    if (session) {
      session.totalSearches++;
      session.totalResults += event.results;
      session.averageResults = session.totalResults / session.totalSearches;
      session.searchQueries.push(event.query);
      
      // Track unique filters used
      Object.keys(event.filters).forEach(filterType => {
        if (!session.filtersUsed.includes(filterType)) {
          session.filtersUsed.push(filterType);
        }
      });
    }

    // Send to analytics service
    this.sendToAnalytics('search', searchEvent);
  }

  // Track filter changes
  trackFilterChange(event: Omit<FilterEvent, 'sessionId' | 'timestamp'>) {
    if (!this.isInitialized) return;

    const filterEvent: FilterEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: Date.now()
    };

    this.sendToAnalytics('filter_change', filterEvent);
  }

  // Track tool interactions
  trackToolInteraction(event: Omit<ToolInteractionEvent, 'sessionId' | 'timestamp'>) {
    if (!this.isInitialized) return;

    const toolEvent: ToolInteractionEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: Date.now()
    };

    // Update session data
    const session = this.searchSessions.get(this.sessionId);
    if (session && !session.toolsViewed.includes(event.toolId)) {
      session.toolsViewed.push(event.toolId);
    }

    this.sendToAnalytics('tool_interaction', toolEvent);
  }

  // Track page views
  trackPageView(page: string, searchQuery?: string, filters?: Record<string, any>) {
    if (!this.isInitialized) return;

    const pageEvent = {
      page,
      searchQuery,
      filters,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      userId: this.userId
    };

    this.sendToAnalytics('page_view', pageEvent);
  }

  // Send data to analytics service
  private async sendToAnalytics(eventType: string, data: any) {
    try {
      // Send to our analytics endpoint
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          data,
          timestamp: Date.now()
        })
      });

      // Also send to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventType, {
          event_category: 'Search Analytics',
          event_label: data.query || data.page || data.action,
          value: data.results || 1,
          custom_parameters: data
        });
      }
    } catch (error) {
      console.error('Error sending analytics:', error);
    }
  }

  // Get analytics data
  getAnalyticsData() {
    if (!this.isInitialized) return null;

    const sessions = Array.from(this.searchSessions.values());
    const currentSession = sessions.find(s => s.sessionId === this.sessionId);

    return {
      currentSession,
      allSessions: sessions,
      totalSearches: sessions.reduce((sum, s) => sum + s.totalSearches, 0),
      averageResults: sessions.reduce((sum, s) => sum + s.averageResults, 0) / sessions.length || 0,
      popularFilters: this.getPopularFilters(sessions),
      popularQueries: this.getPopularQueries(sessions),
      popularTools: this.getPopularTools(sessions)
    };
  }

  private getPopularFilters(sessions: SearchSession[]): Array<{ filter: string; count: number }> {
    const filterCounts: Record<string, number> = {};
    
    sessions.forEach(session => {
      session.filtersUsed.forEach(filter => {
        filterCounts[filter] = (filterCounts[filter] || 0) + 1;
      });
    });

    return Object.entries(filterCounts)
      .map(([filter, count]) => ({ filter, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getPopularQueries(sessions: SearchSession[]): Array<{ query: string; count: number }> {
    const queryCounts: Record<string, number> = {};
    
    sessions.forEach(session => {
      session.searchQueries.forEach(query => {
        queryCounts[query] = (queryCounts[query] || 0) + 1;
      });
    });

    return Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getPopularTools(sessions: SearchSession[]): Array<{ toolId: string; count: number }> {
    const toolCounts: Record<string, number> = {};
    
    sessions.forEach(session => {
      session.toolsViewed.forEach(toolId => {
        toolCounts[toolId] = (toolCounts[toolId] || 0) + 1;
      });
    });

    return Object.entries(toolCounts)
      .map(([toolId, count]) => ({ toolId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    this.userId = userId;
    localStorage.setItem('vaultx_user_id', userId);
  }

  // Clear user data
  clearUserData() {
    this.userId = undefined;
    localStorage.removeItem('vaultx_user_id');
    localStorage.removeItem('vaultx_search_sessions');
  }
}

// Export singleton instance
export const analytics = new AnalyticsTracker();

// Export individual tracking functions for convenience
export const trackSearch = (event: Omit<SearchEvent, 'sessionId' | 'timestamp' | 'userAgent' | 'referrer'>) => 
  analytics.trackSearch(event);

export const trackFilterChange = (event: Omit<FilterEvent, 'sessionId' | 'timestamp'>) => 
  analytics.trackFilterChange(event);

export const trackToolInteraction = (event: Omit<ToolInteractionEvent, 'sessionId' | 'timestamp'>) => 
  analytics.trackToolInteraction(event);

export const trackPageView = (page: string, searchQuery?: string, filters?: Record<string, any>) => 
  analytics.trackPageView(page, searchQuery, filters);
