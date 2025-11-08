import { createClient } from '@/lib/supabase';

export interface SessionConfig {
  timeoutMs: number; // Session timeout in milliseconds
  warningMs: number; // Warning before timeout in milliseconds
  refreshThresholdMs: number; // Refresh session if less than this time remains
}

export interface SessionInfo {
  userId: string;
  userEmail: string;
  lastActivity: number;
  expiresAt: number;
  isExpired: boolean;
  timeRemaining: number;
}

class SessionManager {
  private config: SessionConfig;
  private supabase: any;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private warningTimeout: NodeJS.Timeout | null = null;
  private logoutTimeout: NodeJS.Timeout | null = null;

  constructor(config: SessionConfig) {
    this.config = config;
    this.supabase = createClient();
    this.startSessionMonitoring();
  }

  /**
   * Get current session information
   */
  getSessionInfo(): SessionInfo | null {
    const session = this.supabase.auth.getSession();
    if (!session) return null;

    const now = Date.now();
    const lastActivity = this.getLastActivity();
    const expiresAt = lastActivity + this.config.timeoutMs;
    const timeRemaining = expiresAt - now;
    const isExpired = timeRemaining <= 0;

    return {
      userId: session.user?.id || '',
      userEmail: session.user?.email || '',
      lastActivity,
      expiresAt,
      isExpired,
      timeRemaining
    };
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    localStorage.setItem('admin_last_activity', Date.now().toString());
  }

  /**
   * Get last activity timestamp
   */
  private getLastActivity(): number {
    const stored = localStorage.getItem('admin_last_activity');
    return stored ? parseInt(stored, 10) : Date.now();
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    const sessionInfo = this.getSessionInfo();
    return sessionInfo ? !sessionInfo.isExpired : false;
  }

  /**
   * Refresh session if needed
   */
  async refreshSessionIfNeeded(): Promise<boolean> {
    const sessionInfo = this.getSessionInfo();
    if (!sessionInfo) return false;

    // If session is close to expiring, refresh it
    if (sessionInfo.timeRemaining < this.config.refreshThresholdMs) {
      try {
        const { data, error } = await this.supabase.auth.refreshSession();
        if (!error && data.session) {
          this.updateActivity();
          return true;
        }
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    }

    return false;
  }

  /**
   * Start session monitoring
   */
  private startSessionMonitoring(): void {
    // Only start monitoring in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check session every minute
    this.sessionCheckInterval = setInterval(() => {
      this.checkSession();
    }, 60000);

    // Set up activity listeners
    this.setupActivityListeners();
  }

  /**
   * Set up activity listeners to detect user activity
   */
  private setupActivityListeners(): void {
    // Only set up listeners in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateActivity();
      }, { passive: true });
    });
  }

  /**
   * Check session status and handle timeouts
   */
  private checkSession(): void {
    const sessionInfo = this.getSessionInfo();
    if (!sessionInfo) return;

    const now = Date.now();
    const timeRemaining = sessionInfo.expiresAt - now;

    // Clear existing timeouts
    if (this.warningTimeout) clearTimeout(this.warningTimeout);
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);

    // Set warning timeout
    if (timeRemaining > this.config.warningMs) {
      this.warningTimeout = setTimeout(() => {
        this.showSessionWarning();
      }, timeRemaining - this.config.warningMs);
    }

    // Set logout timeout
    if (timeRemaining > 0) {
      this.logoutTimeout = setTimeout(() => {
        this.handleSessionExpiry();
      }, timeRemaining);
    }
  }

  /**
   * Show session warning to user
   */
  private showSessionWarning(): void {
    // Only show warning in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    // Create warning modal
    const warningModal = document.createElement('div');
    warningModal.id = 'session-warning-modal';
    warningModal.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Session Expiring Soon</h3>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your admin session will expire in ${Math.floor(this.config.warningMs / 60000)} minutes. 
            Click "Extend Session" to continue working.
          </p>
          <div class="flex space-x-3">
            <button id="extend-session-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Extend Session
            </button>
            <button id="logout-now-btn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
              Logout Now
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(warningModal);

    // Add event listeners
    document.getElementById('extend-session-btn')?.addEventListener('click', () => {
      this.extendSession();
      document.body.removeChild(warningModal);
    });

    document.getElementById('logout-now-btn')?.addEventListener('click', () => {
      this.handleLogout();
      document.body.removeChild(warningModal);
    });
  }

  /**
   * Extend session
   */
  private async extendSession(): Promise<void> {
    try {
      await this.refreshSessionIfNeeded();
      this.updateActivity();
      
      // Show success message
      this.showMessage('Session extended successfully!', 'success');
    } catch (error) {
      console.error('Failed to extend session:', error);
      this.showMessage('Failed to extend session. Please login again.', 'error');
    }
  }

  /**
   * Handle session expiry
   */
  private async handleSessionExpiry(): Promise<void> {
    // Show expiry message
    this.showMessage('Your session has expired. Please login again.', 'error');
    
    // Wait a moment then logout
    setTimeout(async () => {
      await this.handleLogout();
    }, 2000);
  }

  /**
   * Handle logout
   */
  private async handleLogout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect anyway
      window.location.href = '/admin/login';
    }
  }

  /**
   * Show message to user
   */
  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    // Only show message in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-yellow-500 text-white'
    }`;
    messageEl.textContent = message;

    document.body.appendChild(messageEl);

    // Remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(messageEl)) {
        document.body.removeChild(messageEl);
      }
    }, 5000);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.sessionCheckInterval) clearInterval(this.sessionCheckInterval);
    if (this.warningTimeout) clearTimeout(this.warningTimeout);
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }
}

// Default configuration
const defaultConfig: SessionConfig = {
  timeoutMs: 2 * 60 * 60 * 1000, // 2 hours
  warningMs: 15 * 60 * 1000, // 15 minutes
  refreshThresholdMs: 30 * 60 * 1000 // 30 minutes
};

// Export singleton instance
export const sessionManager = new SessionManager(defaultConfig);

// Export types and functions
export { SessionManager };
