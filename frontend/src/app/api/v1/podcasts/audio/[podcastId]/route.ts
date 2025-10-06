import { type NextRequest, NextResponse } from 'next/server'
import { PodcastsService } from '@/client'
import { get } from '@/utils'

interface ContextParams {
  params: Promise<{ podcastId: string }>
}

/**
 * Stream audio for a podcast
 * Uses the same pattern as chat streaming with generated client
 */
export async function GET(_req: NextRequest, context: ContextParams) {
  try {
    const { podcastId } = await context.params
    
    // First, try to get the response without specifying responseType to detect the content type
    const response = await PodcastsService.getApiV1PodcastsByPodcastIdAudio({
      path: { podcast_id: podcastId },
      requestValidator: async () => {},
      responseValidator: async () => {},
    })

    // Check if response is JSON (i.e S3) or binary (local)
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      // S3 case: response contains {"url": "presigned_s3_url"}
      const data = response.data as { url: string }
      
      // Redirect to the S3 URL
      return NextResponse.redirect(data.url)
    } else {
      // Local case: response contains audio stream
      // Now fetch stream with proper responseType
      const streamResponse = await PodcastsService.getApiV1PodcastsByPodcastIdAudio({
        path: { podcast_id: podcastId },
        requestValidator: async () => {},
        responseValidator: async () => {},
        responseType: 'stream',
      })

      // Convert Node.js IncomingMessage to Web ReadableStream (same as chat)
      const nodeStream = streamResponse.data as any

      if (!nodeStream || typeof nodeStream.pipe !== 'function') {
        throw new Error('Expected Node readable stream from PodcastsService')
      }

      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on('data', (chunk: Buffer) => {
            // Convert Buffer to Uint8Array for Web ReadableStream
            controller.enqueue(new Uint8Array(chunk))
          })

          nodeStream.on('end', () => {
            controller.close()
          })

          nodeStream.on('error', (error: Error) => {
            controller.error(error)
          })
        },

        cancel() {
          nodeStream.destroy()
        }
      })

      return new Response(webStream, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'no-cache',
          'Accept-Ranges': 'bytes',
          'X-Accel-Buffering': 'no',
        },
      })
    }
  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[PodcastAudio] Audio stream error:', error)
    }
    
    const status: number = get(
      error as Record<string, never>,
      'response.status',
      500,
    )
    const body: { detail: string } = get(
      error as Record<string, never>,
      'response.data.detail',
      {
        detail: 'Internal Server Error',
      },
    )
    return NextResponse.json(body, { status })
  }
}

export const config = {
  runtime: 'nodejs',
  maxDuration: 300,
}
