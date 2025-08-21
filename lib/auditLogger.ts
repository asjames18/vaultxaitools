import { createClient } from '@supabase/supabase-js';

export interface AuditLogEntry {
  id?: string;
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface AuditLogQuery {
  user_id?: string;
  action?: string;
  resource_type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

class AuditLogger {
  private supabase: any;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' || process.env.ENABLE_AUDIT_LOGGING === 'true';
    
    if (this.isEnabled) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (supabaseUrl && supabaseServiceKey) {
        this.supabase = createClient(supabaseUrl, supabaseServiceKey);
      } else {
        console.warn('Audit logging disabled: Missing Supabase credentials');
        this.isEnabled = false;
      }
    }
  }

  /**
   * Log an admin action
   */
  async logAction(entry: Omit<AuditLogEntry, 'created_at'>): Promise<void> {
    if (!this.isEnabled || !this.supabase) {
      // In development or when disabled, just console.log
      console.log('🔍 AUDIT LOG:', entry);
      return;
    }

    try {
      const { error } = await this.supabase
        .from('audit_logs')
        .insert([entry]);

      if (error) {
        console.error('Failed to log audit entry:', error);
        // Fallback to console logging
        console.log('🔍 AUDIT LOG (FALLBACK):', entry);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
      // Fallback to console logging
      console.log('🔍 AUDIT LOG (FALLBACK):', entry);
    }
  }

  /**
   * Log user login
   */
  async logLogin(userId: string, userEmail: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action: 'LOGIN',
      resource_type: 'AUTH',
      details: { method: 'password' },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  /**
   * Log user logout
   */
  async logLogout(userId: string, userEmail: string, ipAddress?: string): Promise<void> {
    await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action: 'LOGOUT',
      resource_type: 'AUTH',
      details: {},
      ip_address: ipAddress
    });
  }

  /**
   * Log CRUD operations
   */
  async logCRUD(
    userId: string,
    userEmail: string,
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    resourceType: string,
    resourceId: string,
    details: Record<string, any> = {},
    ipAddress?: string
  ): Promise<void> {
    await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: ipAddress
    });
  }

  /**
   * Log sensitive operations
   */
  async logSensitiveOperation(
    userId: string,
    userEmail: string,
    action: string,
    details: Record<string, any> = {},
    ipAddress?: string
  ): Promise<void> {
    await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action,
      resource_type: 'SENSITIVE',
      details,
      ip_address: ipAddress
    });
  }

  /**
   * Query audit logs
   */
  async queryLogs(query: AuditLogQuery): Promise<AuditLogEntry[]> {
    if (!this.isEnabled || !this.supabase) {
      return [];
    }

    try {
      let queryBuilder = this.supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (query.user_id) {
        queryBuilder = queryBuilder.eq('user_id', query.user_id);
      }
      if (query.action) {
        queryBuilder = queryBuilder.eq('action', query.action);
      }
      if (query.resource_type) {
        queryBuilder = queryBuilder.eq('resource_type', query.resource_type);
      }
      if (query.start_date) {
        queryBuilder = queryBuilder.gte('created_at', query.start_date);
      }
      if (query.end_date) {
        queryBuilder = queryBuilder.lte('created_at', query.end_date);
      }
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }
      if (query.offset) {
        queryBuilder = queryBuilder.range(query.offset, query.offset + (query.limit || 50) - 1);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Failed to query audit logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Audit log query error:', error);
      return [];
    }
  }

  /**
   * Get audit log statistics
   */
  async getStats(days: number = 30): Promise<Record<string, any>> {
    if (!this.isEnabled || !this.supabase) {
      return {};
    }

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('action, resource_type, created_at')
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Failed to get audit stats:', error);
        return {};
      }

      const stats = {
        totalActions: data?.length || 0,
        actionsByType: {} as Record<string, number>,
        resourcesByType: {} as Record<string, number>,
        actionsByDay: {} as Record<string, number>
      };

      data?.forEach((entry: any) => {
        // Count actions by type
        stats.actionsByType[entry.action] = (stats.actionsByType[entry.action] || 0) + 1;
        
        // Count resources by type
        stats.resourcesByType[entry.resource_type] = (stats.resourcesByType[entry.resource_type] || 0) + 1;
        
        // Count actions by day
        const day = entry.created_at.split('T')[0];
        stats.actionsByDay[day] = (stats.actionsByDay[day] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Audit stats error:', error);
      return {};
    }
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

// Convenience functions for common operations
export const logAdminAction = auditLogger.logAction.bind(auditLogger);
export const logLogin = auditLogger.logLogin.bind(auditLogger);
export const logLogout = auditLogger.logLogout.bind(auditLogger);
export const logCRUD = auditLogger.logCRUD.bind(auditLogger);
export const logSensitiveOperation = auditLogger.logSensitiveOperation.bind(auditLogger);
export const queryAuditLogs = auditLogger.queryLogs.bind(auditLogger);
export const getAuditStats = auditLogger.getStats.bind(auditLogger);
