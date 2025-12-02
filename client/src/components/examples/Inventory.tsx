import { useState } from 'react';
import { Inventory } from '../Inventory';
import type { Product } from '@/lib/types';

// todo: remove mock functionality
const initialProducts: Product[] = [
  { id: '1', name: 'Coca-Cola 1.5L', category: 'drinks', price: 65, stock: 12, lowStockThreshold: 5 },
  { id: '2', name: 'Lucky Me Pancit Canton', category: 'snacks', price: 14, stock: 3, lowStockThreshold: 10 },
  { id: '3', name: 'Surf Powder 45g', category: 'hygiene', price: 8, stock: 50, lowStockThreshold: 20 },
  { id: '4', name: 'Argentina Corned Beef 150g', category: 'canned', price: 42, stock: 8, lowStockThreshold: 5 },
  { id: '5', name: 'Smart Load ₱50', category: 'load', price: 50, stock: 100, lowStockThreshold: 10 },
  { id: '6', name: 'Kopiko Brown 25g', category: 'drinks', price: 7, stock: 2, lowStockThreshold: 15 },
];

export default function InventoryExample() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
    console.log('Product added:', newProduct);
  };

  const handleUpdateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    console.log('Product updated:', product);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    console.log('Product deleted:', id);
  };

  return (
    <Inventory
      products={products}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
    />
  );
}
