'use server'

import { PodcastsService } from '@/client'
import { Result } from '@/lib/result'
import { mapApiError } from '@/lib/mapApiError'
import type { GeneratePodcastRequest, PodcastPublic, PodcastsPublic } from '@/client/types.gen'

export async function getPodcasts(courseId: string): Promise<Result<PodcastsPublic>> {
  try {
    const response = await PodcastsService.getApiV1PodcastsCourseByCourseId({
      path: { course_id: courseId },
      requestValidator: async () => {},
      responseValidator: async () => {},
    })
    return {
      ok: true,
      data: response.data,
    }
  } catch (error) {
    return {
      ok: false,
      error: mapApiError(error),
    }
  }
}

export async function generatePodcast(courseId: string, data: GeneratePodcastRequest): Promise<Result<PodcastPublic>> {
  try {
    const response = await PodcastsService.postApiV1PodcastsCourseByCourseIdGenerate({
      path: { course_id: courseId },
      body: data,
      requestValidator: async () => {},
      responseValidator: async () => {},
    })
    return {
      ok: true,
      data: response.data,
    }
  } catch (error) {
    return {
      ok: false,
      error: mapApiError(error),
    }
  }
}

export async function getPodcast(podcastId: string): Promise<Result<PodcastPublic>> {
  try {
    const response = await PodcastsService.getApiV1PodcastsByPodcastId({
      path: { podcast_id: podcastId },
      requestValidator: async () => {},
      responseValidator: async () => {},
    })
    return {
      ok: true,
      data: response.data,
    }
  } catch (error) {
    return {
      ok: false,
      error: mapApiError(error),
    }
  }
}

export async function deletePodcast(podcastId: string): Promise<Result<null>> {
  try {
    await PodcastsService.deleteApiV1PodcastsByPodcastId({
      path: { podcast_id: podcastId },
      requestValidator: async () => {},
      responseValidator: async () => {},
    })
    return {
      ok: true,
      data: null,
    }
  } catch (error) {
    return {
      ok: false,
      error: mapApiError(error),
    }
  }
}
