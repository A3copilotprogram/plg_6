import {getQuizSession} from '@/actions/quizzes'
import ErrorBox from '@/components/ui/ErrorBox'
import QuizForm from './QuizForm'
import {Tabs, TabsContent, TabsList, StyledTabList} from '@/components/ui/tabs'
import Link from 'next/link'

export default async function Page(props: {
  params: {id: string; sessionId: string}
}) {
  const params = await props.params

  const sessionId = params.sessionId
  const courseId = params.id

  const result = await getQuizSession(sessionId)

  if (!result.ok) {
    return <ErrorBox error={result.error} />
  }

  return (
    <div className='h-full bg-sb-content'>
      <Tabs
        defaultValue='quiz'
        className='w-full h-full'
      >
        <TabsList className='w-full justify-start bg-sb-background border-b border-sb-border rounded-none h-12 p-0 sticky top-0 z-20'>
          <StyledTabList name='quiz' />
          <StyledTabList name='chat' />
          <StyledTabList name='flashcard' />
          <StyledTabList name='podcast' />
        </TabsList>
        <div className='overflow-y-auto h-[calc(100vh-7rem)]'>
          <TabsContent value='quiz' className='p-6 bg-sb-content m-0'>
            <div className='mx-auto max-w-7xl'>
              <QuizForm sessionId={sessionId} courseId={courseId} />
            </div>
          </TabsContent>

          <TabsContent value='chat' className='p-6 bg-sb-content m-0'>
            <div className='text-center text-sb-text-secondary py-12'>
              <Link href={`/dashboard/courses/${courseId}?tab=chat`} className='text-sb-primary hover:underline'>
                Go to Chat
              </Link>
            </div>
          </TabsContent>

          <TabsContent value='flashcard' className='p-6 bg-sb-content m-0'>
            <div className='text-center text-sb-text-secondary py-12'>
              <Link href={`/dashboard/courses/${courseId}?tab=flashcard`} className='text-sb-primary hover:underline'>
                Go to Flashcards
              </Link>
            </div>
          </TabsContent>

          <TabsContent value='podcast' className='p-6 bg-sb-content m-0'>
            <div className='text-center text-sb-text-secondary py-12'>
              <Link href={`/dashboard/courses/${courseId}?tab=podcast`} className='text-sb-primary hover:underline'>
                Go to Podcast
              </Link>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
