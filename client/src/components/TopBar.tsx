import { Store, Wifi, WifiOff } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';

interface TopBarProps {
  storeName?: string;
}

export function TopBar({ storeName = 'BentaHub' }: TopBarProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const today = new Date().toLocaleDateString('fil-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <Store className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold" data-testid="text-store-name">{storeName}</span>
      </div>
      
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span data-testid="text-current-date">{today}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-status-online" />
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-status-away" />
              <span className="text-xs text-status-away">Offline</span>
            </>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
