import {ChevronRight} from 'react-feather'
import {formatDate} from '@/lib/date'

import {getAttemptedQuizzes} from '@/actions/quizzes'
import ErrorBox from '@/components/ui/ErrorBox'
import Link from 'next/link'

const getScoreBgColor = (percentage: number) => {
  if (percentage === 0) return 'bg-sb-surface-hover text-sb-text-primary'
  if (percentage > 0 && percentage < 25) return 'bg-red-500 text-white'
  if (percentage >= 25 && percentage < 75) return 'bg-yellow-500 text-white'

  return 'bg-green-500 text-white'
}

export default async function QuizAttempts({courseId}: {courseId: string}) {
  const result = await getAttemptedQuizzes(courseId)

  if (!result.ok) {
    return <ErrorBox error={result.error} />
  }

  if (result.data.length === 0) {
    return (
      <div className='min-h-[200px] flex flex-col items-center justify-center'>
        <h2 className='mb-6 text-2xl font-semibold text-sb-text-primary'>
          No quiz attempts yet
        </h2>
      </div>
    )
  }

  return (
    <div>
      <h2 className='mb-6 text-2xl font-semibold text-sb-text-primary'>
        Quiz Attempts
      </h2>
      <div className='space-y-4'>
        {result.data.map((attempt, idx) => (
          <Link key={attempt.id} href={`/dashboard/courses/${courseId}/quiz-session/${attempt.id}`} className="p-4">
            <div
              className='flex items-center justify-between rounded-2xl border border-sb-border bg-sb-surface p-4 transition-colors hover:bg-sb-surface-hover h-[74px]'
            >
              <div className='flex items-center gap-6'>
                <div className='font-medium text-sb-text-secondary'>#{idx + 1}</div>
                {!attempt.is_completed ? (
                  <span className='py-1 px-1 rounded-md bg-yellow-500 text-white font-semibold text-xs'>
                    In progress
                  </span>
                ) : (
                  <div
                    className={`rounded-lg px-4 py-2 font-semibold ${getScoreBgColor(
                      attempt.score_percentage ?? 0,
                    )}`}
                  >
                    {attempt.total_correct}/{attempt.total_submitted}
                  </div>
                )}
                <div className='text-sb-text-secondary'>
                  {formatDate(attempt.created_at)}
                </div>
              </div>
              <ChevronRight className='h-5 w-5 text-sb-text-secondary' />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
