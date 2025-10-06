/**
 * Centralized API configuration utilities for consistent backend communication
 */

export const API_CONFIG = {
  /**
   * Get the backend URL with optional path
   */
  getBackendUrl: (path: string = '') => {
    const baseUrl = process.env.NEXT_INTERNAL_BACKEND_BASE_URL || 'http://backend:8000'
    return `${baseUrl}${path}`
  },
  
  /**
   * Get authentication headers for server-side requests
   */
  getAuthHeaders: async (): Promise<Record<string, string>> => {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  /**
   * Get default headers for API requests
   */
  getDefaultHeaders: async (): Promise<Record<string, string>> => {
    const authHeaders = await API_CONFIG.getAuthHeaders()
    return {
      'Content-Type': 'application/json',
      ...authHeaders,
    }
  }
}
