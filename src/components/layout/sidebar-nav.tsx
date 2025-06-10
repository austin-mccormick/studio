
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
import { Home, LayoutGrid, FolderKanban, Users, UserCircle, Settings, LogOut, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/daily-scrum', label: 'Daily Scrum', icon: ShieldQuestion },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b">
        <Link href="/" className="flex items-center gap-2 p-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold font-headline text-primary">StructureFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <ScrollArea className="h-full">
          <SidebarMenu className="p-2">
            {navItems.map((item) => (
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
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <Button variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-5 w-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </>
  );
}
