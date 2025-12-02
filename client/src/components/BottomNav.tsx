import { LayoutDashboard, Package, ShoppingCart, FileText, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavPage = 'dashboard' | 'inventory' | 'sale' | 'records' | 'help';

interface BottomNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const navItems: { page: NavPage; icon: typeof LayoutDashboard; label: string }[] = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'inventory', icon: Package, label: 'Paninda' },
  { page: 'sale', icon: ShoppingCart, label: 'Bagong Benta' },
  { page: 'records', icon: FileText, label: 'Rekord' },
  { page: 'help', icon: HelpCircle, label: 'Tulong' },
];

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={cn(
              'flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors',
              currentPage === page
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            data-testid={`nav-${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
