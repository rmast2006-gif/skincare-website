'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Create a unique key for this page visit per session
    const sessionKey = `visited_${pathname}`;
    
    // Only track if this page hasn't been visited in this session
    const alreadyVisited = sessionStorage.getItem(sessionKey);
    if (alreadyVisited) return;

    // Mark as visited for this session
    sessionStorage.setItem(sessionKey, 'true');

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}