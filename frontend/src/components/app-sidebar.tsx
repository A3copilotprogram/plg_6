'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { Home, Plus, File, Zap } from 'react-feather'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { getCourses } from '@/actions/courses'
import { CourseWithOptionalDate } from '@/types/date'
import Link from 'next/link'

export function AppSidebar({ displayName = 'User' }: { displayName?: string }) {
  const [courses, setCourses] = useState<CourseWithOptionalDate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getCourses()
        if (result.ok) {
          setCourses(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Extract course ID from pathname for highlighting
  const getCurrentCourseId = () => {
    const courseMatch = pathname.match(/\/dashboard\/courses\/([^\/]+)/)
    return courseMatch ? courseMatch[1] : null
  }

  const currentCourseId = getCurrentCourseId()

  return (
    <Sidebar className='bg-sb-surface border-r border-sb-border'>
      <SidebarHeader className='bg-sb-surface border-b border-sb-border'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='hover:bg-sb-surface-hover hover:text-sb-text-primary transition-colors duration-200'>
              <Link href='/dashboard'>
                <div className='flex items-center'>
                  <div className='bg-sb-primary text-sb-text-primary flex aspect-square size-8 items-center justify-center rounded-lg mr-4'>
                    <Zap className='size-4' />
                  </div>
                  <div className='flex flex-col gap-0.5 leading-none'>
                    <span className='font-medium text-sb-text-primary'>StudyBuddy</span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='bg-sb-surface pb-20'>
        <SidebarGroup>
          <SidebarGroupLabel className='text-sb-text-primary font-semibold'>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className='text-sb-text-primary hover:bg-sb-surface-hover transition-colors duration-200'>
                  <Link href='/dashboard'>
                    <Home className='text-sb-text-primary' />
                    <span className='text-sb-text-primary'>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Project List */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <SidebarMenuItem>
                  <SidebarMenuButton className='text-sb-text-secondary p-2'>
                    <span>Loading projects...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : courses.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton className='text-sb-text-secondary p-2'>
                    <span>No projects yet</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                courses.map((course) => {
                  const isActive = currentCourseId === course.id
                  return (
                    <SidebarMenuItem key={course.id}>
                      <SidebarMenuButton 
                        asChild
                        className={`transition-colors duration-200 p-2 sidebar-accent-foreground:!text-sb-text-primary sidebar-accent:!bg-sb-surface-hover ${
                          isActive 
                            ? 'bg-sb-surface-hover text-sb-text-primary' 
                            : 'text-sb-text-secondary hover:bg-sb-surface-hover hover:text-sb-text-primary'
                        }`}
                      >
                        <Link href={`/dashboard/courses/${course.id}?tab=chat`}>
                          <File className={`w-4 h-4 mr-3 transition-colors duration-200 ${
                            isActive ? 'text-sb-text-primary' : 'text-sb-text-secondary group-hover:text-sb-text-primary'
                          }`} />
                          <span className='truncate'>{course.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      
      {/* Fixed Add New Project Button at Bottom */}
      <div className='absolute bottom-0 left-0 right-0 p-4 bg-sb-surface border-t border-sb-border'>
        <Button 
          asChild
          className='w-full bg-sb-primary hover:bg-sb-primary-hover text-sb-text-primary border-0 justify-start'
        >
          <Link href='/dashboard/courses/create'>
            <Plus className='w-4 h-4 mr-2' />
            <span>+ New Project</span>
          </Link>
        </Button>
      </div>
    </Sidebar>
  )
}

export default AppSidebar