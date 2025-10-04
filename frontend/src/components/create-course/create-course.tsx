'use client'

import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import UploadDocuments from './upload-documents'
import CourseForm from './course-form'
import {COURSE_ID, STEPS} from './constant'

export function CreateCourse() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get(COURSE_ID)

  const [step, setStep] = useState(STEPS.CREATE_COURSE)

  useEffect(() => {
    if (courseId && step !== STEPS.UPLOAD_DOCUMENTS) {
      setStep(STEPS.UPLOAD_DOCUMENTS)
    }
  }, [courseId, step])

  return (
    <>
      <div className='mb-6'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className='text-sb-text-secondary'>Create</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-sb-text-secondary'>Documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {step === STEPS.CREATE_COURSE ? (
        <>
          <div className='mb-8'>
              <h1 className='text-2xl font-semibold text-sb-text-primary'>
              Create a new project
            </h1>
          </div>
          <div className='space-y-6'>
            <CourseForm />
          </div>
        </>
      ) : (
        <>
          <div className='mb-8'>
              <h1 className='text-2xl font-semibold text-sb-text-primary'>
              Upload Documents
            </h1>
          </div>
          <div className='space-y-6'>
            {courseId && <UploadDocuments courseId={courseId} />}
          </div>
        </>
      )}
    </>
  )
}

export default CreateCourse
