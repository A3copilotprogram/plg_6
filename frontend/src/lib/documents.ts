import { DocumentsService } from '@/client'

import { AxiosProgressEvent } from 'axios'
import { mapApiError } from './mapApiError'
import { Result } from './result'

export async function uploadDocuments(
  courseId: string,
  documents: File[],
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<Result<any>> {
  try {
    const formData = new FormData()
    formData.append('course_id', courseId)

    documents.forEach((file) => {
      formData.append('files', file)
    })
    const response = await DocumentsService.postApiV1DocumentsProcess({
      body: {
        files: documents,
        course_id: courseId,
      },
      // openapi-ts misinterpret this as a plain string rather than a File
      // object. This bypasses the validation
      requestValidator: async () => {},
      onUploadProgress: onUploadProgress,
    })

    return {
      ok: true,
      data: response.data,
    }
  } catch (error) {
    return {
      error: mapApiError(error),
      ok: false,
    }
  }
}
