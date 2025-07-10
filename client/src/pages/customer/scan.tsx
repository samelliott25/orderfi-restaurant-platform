import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, User, Camera, Loader2 } from 'lucide-react';

export default function ScanPage() {
  const [, navigate] = useLocation();
  const [isScanning, setIsScanning] = useState(false);
  const [tableCode, setTableCode] = useState('');
  const [error, setError] = useState('');

  const handleQRScan = async () => {
    setIsScanning(true);
    setError('');

    try {
      // Simulate QR code scanning
      // In a real app, this would use navigator.mediaDevices.getUserMedia() and a QR code library
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful scan
      const mockSessionId = `session_${Date.now()}`;
      localStorage.setItem('sessionId', mockSessionId);
      localStorage.setItem('tableNumber', 'Table 12');
      localStorage.setItem('venueName', 'OrderFi Restaurant');
      
      navigate('/menu');
    } catch (err) {
      setError('Failed to scan QR code. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualEntry = () => {
    if (!tableCode.trim()) {
      setError('Please enter a table code');
      return;
    }

    // Validate table code format (mock validation)
    if (!/^[A-Z0-9]{4,8}$/.test(tableCode.toUpperCase())) {
      setError('Please enter a valid table code (4-8 characters)');
      return;
    }

    const sessionId = `session_${Date.now()}`;
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('tableNumber', `Table ${tableCode}`);
    localStorage.setItem('venueName', 'OrderFi Restaurant');
    
    navigate('/menu');
  };

  const handleGuestMode = () => {
    const sessionId = `guest_${Date.now()}`;
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('tableNumber', 'Guest');
    localStorage.setItem('venueName', 'OrderFi Restaurant');
    localStorage.setItem('isGuest', 'true');
    
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-semibold text-lg playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
            OrderFi
          </h1>
          <p className="text-muted-foreground">
            Scan your table's QR code to get started
          </p>
        </div>

        {/* QR Scanner Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Scan QR Code</span>
            </CardTitle>
            <CardDescription>
              Point your camera at the QR code on your table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleQRScan}
              disabled={isScanning}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Entry Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Enter Table Code</span>
            </CardTitle>
            <CardDescription>
              Enter your table code manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="table-code">Table Code</Label>
              <Input
                id="table-code"
                placeholder="e.g., T12A or 5678"
                value={tableCode}
                onChange={(e) => {
                  setTableCode(e.target.value);
                  setError('');
                }}
                className="mt-1"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            
            <Button
              onClick={handleManualEntry}
              variant="outline"
              className="w-full"
            >
              Continue
            </Button>
          </CardContent>
        </Card>

        {/* Guest Mode Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Continue as Guest</span>
            </CardTitle>
            <CardDescription>
              Browse the menu without a table assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGuestMode}
              variant="outline"
              className="w-full"
            >
              Browse Menu
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Ask your server for assistance
          </p>
        </div>
      </div>
    </div>
  );
}