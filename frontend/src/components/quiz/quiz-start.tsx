'use client'

import React, {useActionState, useState} from 'react'
import {ChevronDown, ChevronRight, Loader} from 'react-feather'

import {startQuizSession} from '@/actions/quizzes'

import {Button} from '@/components/ui/button'
import ErrorBox from '@/components/ui/ErrorBox'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {DifficultyLevel} from '@/client'

export default function QuizStartComponent({courseId}: {courseId: string}) {
  const [difficultyLevel, setDifficultyLevel] =
    useState<DifficultyLevel>('easy')
  const [state, formAction, isPending] = useActionState(startQuizSession, {
    ok: false,
    error: null,
  })

  return (
    <>
      {!isPending && state && !state?.ok && state?.error && <ErrorBox error={state?.error} />}
      <div className='flex justify-end mb-8'>
        <form action={formAction}>
          <input type='hidden' name='difficultyLevel' value={difficultyLevel} />
          <input type='hidden' name='courseId' value={courseId} />
          <Button
            variant='default'
            type='submit'
            className='mr-4 bg-sb-primary hover:bg-sb-primary-hover text-sb-text-primary border-0'
            disabled={isPending}
          >
            <span>Start Quiz</span>
            {isPending ? <Loader /> : <ChevronRight className='ml-2 h-6 w-6' />}
          </Button>
        </form>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                type='button'
                className='min-w-[120px] flex justify-start items-center bg-sb-surface-hover border-sb-border text-sb-text-primary hover:bg-sb-surface-active'
              >
                <ChevronDown className='h-4 w-4' />
                {difficultyLevel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-[200px] bg-sb-surface border-sb-border'>
              <DropdownMenuItem
                className='gap-2 text-sb-text-primary hover:bg-sb-surface-hover hover:text-sb-text-primary'
                onClick={() => setDifficultyLevel('easy')}
              >
                <span>Easy</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='gap-2 text-sb-text-primary hover:bg-sb-surface-hover hover:text-sb-text-primary'
                onClick={() => setDifficultyLevel('medium')}
              >
                <span>Medium</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='gap-2 text-sb-text-primary hover:bg-sb-surface-hover hover:text-sb-text-primary'
                onClick={() => setDifficultyLevel('hard')}
              >
                <span>Hard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='gap-2 text-sb-text-primary hover:bg-sb-surface-hover hover:text-sb-text-primary'
                onClick={() => setDifficultyLevel('easy')}
              >
                <span>All</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
