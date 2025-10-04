'use client'

import CreateCourseForm from '@/components/create-course/create-course'

export default function CreateCoursePage() {
  return (
    <div className='min-h-screen bg-[#1A202C] p-6'>
      <div className='mx-auto max-w-4xl'>
          <CreateCourseForm />
      </div>
    </div>
  )
}
