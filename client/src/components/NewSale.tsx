import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Check, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Product, CartItem, Transaction } from '@/lib/types';
import { categoryLabels } from '@/lib/types';

interface NewSaleProps {
  products: Product[];
  onCompleteSale: (transaction: Omit<Transaction, 'id'>) => void;
  onNavigateToQR?: () => void;
}

export function NewSale({ products, onCompleteSale, onNavigateToQR }: NewSaleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products.filter(p => p.stock > 0);
    return products.filter(
      p => p.stock > 0 && p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const change = useMemo(() => {
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - cartTotal);
  }, [amountReceived, cartTotal]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id !== productId) return item;
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.product.stock) return item;
        return { ...item, quantity: newQty };
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
    setAmountReceived('');
  };

  const handleCompleteSale = () => {
    const transaction: Omit<Transaction, 'id'> = {
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cartTotal,
      paymentMethod,
      amountReceived: paymentMethod === 'cash' ? parseFloat(amountReceived) || cartTotal : undefined,
      change: paymentMethod === 'cash' ? change : undefined,
      timestamp: new Date(),
    };

    onCompleteSale(transaction);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  const canCompleteSale = paymentMethod === 'qr' || (parseFloat(amountReceived) || 0) >= cartTotal;

  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="flex-1 space-y-4 p-4 pb-48 md:pb-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-new-sale-title">Bagong Benta</h1>
          <p className="text-muted-foreground">Pumili ng mga produkto para sa customer</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Hanapin ang produkto..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-sale"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => {
            const inCart = cart.find(item => item.product.id === product.id);
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover-elevate active-elevate-2"
                disabled={inCart && inCart.quantity >= product.stock}
                data-testid={`button-product-${product.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-primary">₱{product.price.toFixed(2)}</span>
                    <Badge variant="outline">{product.stock} left</Badge>
                  </div>
                </div>
                {inCart && (
                  <Badge className="shrink-0">{inCart.quantity}</Badge>
                )}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Walang produkto na makita</p>
            <p className="text-sm text-muted-foreground">Subukan ang ibang search term</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 border-t bg-background p-4 md:static md:w-80 md:border-l md:border-t-0">
        <Card className="md:sticky md:top-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </span>
              <Badge variant="secondary">{cart.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Walang laman ang cart
              </p>
            ) : (
              <ScrollArea className="max-h-48 md:max-h-64">
                <div className="space-y-2 pr-4">
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-2 rounded-md border p-2"
                      data-testid={`cart-item-${item.product.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₱{item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => removeFromCart(item.product.id)}
                          data-testid={`button-remove-${item.product.id}`}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold text-primary" data-testid="text-cart-total">
                  ₱{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              data-testid="button-checkout"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Mag-checkout
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bayad at Sukli</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total na Babayaran</p>
              <p className="text-4xl font-bold text-primary">₱{cartTotal.toFixed(2)}</p>
            </div>

            <div className="space-y-3">
              <Label>Paraan ng Pagbabayad</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={v => setPaymentMethod(v as 'cash' | 'qr')}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="cash"
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-4 transition-colors hover-elevate ${
                    paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <RadioGroupItem value="cash" id="cash" className="sr-only" />
                  <Banknote className="h-5 w-5" />
                  <span className="font-medium">Cash</span>
                </Label>
                <Label
                  htmlFor="qr"
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-4 transition-colors hover-elevate ${
                    paymentMethod === 'qr' ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <RadioGroupItem value="qr" id="qr" className="sr-only" />
                  <QrCode className="h-5 w-5" />
                  <span className="font-medium">GCash/Maya</span>
                </Label>
              </RadioGroup>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-3">
                <Label htmlFor="amount">Perang Binigay</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amountReceived}
                  onChange={e => setAmountReceived(e.target.value)}
                  className="text-2xl font-bold text-center h-14"
                  data-testid="input-amount-received"
                />
                {parseFloat(amountReceived) >= cartTotal && (
                  <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Sukli</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-change">
                      ₱{change.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'qr' && (
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <QrCode className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-sm text-muted-foreground">
                  I-scan ng customer ang QR code ng iyong tindahan para magbayad.
                </p>
                <Button variant="ghost" onClick={onNavigateToQR} className="mt-2" data-testid="link-show-qr">
                  Ipakita ang QR Code
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Kanselahin
            </Button>
            <Button
              onClick={handleCompleteSale}
              disabled={!canCompleteSale}
              data-testid="button-complete-sale"
            >
              <Check className="mr-2 h-4 w-4" />
              Kumpletuhin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center py-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-online/10">
              <Check className="h-8 w-8 text-status-online" />
            </div>
            <h2 className="text-2xl font-bold">Salamat!</h2>
            <p className="mt-2 text-muted-foreground">Naitala na ang transaksyon.</p>
          </div>
          <DialogFooter className="justify-center">
            <Button onClick={() => setIsSuccessOpen(false)} data-testid="button-new-transaction">
              Bagong Transaksyon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
