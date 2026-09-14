'use client';

import { ReactNode } from 'react';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TanStackProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </TanStackProvider>
  );
}