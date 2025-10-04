import dynamic from 'next/dynamic'

import {getCourse} from '@/actions/courses'
import ErrorBox from '@/components/ui/ErrorBox'
import {Tabs, TabsContent, TabsList, StyledTabList} from '@/components/ui/tabs'
import PageLoader from '@/components/ui/page-loader'
import Flashcard from '@/components/flashcard'

const QuizComponent = dynamic(() => import('@/components/quiz/quiz'), {
  ssr: true,
  loading: () => <PageLoader />,
})

const ChatComponent = dynamic(() => import('@/components/chat'), {
  ssr: true,
  loading: () => <PageLoader />,
})

export default async function Page(props: {params: Promise<{id: string}>}) {
  const params = await props.params
  const id = params.id

  const result = await getCourse(id)

  if (!result.ok) {
    return <ErrorBox error={result.error} />
  }

  const course = result.data

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
            <QuizComponent course={course} />
          </TabsContent>

          <TabsContent value='chat' className='p-6 bg-sb-content m-0'>
            <ChatComponent courseId={id} />
          </TabsContent>

          <TabsContent value='flashcard' className='p-6 bg-sb-content m-0'>
            <Flashcard courseId={id}/>
          </TabsContent>

          <TabsContent value='podcast' className='p-6 bg-sb-content m-0'>
            <div className='text-center text-sb-text-secondary py-12'>
              Podcast content will be displayed here
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
