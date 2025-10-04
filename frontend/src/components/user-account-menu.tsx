'use client'

import React from 'react'
import { User, ChevronDown } from 'react-feather'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { logout } from '@/actions/auth'
import { ThemeToggle } from './theme-toggle'

export function UserAccountMenu({ displayName = 'User' }: { displayName?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white hover:bg-[#4A5568] hover:text-white transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium">{displayName}</span>
          <ChevronDown className="w-4 h-4 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#2D3748] border-[#4A5568]"
      >
        <DropdownMenuItem className="text-white hover:bg-[#4A5568] hover:text-white">
          <Link href="/dashboard/user-settings" className="flex items-center w-full">
            <span className="text-white">Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action={logout} className="w-full">
            <button
              type="submit"
              className="w-full text-left cursor-pointer text-white hover:bg-[#4A5568] hover:text-white px-2 py-1.5 rounded"
            >
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountMenu
