
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Home, LayoutGrid, FolderKanban, Users, UserCircle, Settings, LogOut, ShieldQuestion, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

const authenticatedNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/daily-scrum', label: 'Daily Scrum', icon: ShieldQuestion },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebarNav() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  
  const navItemsToDisplay = user ? authenticatedNavItems : [];

  // Do not render sidebar if on auth pages and not logged in, or during initial load for auth pages
  const authPages = ['/', '/register', '/forgot-password'];
  if (authPages.includes(pathname) && (!user || isLoading)) {
      return null;
  }
  
  // If auth context is still loading and we are not on an auth page, show a spinner in sidebar area
  if (isLoading && !authPages.includes(pathname)) {
    return (
        <div className="flex flex-col h-full">
            <SidebarHeader className="border-b">
                <Link href="/" className="flex items-center gap-2 p-2">
                    <Home className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold font-headline text-primary">StructureFlow</span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="flex-1 flex items-center justify-center">
                <Spinner />
            </SidebarContent>
        </div>
    );
  }


  return (
    <>
      <SidebarHeader className="border-b">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 p-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold font-headline text-primary">StructureFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <ScrollArea className="h-full">
          {user ? (
            <SidebarMenu className="p-2">
              {navItemsToDisplay.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                    className={cn(
                      'w-full justify-start rounded-md text-sm',
                      (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                        : 'hover:bg-accent/50 hover:text-accent-foreground'
                    )}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          ) : (
             <SidebarMenu className="p-2">
                <SidebarMenuItem>
                   <SidebarMenuButton asChild className="w-full justify-start rounded-md text-sm hover:bg-accent/50 hover:text-accent-foreground">
                     <Link href="/">
                        <LogIn className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span>Sign In</span>
                     </Link>
                   </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          )}
        </ScrollArea>
      </SidebarContent>
      {user && (
        <SidebarFooter className="border-t p-2">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? <Spinner size="small" className="mr-2"/> : <LogOut className="mr-2 h-5 w-5" />}
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      )}
    </>
  );
}
