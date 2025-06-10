
'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from './header';
import AppSidebarNav from './sidebar-nav';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const authLayoutPages = ['/', '/register', '/forgot-password'];

  // If initial auth check is still loading for any page
  if (isLoading) {
     return (
        <div className="flex h-screen items-center justify-center bg-background">
          <Spinner size="large" />
        </div>
     );
  }
  
  // If on an auth page (login, register, etc.) and not logged in (or user just logged out)
  // render children directly without the main app layout.
  if (authLayoutPages.includes(pathname) && !user) {
    return <main>{children}</main>;
  }

  // If for some reason we are on an auth page but the user IS logged in,
  // this usually means a redirect is imminent (handled by the page itself or withAuth).
  // Showing the full layout might cause a flicker. It's safer to show a loading or blank state.
  // However, pages like LoginPage already handle this redirect.
  // If we reach here, it implies we should render the full layout.

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen flex-col">
        <Sidebar>
          <AppSidebarNav />
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
