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
 * Delete a podcast by ID
 */
export async function DELETE(_req: NextRequest, context: ContextParams): Promise<NextResponse> {
  try {
    const { podcastId } = await context.params
    await PodcastService.deletePodcast(podcastId)
    return NextResponse.json({ message: 'Podcast deleted' }, { status: 200 })
  } catch (error) {
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

