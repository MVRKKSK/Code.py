import { Outlet, useLocation } from 'react-router';
import { Navigation } from './Navigation';
import { useEffect } from 'react';

export function RootLayout() {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Code.py. An educational tool for improving code comprehension.</p>
        </div>
      </footer>
    </div>
  );
}