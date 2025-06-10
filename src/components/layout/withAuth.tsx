
'use client';

import type { ComponentType, ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuthComponent = (props: P): ReactNode => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.replace('/'); 
      }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Spinner size="large" />
        </div>
      );
    }
    return <WrappedComponent {...props} />;
  };
  WithAuthComponent.displayName = `WithAuth(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;
  return WithAuthComponent;
}

