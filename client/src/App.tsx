import { useState, useEffect } from 'react';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TopBar } from '@/components/TopBar';
import { BottomNav, type NavPage } from '@/components/BottomNav';
import { SideNav } from '@/components/SideNav';
import { Dashboard } from '@/components/Dashboard';
import { Inventory } from '@/components/Inventory';
import { NewSale } from '@/components/NewSale';
import { Records } from '@/components/Records';
import { Help } from '@/components/Help';
import { QRPayment } from '@/components/QRPayment';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Product, Transaction, Expense } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// todo: remove mock functionality - initial sample data for demo
const initialProducts: Product[] = [
  { id: '1', name: 'Coca-Cola 1.5L', category: 'drinks', price: 65, stock: 12, lowStockThreshold: 5 },
  { id: '2', name: 'Lucky Me Pancit Canton', category: 'snacks', price: 14, stock: 3, lowStockThreshold: 10 },
  { id: '3', name: 'Surf Powder 45g', category: 'hygiene', price: 8, stock: 50, lowStockThreshold: 20 },
  { id: '4', name: 'Argentina Corned Beef 150g', category: 'canned', price: 42, stock: 8, lowStockThreshold: 5 },
  { id: '5', name: 'Smart Load ₱50', category: 'load', price: 50, stock: 100, lowStockThreshold: 10 },
  { id: '6', name: 'Kopiko Brown 25g', category: 'drinks', price: 7, stock: 2, lowStockThreshold: 15 },
  { id: '7', name: 'Skyflakes Crackers', category: 'snacks', price: 10, stock: 40, lowStockThreshold: 10 },
  { id: '8', name: 'Safeguard Soap 60g', category: 'hygiene', price: 35, stock: 15, lowStockThreshold: 5 },
  { id: '9', name: 'Century Tuna Flakes 155g', category: 'canned', price: 38, stock: 20, lowStockThreshold: 8 },
  { id: '10', name: 'Globe Load ₱100', category: 'load', price: 100, stock: 50, lowStockThreshold: 10 },
];

function BentaHubApp() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  // LocalStorage for offline persistence
  const [products, setProducts] = useLocalStorage<Product[]>('bentahub_products', initialProducts);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('bentahub_transactions', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('bentahub_expenses', []);
  const [qrImageUrl, setQrImageUrl] = useLocalStorage<string | undefined>('bentahub_qr', undefined);

  // Product CRUD operations
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: 'Naidagdag na!',
      description: `${product.name} ay naidagdag sa iyong mga paninda.`,
    });
  };

  const handleUpdateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    toast({
      title: 'Na-update na!',
      description: `${product.name} ay na-update na.`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({
      title: 'Natanggal na!',
      description: product ? `${product.name} ay natanggal na sa mga paninda.` : 'Product deleted.',
    });
  };

  // Transaction operations
  const handleCompleteSale = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update product stock
    setProducts(prev => prev.map(product => {
      const soldItem = transaction.items.find(item => item.productId === product.id);
      if (soldItem) {
        return { ...product, stock: Math.max(0, product.stock - soldItem.quantity) };
      }
      return product;
    }));

    toast({
      title: 'Naitala na ang benta!',
      description: `₱${transaction.total.toFixed(2)} - ${transaction.paymentMethod === 'cash' ? 'Cash' : 'QR'} payment`,
    });
  };

  // Expense operations
  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    toast({
      title: 'Naitala na ang gastos!',
      description: `₱${expense.amount.toFixed(2)} - ${expense.description}`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast({
      title: 'Natanggal na!',
      description: 'Ang gastos ay natanggal na.',
    });
  };

  // QR upload
  const handleUploadQR = (file: File) => {
    const url = URL.createObjectURL(file);
    setQrImageUrl(url);
    toast({
      title: 'Na-upload na ang QR!',
      description: 'Pwede mo na itong ipakita sa customers.',
    });
  };

  const navigateToPage = (page: NavPage) => {
    setShowQR(false);
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (showQR) {
      return <QRPayment qrImageUrl={qrImageUrl} onUploadQR={handleUploadQR} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            products={products}
            transactions={transactions}
            expenses={expenses}
            onNavigateToInventory={() => setCurrentPage('inventory')}
          />
        );
      case 'inventory':
        return (
          <Inventory
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'sale':
        return (
          <NewSale
            products={products}
            onCompleteSale={handleCompleteSale}
            onNavigateToQR={() => setShowQR(true)}
          />
        );
      case 'records':
        return (
          <Records
            transactions={transactions}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'help':
        return <Help />;
      default:
        return <Dashboard products={products} transactions={transactions} expenses={expenses} />;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background md:flex-row">
      <SideNav currentPage={currentPage} onNavigate={navigateToPage} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="md:hidden">
          <TopBar storeName="BentaHub" />
        </div>
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
        
        <BottomNav currentPage={currentPage} onNavigate={navigateToPage} />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BentaHubApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
