import { QRPayment } from '../QRPayment';

export default function QRPaymentExample() {
  const handleUploadQR = (file: File) => {
    console.log('QR uploaded:', file.name);
  };

  return <QRPayment onUploadQR={handleUploadQR} />;
}
