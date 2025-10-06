import { type NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'
import { get } from '@/utils'

interface ContextParams {
  params: Promise<{ courseId: string }>
}

interface ErrorResponse {
  detail: string
}

/**
 * Get documents for a course
 */
export async function GET(_req: NextRequest, context: ContextParams): Promise<NextResponse> {
  try {
    const { courseId } = await context.params
    const url = API_CONFIG.getBackendUrl(`/api/v1/documents/by-course/${courseId}`)
    const headers = await API_CONFIG.getAuthHeaders()
    
    const res = await fetch(url, { headers, cache: 'no-store' })
    const text = await res.text()
    return new NextResponse(text, { 
      status: res.status, 
      headers: { 'Content-Type': 'application/json' } 
    })
  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[Documents API] GET error:', error)
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

