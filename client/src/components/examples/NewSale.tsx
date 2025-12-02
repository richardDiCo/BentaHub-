import { NewSale } from '../NewSale';
import type { Product, Transaction } from '@/lib/types';

// todo: remove mock functionality
const mockProducts: Product[] = [
  { id: '1', name: 'Coca-Cola 1.5L', category: 'drinks', price: 65, stock: 12, lowStockThreshold: 5 },
  { id: '2', name: 'Lucky Me Pancit Canton', category: 'snacks', price: 14, stock: 25, lowStockThreshold: 10 },
  { id: '3', name: 'Surf Powder 45g', category: 'hygiene', price: 8, stock: 50, lowStockThreshold: 20 },
  { id: '4', name: 'Argentina Corned Beef 150g', category: 'canned', price: 42, stock: 8, lowStockThreshold: 5 },
  { id: '5', name: 'Smart Load ₱50', category: 'load', price: 50, stock: 100, lowStockThreshold: 10 },
  { id: '6', name: 'Kopiko Brown 25g', category: 'drinks', price: 7, stock: 30, lowStockThreshold: 15 },
  { id: '7', name: 'Skyflakes Crackers', category: 'snacks', price: 10, stock: 40, lowStockThreshold: 10 },
  { id: '8', name: 'Safeguard Soap 60g', category: 'hygiene', price: 35, stock: 15, lowStockThreshold: 5 },
];

export default function NewSaleExample() {
  const handleCompleteSale = (transaction: Omit<Transaction, 'id'>) => {
    console.log('Sale completed:', transaction);
  };

  return (
    <div className="h-[600px]">
      <NewSale
        products={mockProducts}
        onCompleteSale={handleCompleteSale}
        onNavigateToQR={() => console.log('Navigate to QR')}
      />
    </div>
  );
}
