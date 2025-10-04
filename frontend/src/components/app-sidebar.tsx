'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { Home, Plus, File } from 'react-feather'

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
    <Sidebar className='bg-[#2D3748] border-r border-[#4A5568]'>
      <SidebarHeader className='bg-[#2D3748] border-b border-[#4A5568]'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='hover:bg-[#4A5568] hover:text-white transition-colors duration-200'>
              <Link href='/dashboard'>
                <div className='flex items-center'>
                  <div className='bg-[#2563EB] text-white flex aspect-square size-8 items-center justify-center rounded-lg mr-4'>
                    <span className='text-white font-bold text-sm'>S</span>
                  </div>
                  <div className='flex flex-col gap-0.5 leading-none'>
                    <span className='font-medium text-white'>StudyBuddy</span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='bg-[#2D3748] pb-20'>
        <SidebarGroup>
          <SidebarGroupLabel className='text-white font-semibold'>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className='text-white hover:bg-[#4A5568] transition-colors duration-200'>
                  <Link href='/dashboard'>
                    <Home className='text-white' />
                    <span className='text-white'>Dashboard</span>
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
                  <SidebarMenuButton className='text-[#A0AEC0] p-2'>
                    <span>Loading projects...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : courses.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton className='text-[#A0AEC0] p-2'>
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
                        className={`transition-colors duration-200 p-2 ${
                          isActive 
                            ? 'bg-[#4A5568] text-white' 
                            : 'text-[#A0AEC0] hover:bg-[#4A5568] hover:text-white'
                        }`}
                      >
                        <Link href={`/dashboard/courses/${course.id}?tab=chat`}>
                          <File className={`w-4 h-4 mr-3 transition-colors duration-200 ${
                            isActive ? 'text-white' : 'text-[#A0AEC0] group-hover:text-white'
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
      <div className='absolute bottom-0 left-0 right-0 p-4 bg-[#2D3748] border-t border-[#4A5568]'>
        <Button 
          asChild
          className='w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0 justify-start'
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
