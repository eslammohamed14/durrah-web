'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  /** Optional fallback rendered during SSR / before hydration */
  fallback?: React.ReactNode;
}

/**
 * Renders children only after the component has mounted on the client.
 * Use this to wrap locale-dependent or browser-only content to prevent
 * React hydration mismatches between server and client renders.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
