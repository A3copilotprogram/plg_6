
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
      <div className='min-h-screen bg-sb-background'>
        <SidebarProvider>
          <AppSidebar displayName={displayName} />
          <SidebarInset>
            <header className='sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-sb-border px-4 bg-sb-background'>
              <SidebarTrigger className='-ml-1 text-sb-text-primary hover:text-sb-primary-light transition-colors duration-200' />
              <UserAccountMenu displayName={displayName} />
            </header>
            <div className='bg-sb-content min-h-[calc(100vh-4rem)] overflow-y-auto'>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }
