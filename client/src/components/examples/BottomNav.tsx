import { useState } from 'react';
import { BottomNav, NavPage } from '../BottomNav';

export default function BottomNavExample() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  
  return (
    <div className="relative h-20">
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
