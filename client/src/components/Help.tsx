import { HelpCircle, BookOpen, ExternalLink, ShoppingCart, Package, FileText, QrCode, LayoutDashboard, GraduationCap, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export function Help() {
  const guides = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Makita ang summary ng benta at alerts',
      steps: [
        'Makikita mo agad ang total na benta ngayon',
        'Makikita rin ang bilang ng transaksyon',
        'May warning kung may produktong low stock na',
        'Makikita ang netong kita (benta minus gastos)',
      ],
    },
    {
      id: 'inventory',
      icon: Package,
      title: 'Paano Mag-add ng Produkto',
      description: 'I-setup ang iyong mga paninda',
      steps: [
        'Pumunta sa "Paninda" sa navigation',
        'I-click ang "Magdagdag ng Paninda"',
        'Ilagay ang pangalan, presyo, at stock',
        'Pumili ng kategorya (Meryenda, Inumin, etc.)',
        'I-click "Idagdag" para i-save',
      ],
    },
    {
      id: 'sale',
      icon: ShoppingCart,
      title: 'Paano Mag-record ng Benta',
      description: 'Madaling paraan ng pagbebenta',
      steps: [
        'Pumunta sa "Bagong Benta"',
        'I-search o i-click ang mga produkto na binibili',
        'I-adjust ang quantity kung kailangan',
        'I-click "Mag-checkout" kapag tapos na',
        'Piliin kung Cash o QR ang bayad',
        'Ilagay ang perang binigay kung Cash',
        'Makikita ang sukli automatiko',
        'I-click "Kumpletuhin" para i-save ang benta',
      ],
    },
    {
      id: 'records',
      icon: FileText,
      title: 'Paano Tingnan ang Rekord',
      description: 'Track ang mga benta at gastos',
      steps: [
        'Pumunta sa "Rekord"',
        'Piliin ang date range (Ngayon, Linggo, Buwan)',
        'Makikita ang total sales at expenses',
        'I-click "Mga Benta" para sa sales history',
        'I-click "Mga Gastos" para sa expense history',
        'I-add ang mga gastos gamit ang "Magdagdag ng Gastos"',
      ],
    },
    {
      id: 'qr',
      icon: QrCode,
      title: 'Paano Gamitin ang QR Payment',
      description: 'Accept GCash at Maya payments',
      steps: [
        'Pumunta sa QR section (sa Help page)',
        'I-upload ang QR code mula sa GCash/Maya app',
        'Ipakita ang QR sa customer kapag magbabayad',
        'Hintayin ang confirmation ng bayad',
        'I-record ang transaksyon bilang "QR" payment',
      ],
    },
  ];

  const resources = [
    {
      title: 'DTI "Tindahan Mo, e-Level Up Mo"',
      description: 'Free training program ng DTI para sa MSMEs',
      url: 'https://www.dti.gov.ph/',
      badge: 'Libreng Training',
    },
    {
      title: 'GCash for Business',
      description: 'Mag-apply para sa business QR code',
      url: 'https://www.gcash.com/',
      badge: 'QR Payments',
    },
    {
      title: 'Maya Business',
      description: 'Another option para sa digital payments',
      url: 'https://www.maya.ph/',
      badge: 'QR Payments',
    },
  ];

  return (
    <div className="space-y-6 p-4 pb-24 md:pb-4">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-help-title">Tulong at Gabay</h1>
        <p className="text-muted-foreground">Alamin kung paano gamitin ang BentaHub</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">Maligayang pagdating sa BentaHub!</p>
            <p className="text-sm text-muted-foreground">
              Simpleng POS system para sa iyong sari-sari store. Offline-friendly at libre gamitin.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Mga Gabay
          </CardTitle>
          <CardDescription>Step-by-step na paggamit ng BentaHub</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {guides.map(guide => (
              <AccordionItem key={guide.id} value={guide.id}>
                <AccordionTrigger data-testid={`accordion-${guide.id}`}>
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <guide.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{guide.title}</p>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="space-y-2 pl-11">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Mga Resources at Training
          </CardTitle>
          <CardDescription>Karagdagang tulong para sa iyong negosyo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover-elevate"
              data-testid={`link-resource-${i}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{resource.title}</p>
                  <Badge variant="secondary">{resource.badge}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <HelpCircle className="mb-4 h-12 w-12 text-primary/50" />
          <p className="font-medium">May tanong pa?</p>
          <p className="text-sm text-muted-foreground">
            Kontakin ang iyong local DTI office para sa karagdagang tulong sa iyong negosyo.
          </p>
          <Button variant="outline" className="mt-4" data-testid="button-contact-dti">
            <ExternalLink className="mr-2 h-4 w-4" />
            DTI Hotline: 1-DTI (384)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
