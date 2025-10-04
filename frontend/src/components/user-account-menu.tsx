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
// import { ThemeToggle } from './theme-toggle'

export function UserAccountMenu({ displayName = 'User' }: { displayName?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-sb-text-primary hover:bg-sb-surface-hover hover:text-sb-text-primary transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-sb-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-sb-text-primary" />
          </div>
          <span className="text-sb-text-primary font-medium">{displayName}</span>
          <ChevronDown className="w-4 h-4 text-sb-text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-sb-surface border-sb-border"
      >
        <DropdownMenuItem className="text-sb-text-primary hover:bg-sb-surface-hover hover:text-sb-text-primary">
          <Link href="/dashboard/user-settings" className="flex items-center w-full">
            <span className="text-sb-text-primary">Account Settings</span>
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <ThemeToggle />
        </DropdownMenuItem> */}
        <DropdownMenuItem asChild>
          <form action={logout} className="w-full">
            <button
              type="submit"
              className="w-full text-left cursor-pointer text-sb-text-primary hover:bg-sb-surface-hover hover:text-sb-text-primary px-2 py-1.5 rounded"
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
