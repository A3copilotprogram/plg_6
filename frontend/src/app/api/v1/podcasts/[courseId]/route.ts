import { type NextRequest, NextResponse } from 'next/server'
import { PodcastService } from '@/lib/podcast-service'
import { get } from '@/utils'

interface ContextParams {
  params: Promise<{ courseId: string }>
}

interface ErrorResponse {
  detail: string
}

/**
 * Get all podcasts for a course
 */
export async function GET(_req: NextRequest, context: ContextParams): Promise<NextResponse> {
  try {
    const { courseId } = await context.params
    const data = await PodcastService.getPodcasts(courseId)
    return NextResponse.json(data)
  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[PodcastService] GET error:', error)
    }
    
    const status: number = get(error as Record<string, never>, 'response.status', 500)
    const body: ErrorResponse = get(
      error as Record<string, never>, 
      'response.data.detail', 
      { detail: 'Internal Server Error' }
    )
    return NextResponse.json(body, { status })
  }
}

/**
 * Generate a new podcast for a course
 */
export async function POST(request: NextRequest, context: ContextParams): Promise<NextResponse> {
  try {
    const { courseId } = await context.params
    const body = await request.json().catch(() => ({}))
    const data = await PodcastService.generatePodcast(courseId, body)
    return NextResponse.json(data)
  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[PodcastService] POST error:', error)
    }
    
    const status: number = get(error as Record<string, never>, 'response.status', 500)
    const body: ErrorResponse = get(
      error as Record<string, never>, 
      'response.data.detail', 
      { detail: 'Internal Server Error' }
    )
    return NextResponse.json(body, { status })
  }
}

export const config = {
  runtime: 'nodejs',
}
