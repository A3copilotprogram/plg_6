
  import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
  } from '@/components/ui/sidebar'
  import AppSidebar from '@/components/app-sidebar'
  import { client } from '@/client/client.gen'
  import { cookies } from 'next/headers'
import { getMe } from '@/actions/users'
import UserAccountMenu from '@/components/user-account-menu'

  export default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    let displayName = '';
    // Configure axios client per request
    client.setConfig({
      baseURL: process.env.NEXT_INTERNAL_BACKEND_BASE_URL ?? 'http://localhost:8000',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })

    // fetch current user server-side for sidebar display
    const result = await getMe()
    if(result.ok) {
      const me = result.data
      displayName = (me.full_name && me.full_name.trim().length > 0)
        ? (me.full_name as string)
        : (me.email ?? 'User')
    }

    return (
      <div className='min-h-screen bg-[#1A202C]'>
        <SidebarProvider>
          <AppSidebar displayName={displayName} />
          <SidebarInset>
            <header className='flex h-16 shrink-0 items-center justify-between border-b border-[#4A5568] px-4 bg-[#2D3748]'>
              <SidebarTrigger className='-ml-1 text-white hover:text-[#60A5FA] transition-colors duration-200' />
              <UserAccountMenu displayName={displayName} />
            </header>
            <div className='bg-[#1A202C] min-h-[calc(100vh-4rem)]'>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }
