'use client'

import React from 'react'

import { User, ChevronUp, Zap, Home, Plus } from 'react-feather'

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
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
export function AppSidebar({ displayName = 'User' }: { displayName?: string }) {
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
          <SidebarGroupLabel className='text-white font-semibold'>Courses</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className='text-white hover:bg-[#4A5568] hover:text-white transition-colors duration-200'>
                  <Link href='/dashboard'>
                    <Home className='text-white' />
                    <span className='text-white'>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href='/dashboard/courses/create'>
                    <Button className='mt-4 mb-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0'>
                      <Plus className='text-white' />
                      <span className='text-white'>New Course</span>
                    </Button>
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
