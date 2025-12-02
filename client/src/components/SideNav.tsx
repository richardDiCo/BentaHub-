import { LayoutDashboard, Package, ShoppingCart, FileText, HelpCircle, QrCode, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavPage } from './BottomNav';

interface SideNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const navItems: { page: NavPage; icon: typeof LayoutDashboard; label: string; labelFil: string }[] = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', labelFil: 'Dashboard' },
  { page: 'inventory', icon: Package, label: 'Inventory', labelFil: 'Paninda' },
  { page: 'sale', icon: ShoppingCart, label: 'New Sale', labelFil: 'Bagong Benta' },
  { page: 'records', icon: FileText, label: 'Records', labelFil: 'Rekord' },
  { page: 'help', icon: HelpCircle, label: 'Help', labelFil: 'Tulong' },
];

export function SideNav({ currentPage, onNavigate }: SideNavProps) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Store className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground">BentaHub</span>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map(({ page, icon: Icon, label, labelFil }) => (
            <li key={page}>
              <button
                onClick={() => onNavigate(page)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover-elevate',
                  currentPage === page
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
                data-testid={`sidenav-${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
                <span className="ml-auto text-xs text-muted-foreground">({labelFil})</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/50 p-3">
          <QrCode className="h-5 w-5 text-primary" />
          <div className="text-xs">
            <p className="font-medium text-sidebar-foreground">QR Payments Ready</p>
            <p className="text-muted-foreground">GCash / Maya</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
