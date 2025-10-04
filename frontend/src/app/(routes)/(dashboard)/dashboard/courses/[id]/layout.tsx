import PageLoader from '@/components/ui/page-loader'
import dynamic from 'next/dynamic'

const ProjectSettings = dynamic(() => import('@/components/project-settings'), {
  ssr: true,
  loading: () => <PageLoader />,
})

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex">
      {/* Main Content - right padding for fixed sidebar */}
      <div className="flex-1 pr-80">
        {children}
      </div>
      
      {/* Fixed Project Settings Sidebar */}
      <div className="w-80 bg-sb-background border-l border-sb-border fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <ProjectSettings />
      </div>
    </div>
  )
}
