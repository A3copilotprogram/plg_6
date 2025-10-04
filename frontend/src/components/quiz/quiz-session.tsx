import React from 'react'

import {CourseWithDocuments} from '@/client'
import {getQuizzes} from '@/actions/quizzes'

import { Separator } from "@/components/ui/separator"
import {Checkbox} from '@/components/ui/checkbox'
import {Label} from '@/components/ui/label'
import ErrorBox from '@/components/ui/ErrorBox'


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
    <div className='h-full flex flex-col bg-sb-background'>
      {result.data.map((quiz) => (
        <div className='flex flex-col gap-6 mb-8'>
          <p className='text-lg text-sb-text-primary'>
            {quiz.quiz_text}
          </p>
          <ul>
            {quiz.choices.map((choice) => (
              <div className='flex gap-3 mb-4' key={choice.id}>
                <Checkbox id={choice.id} value={choice.id} className='border-sb-border data-[state=checked]:bg-sb-primary data-[state=checked]:border-sb-primary' />
                <Label htmlFor={choice.id} className='text-sb-text-primary'>
                  <span className='capitalize text-sm/snug'>{choice.text}</span>
                </Label>
              </div>
            ))}
          </ul>
          <Separator className='bg-sb-border' />
        </div>
      ))}
    </div>
  )
}
