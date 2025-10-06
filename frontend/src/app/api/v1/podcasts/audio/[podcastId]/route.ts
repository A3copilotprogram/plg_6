import { type NextRequest, NextResponse } from 'next/server'
import { PodcastService } from '@/lib/podcast-service'
import { get } from '@/utils'

interface ContextParams {
  params: Promise<{ podcastId: string }>
}

interface ErrorResponse {
  detail: string
}

/**
 * Stream audio for a podcast
 * Handles both local file streaming and S3 presigned URLs
 */
export async function GET(_req: NextRequest, context: ContextParams): Promise<NextResponse> {
  try {
    const { podcastId } = await context.params
    const response = await PodcastService.getAudioStream(podcastId)
    
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    if (contentType.includes('application/json')) {
      const text = await response.text()
      return new NextResponse(text, { 
        status: response.status, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }
    
    const blob = await response.arrayBuffer()
    return new NextResponse(blob, { 
      status: response.status, 
      headers: { 'Content-Type': contentType } 
    })
  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[PodcastService] Audio stream error:', error)
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
