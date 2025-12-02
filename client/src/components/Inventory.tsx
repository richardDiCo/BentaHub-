import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Package, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product } from '@/lib/types';
import { categoryLabels } from '@/lib/types';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export function Inventory({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'snacks' as Product['category'],
    price: '',
    stock: '',
    lowStockThreshold: '5',
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'snacks',
        price: '',
        stock: '',
        lowStockThreshold: '5',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
    };

    if (editingProduct) {
      onUpdateProduct({ ...productData, id: editingProduct.id });
    } else {
      onAddProduct(productData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    onDeleteProduct(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-inventory-title">Mga Paninda</h1>
          <p className="text-muted-foreground">{products.length} produkto sa iyong tindahan</p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-product">
          <Plus className="mr-2 h-4 w-4" />
          Magdagdag ng Paninda
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Hanapin ang produkto..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-product"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-category-filter">
            <SelectValue placeholder="Lahat ng kategorya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Lahat ng Kategorya</SelectItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Walang produkto pa</p>
            <p className="text-sm text-muted-foreground">I-click ang "Magdagdag ng Paninda" para magsimula!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <Card key={product.id} className="relative" data-testid={`card-product-${product.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" data-testid={`text-product-name-${product.id}`}>
                      {product.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {categoryLabels[product.category]}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDialog(product)}
                      data-testid={`button-edit-${product.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteConfirmId(product.id)}
                      data-testid={`button-delete-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                      ₱{product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p
                      className={`text-lg font-semibold ${product.stock <= product.lowStockThreshold ? 'text-status-away' : ''}`}
                      data-testid={`text-product-stock-${product.id}`}
                    >
                      {product.stock}
                    </p>
                  </div>
                </div>

                {product.stock <= product.lowStockThreshold && (
                  <Badge
                    variant="outline"
                    className="mt-3 w-full justify-center bg-status-away/10 text-status-away border-status-away/30"
                  >
                    Low Stock - Kailangan ng restock!
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'I-edit ang Produkto' : 'Bagong Produkto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pangalan ng Produkto</Label>
              <Input
                id="name"
                placeholder="hal. Coca-Cola 1.5L"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-product-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategorya</Label>
              <Select
                value={formData.category}
                onValueChange={value => setFormData({ ...formData, category: value as Product['category'] })}
              >
                <SelectTrigger data-testid="select-product-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Presyo (₱)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  data-testid="input-product-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  data-testid="input-product-stock"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Low Stock Threshold</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="5"
                value={formData.lowStockThreshold}
                onChange={e => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                data-testid="input-product-threshold"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Kanselahin
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.price} data-testid="button-save-product">
              {editingProduct ? 'I-save' : 'Idagdag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tanggalin ang Produkto?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Sigurado ka bang gusto mong tanggalin ang produktong ito? Hindi na ito maibabalik.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Kanselahin
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              data-testid="button-confirm-delete"
            >
              Tanggalin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
