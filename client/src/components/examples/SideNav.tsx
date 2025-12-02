import { useState } from 'react';
import { SideNav } from '../SideNav';
import type { NavPage } from '../BottomNav';

export default function SideNavExample() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  
  return (
    <div className="h-[500px] w-64">
      <SideNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
