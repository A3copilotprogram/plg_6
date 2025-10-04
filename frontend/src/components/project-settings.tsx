'use client'

import {FileText, X} from 'react-feather'
import {useActionState, useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'

import {CourseWithDocuments} from '@/client'
import {getCourse} from '@/lib/courses'
import {deleteDocument} from '@/actions/documents'
import {IState} from '@/types/common'
import UploadComponent from '@/components/upload-component'

export default function ProjectSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [course, setCourse] = useState<CourseWithDocuments>()

  const handleOnSubmit = (_state: IState, formData: FormData) => {
    deleteDocument(_state, formData)
      .then(() => {
        if (course) {
          getCourse(course.id).then((result) => {
            if (result.ok) {
              setCourse(result.data)
            }
          })
        }
      })
      .catch(() => {
        toast.error('Failed to delete document. Please try again.')
      })
  }

  const [_state, formAction, isPending] = useActionState<IState>(
    handleOnSubmit,
    {
      message: null,
      success: false,
    },
  )

  const params = useParams()
  const courseId = params.id as string

  const fetchCourse = async (id: string) => {
    try {
      const result = await getCourse(id)
      if (result.ok) {
        setCourse(result.data)
      } else {
        toast.error('Failed to fetch course details. Please try again.')
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchCourse(courseId)
  }, [courseId])

  if (isLoading) {
    return (
      <div className='p-4'>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isLoading && !course) {
    return null
  }

  return (
    <div className='p-6 bg-[#2D3748] text-white'>
      <h1 className='text-xl font-semibold mb-6 text-white'>Project Settings</h1>

      {course && (
        <div className='space-y-6'>
          {/* Project Name Section */}
          <div className='space-y-2'>
            <Label
              htmlFor='project-name'
              className='text-sm text-[#A0AEC0]'
            >
              Project Name
            </Label>
            <Input
              id='project-name'
              defaultValue={course.name}
              className='bg-[#4A5568] border-[#4A5568] text-white placeholder-[#A0AEC0] focus:ring-[#2563EB]'
            />
          </div>

          {/* Description Section */}
          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-sm text-[#A0AEC0]'
            >
              Description
            </Label>
            <Textarea
              id='description'
              defaultValue={course.description}
              className='bg-[#4A5568] border-[#4A5568] text-white placeholder-[#A0AEC0] focus:ring-[#2563EB] min-h-[80px] resize-none'
            />
          </div>
          {/* Upload more documents Section */}
          <div className='space-y-2'>
            <Label
              htmlFor='upload-more-docs'
              className='text-sm text-[#A0AEC0]'
            >
              Upload More Documents
            </Label>
            <UploadComponent
              courseId={course.id}
              callback={() => fetchCourse(course.id)}
            />
          </div>

          {/* Documents Section */}
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-white'>Documents</h2>

            <div className='space-y-3 scroll-auto'>
              {course?.documents && course?.documents.length === 0 ? (
                <div className='text-sm text-[#A0AEC0]'>
                  No documents uploaded.
                </div>
              ) : (
                <>
                  {(course?.documents ?? []).map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between p-3 bg-[#4A5568] rounded-lg border border-[#4A5568]'
                    >
                      <div className='flex items-center gap-3'>
                        <FileText className='h-5 w-5 text-[#A0AEC0]' />
                        <div>
                          <div className='text-sm font-medium text-white mb-2'>
                            {doc.filename}
                          </div>
                          <div className='text-xs text-[#A0AEC0]'>
                            Updated on {doc.updated_at}
                          </div>
                        </div>
                      </div>
                      <form action={formAction}>
                        <input type='hidden' name='documentId' value={doc.id} />
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-6 w-6 p-0 text-[#A0AEC0] hover:text-white'
                          disabled={isPending}
                        >
                          {isPending ? '...' : <X className='h-4 w-4' />}
                        </Button>
                      </form>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
