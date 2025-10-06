'use server'

import {DocumentsService, CoursesService} from '@/client'
import {Result} from '@/lib/result'
import {IState} from '@/types/common'
import {mapApiError} from '@/lib/mapApiError'

export async function getDocumentsByCourse(courseId: string): Promise<Result<any[]>> {
  try {
    const response = await CoursesService.getApiV1CoursesByIdDocuments({
      path: { id: courseId },
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

export async function deleteDocument(
  _state: IState,
  formData: FormData,
): Promise<Result<null>> {
  try {
    const documentId = formData.get('documentId') as string
    if (!documentId) {
      throw new Error('Missing documentId')
    }
    await DocumentsService.deleteApiV1DocumentsById({path: {id: documentId}})
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
