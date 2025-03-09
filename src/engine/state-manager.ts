/**
 * State Manager Module
 * Provides utilities for storing and retrieving session state
 */

export interface SessionState {
  sessionId: string;
  created: number;
  lastAccessed: number;
  data: Record<string, any>;
}

/**
 * Options for state manager configuration
 */
export interface StateManagerOptions {
  // Maximum time in milliseconds to keep a session before expiring (default: 30 minutes)
  sessionExpiry?: number;
  // Maximum number of sessions to store (default: 100)
  maxSessions?: number;
}

/**
 * StateManager class that provides session state management
 */
export class StateManager {
  private enabled: boolean;
  private sessions: Map<string, SessionState>;
  private options: Required<StateManagerOptions>;
  
  // Default options
  private static defaultOptions: Required<StateManagerOptions> = {
    sessionExpiry: 30 * 60 * 1000, // 30 minutes
    maxSessions: 100
  };
  
  constructor(enabled: boolean = false, options: StateManagerOptions = {}) {
    this.enabled = enabled;
    this.sessions = new Map<string, SessionState>();
    this.options = { ...StateManager.defaultOptions, ...options };
    
    // Set up session expiry check if enabled
    if (this.enabled) {
      setInterval(() => this.cleanExpiredSessions(), 60 * 1000); // Check every minute
    }
  }
  
  /**
   * Set whether state management is enabled
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    
    // If disabled, clear all sessions
    if (!enabled) {
      this.sessions.clear();
    }
  }
  
  /**
   * Get the current state for a session
   */
  public getState(sessionId: string): Record<string, any> | undefined {
    if (!this.enabled) {
      return undefined;
    }
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      return undefined;
    }
    
    // Update last accessed time
    session.lastAccessed = Date.now();
    return session.data;
  }
  
  /**
   * Store state data for a session
   */
  public setState(sessionId: string, data: Record<string, any>): void {
    if (!this.enabled) {
      return;
    }
    
    const now = Date.now();
    const existing = this.sessions.get(sessionId);
    
    if (existing) {
      // Update existing session
      existing.lastAccessed = now;
      existing.data = { ...data };
    } else {
      // Create new session
      const newSession: SessionState = {
        sessionId,
        created: now,
        lastAccessed: now,
        data: { ...data }
      };
      
      // Check if we need to make room for a new session
      if (this.sessions.size >= this.options.maxSessions) {
        this.removeOldestSession();
      }
      
      this.sessions.set(sessionId, newSession);
    }
  }
  
  /**
   * Clear a specific session
   */
  public clearSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
  
  /**
   * Clear all sessions
   */
  public clearAllSessions(): void {
    this.sessions.clear();
  }
  
  /**
   * Get the number of active sessions
   */
  public getSessionCount(): number {
    return this.sessions.size;
  }
  
  /**
   * Check if a session exists
   */
  public hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }
  
  /**
   * Remove expired sessions
   */
  private cleanExpiredSessions(): void {
    if (!this.enabled) {
      return;
    }
    
    const now = Date.now();
    const expiryThreshold = now - this.options.sessionExpiry;
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastAccessed < expiryThreshold) {
        this.sessions.delete(sessionId);
      }
    }
  }
  
  /**
   * Remove the oldest session based on last access time
   */
  private removeOldestSession(): void {
    let oldestSession: SessionState | null = null;
    let oldestSessionId: string | null = null;
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (!oldestSession || session.lastAccessed < oldestSession.lastAccessed) {
        oldestSession = session;
        oldestSessionId = sessionId;
      }
    }
    
    if (oldestSessionId) {
      this.sessions.delete(oldestSessionId);
    }
  }
}
