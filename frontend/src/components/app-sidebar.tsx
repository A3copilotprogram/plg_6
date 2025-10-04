'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { User, ChevronUp, Zap, Home, Plus, File } from 'react-feather'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { logout } from '@/actions/auth'
import { getCourses } from '@/actions/courses'
import { CourseWithOptionalDate } from '@/types/date'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-[#4A5568] data-[state=open]:text-white hover:bg-[#4A5568] hover:text-white transition-colors duration-200'
                >
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
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='bg-[#2D3748]'>
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

        {/* Add New Project */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className='text-[#A0AEC0] hover:bg-[#4A5568] hover:text-white transition-colors duration-200 p-2'>
                  <Link href='/dashboard/courses/create'>
                    <Plus className='w-4 h-4 text-[#A0AEC0] hover:text-white mr-3' />
                    <span>Add new project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='bg-[#2D3748] border-t border-[#4A5568]'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className='text-white hover:bg-[#4A5568] hover:text-white transition-colors duration-200'>
                  <User className='text-white' /> 
                  <span className='text-white'>{displayName}</span>
                  <ChevronUp className='ml-auto text-white' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-popper-anchor-width] bg-[#2D3748] border-[#4A5568]'
              >
                <DropdownMenuItem className='text-white hover:bg-[#4A5568] hover:text-white'>
                  <Link href='/dashboard/user-settings'>
                    <span className='text-white'>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form action={logout}>
                    <button
                      type='submit'
                      className='w-full text-left cursor-pointer text-white hover:bg-[#4A5568] hover:text-white px-2 py-1.5 rounded'
                    >
                      Sign out
                    </button>
                  </form>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <ThemeToggle />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
