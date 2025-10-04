'use client'

import CreateCourseForm from '@/components/create-course/create-course'
import ProjectSettings from '@/components/project-settings'
import { Settings } from 'react-feather'
import { useState } from 'react'

export default function CreateCoursePage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  return (
    <div className='min-h-screen bg-sb-content flex'>
      {/* Main Content Area - right padding to account for fixed sidebar */}
      <div className='flex-1 p-6 overflow-y-auto pr-80'>
        <div className='max-w-4xl mx-auto'>
          <CreateCourseForm />
        </div>
      </div>

      {/* Right Sidebar - Project Settings - Fixed */}
      <div className='w-80 bg-sb-background border-l border-sb-border fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto'>
        {selectedProjectId ? (
          <ProjectSettings />
        ) : (
          <div className='p-6'>
            <h2 className='text-sb-text-primary font-semibold text-lg mb-6'>Project Settings</h2>
            <div className='flex flex-col items-center justify-center h-[calc(100vh-200px)]'>
              <div className='w-16 h-16 bg-sb-surface-hover rounded-full flex items-center justify-center mb-4'>
                <Settings className='w-8 h-8 text-sb-text-secondary' />
              </div>
              <p className='text-sb-text-secondary text-center'>
                Select a project to see its settings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
