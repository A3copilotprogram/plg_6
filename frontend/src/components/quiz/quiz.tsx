import dynamic from 'next/dynamic'
import React from 'react'

import {CourseWithDocuments} from '@/client'
import {getQuizzes} from '@/actions/quizzes'

import ErrorBox from '@/components/ui/ErrorBox'
import PageLoader from '@/components/ui/page-loader'
import QuizStartComponent from './quiz-start'

const QuizStatsPage = dynamic(() => import('./quiz-stats'), {
  ssr: true,
  loading: () => <PageLoader />,
})
const QuizAttempts = dynamic(() => import('./quiz-attempts'), {
  ssr: true,
  loading: () => <PageLoader />,
})

export default async function QuizComponent({
  course,
}: {
  course: CourseWithDocuments
}) {
  const result = await getQuizzes(course.id)

  if (!result.ok) {
    return <ErrorBox error={result.error} />
  }

  return (
    <div className='h-full flex flex-col bg-[#1A202C]'>
      <div className='min-h-screen p-6'>
        <div className='mx-auto max-w-7xl'>
          <QuizStatsPage courseId={course.id} />
          <QuizStartComponent courseId={course.id} />
          <QuizAttempts courseId={course.id} />
        </div>
      </div>
    </div>
  )
}
