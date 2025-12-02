import { useState } from 'react';
import { QrCode, Upload, Check, Smartphone, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface QRPaymentProps {
  qrImageUrl?: string;
  onUploadQR?: (file: File) => void;
}

export function QRPayment({ qrImageUrl, onUploadQR }: QRPaymentProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(qrImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onUploadQR?.(file);
    }
  };

  return (
    <div className="space-y-6 p-4 pb-24 md:pb-4">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-qr-title">QR Payments</h1>
        <p className="text-muted-foreground">I-setup ang iyong GCash o Maya QR para sa customers</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Scan to Pay
          </CardTitle>
          <CardDescription>
            Ipakita ito sa customer para magbayad gamit ang GCash o Maya
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="QR Code"
                className="max-w-xs rounded-lg border"
                data-testid="img-qr-code"
              />
              <Label
                htmlFor="qr-upload"
                className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              >
                <Upload className="h-4 w-4" />
              </Label>
            </div>
          ) : (
            <Label
              htmlFor="qr-upload"
              className="flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted"
            >
              <QrCode className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium">I-upload ang QR Code</p>
              <p className="text-xs text-muted-foreground">GCash o Maya</p>
            </Label>
          )}
          <Input
            id="qr-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            data-testid="input-qr-upload"
          />
          {!previewUrl && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              I-download ang QR code mula sa GCash o Maya app, tapos i-upload dito.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paano Gamitin ang QR Payment?</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="customer">
              <AccordionTrigger data-testid="accordion-customer">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  Para sa Customer
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-3 pl-6">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                    <span>Buksan ang GCash o Maya app sa iyong phone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                    <span>I-tap ang "Scan QR" o "Pay QR"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                    <span>I-scan ang QR code ng tindahan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
                    <span>Ilagay ang halaga at i-confirm ang bayad</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-online text-xs font-bold text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>Ipakita ang confirmation sa tindero</span>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="seller">
              <AccordionTrigger data-testid="accordion-seller">
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-primary" />
                  Para sa Tindero
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-3 pl-6">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                    <span>Sabihin ang total na babayaran</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                    <span>Ipakita ang QR code sa customer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                    <span>Hintayin ang confirmation ng bayad mula sa customer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
                    <span>I-check ang notification sa iyong GCash/Maya</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-online text-xs font-bold text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>I-record ang transaksyon sa BentaHub</span>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Wala ka pang GCash o Maya?</p>
            <p className="text-sm text-muted-foreground">
              Mag-register sa kahit anong 7-Eleven o remittance center
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
