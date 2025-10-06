import { API_CONFIG } from './api-config'

export interface GeneratePodcastRequest {
  title?: string
  mode?: 'dialogue' | 'presentation'
  topics?: string
  teacher_voice?: string
  student_voice?: string
  narrator_voice?: string
  document_ids?: string[]
}

export interface Podcast {
  id: string
  course_id: string
  title: string
  transcript: string
  audio_path: string
  storage_backend: string
  duration_seconds?: number
  created_at: string
  updated_at: string
}

export interface PodcastsResponse {
  data: Podcast[]
}

export interface ServiceError extends Error {
  response?: {
    status: number
    data?: {
      detail: string
    }
  }
}

export class PodcastService {
  private static baseURL = API_CONFIG.getBackendUrl()
  
  /**
   * Create a service error with consistent shape for route handlers
   */
  private static createServiceError(message: string, status: number = 500, detail?: string): ServiceError {
    const error = new Error(message) as ServiceError
    error.response = {
      status,
      data: { detail: detail || message }
    }
    return error
  }

  /**
   * Get default headers for API requests
   */
  private static async getHeaders(): Promise<Record<string, string>> {
    return API_CONFIG.getDefaultHeaders()
  }

  /**
   * Get all podcasts for a course
   */
  static async getPodcasts(courseId: string): Promise<PodcastsResponse> {
    try {
      const url = `${this.baseURL}/api/v1/podcasts/${courseId}`
      const headers = await this.getHeaders()
      
      const response = await fetch(url, {
        headers,
        cache: 'no-store',
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw this.createServiceError(
          `Failed to fetch podcasts: ${response.statusText}`,
          response.status,
          errorText
        )
      }
      
      return response.json()
    } catch (error) {
      // Re-throw service errors as-is
      if (error instanceof Error && 'response' in error) {
        throw error
      }
      // Wrap other errors (network, JSON parsing, etc.)
      throw this.createServiceError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      )
    }
  }

  /**
   * Generate a new podcast for a course
   */
  static async generatePodcast(courseId: string, data: GeneratePodcastRequest): Promise<Podcast> {
    try {
      const url = `${this.baseURL}/api/v1/podcasts/${courseId}/generate`
      const headers = await this.getHeaders()
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw this.createServiceError(
          `Failed to generate podcast: ${response.statusText}`,
          response.status,
          errorText
        )
      }
      
      return response.json()
    } catch (error) {
      // Re-throw service errors as-is
      if (error instanceof Error && 'response' in error) {
        throw error
      }
      // Wrap other errors (network, JSON parsing, etc.)
      throw this.createServiceError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      )
    }
  }

  /**
   * Get audio stream for a podcast
   */
  static async getAudioStream(podcastId: string): Promise<Response> {
    try {
      const url = `${this.baseURL}/api/v1/podcasts/by-id/${podcastId}/audio`
      const headers = await API_CONFIG.getAuthHeaders()
      
      const response = await fetch(url, { headers })
      
      if (!response.ok) {
        throw this.createServiceError(
          `Failed to get audio stream: ${response.statusText}`,
          response.status
        )
      }
      
      return response
    } catch (error) {
      // Re-throw service errors as-is
      if (error instanceof Error && 'response' in error) {
        throw error
      }
      // Wrap other errors (network, etc.)
      throw this.createServiceError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      )
    }
  }

  /**
   * Get a single podcast by ID
   */
  static async getPodcast(podcastId: string): Promise<Podcast> {
    try {
      const url = `${this.baseURL}/api/v1/podcasts/by-id/${podcastId}`
      const headers = await this.getHeaders()
      
      const response = await fetch(url, {
        headers,
        cache: 'no-store',
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw this.createServiceError(
          `Failed to fetch podcast: ${response.statusText}`,
          response.status,
          errorText
        )
      }
      
      return response.json()
    } catch (error) {
      // Re-throw service errors as-is
      if (error instanceof Error && 'response' in error) {
        throw error
      }
      // Wrap other errors (network, JSON parsing, etc.)
      throw this.createServiceError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      )
    }
  }

  /**
   * Delete a podcast by ID
   */
  static async deletePodcast(podcastId: string): Promise<void> {
    try {
      const url = `${this.baseURL}/api/v1/podcasts/by-id/${podcastId}`
      const headers = await this.getHeaders()

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw this.createServiceError(
          `Failed to delete podcast: ${response.statusText}`,
          response.status,
          errorText
        )
      }
      return
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        throw error
      }
      throw this.createServiceError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      )
    }
  }
}
