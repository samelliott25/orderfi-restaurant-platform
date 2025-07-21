import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, User, QrCode } from 'lucide-react';
import { WalletConnectDialog } from '@/components/WalletConnectDialog';

export default function CustomerLogin() {
  const [, navigate] = useLocation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [tableId, setTableId] = useState('');



  const handleGuestLogin = async () => {
    try {
      const response = await fetch('/api/login/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: tableId || 'table-1' })
      });
      
      const { sessionId } = await response.json();
      localStorage.setItem('sessionId', sessionId);
      navigate('/menu');
    } catch (error) {
      console.error('Guest login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl rock-salt-font">Welcome to OrderFi</CardTitle>
          <CardDescription>
            Scan the QR code or enter your table number to start ordering
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tableId">Table Number (Optional)</Label>
            <Input
              id="tableId"
              placeholder="e.g., Table 5"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <WalletConnectDialog>
              <Button
                disabled={isConnecting}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            </WalletConnectDialog>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={handleGuestLogin}
              variant="outline"
              className="w-full h-12 border-2 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-900"
            >
              <User className="w-5 h-5 mr-2" />
              Continue as Guest
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>New to Web3? No problem!</p>
            <p>Use "Continue as Guest" to order with regular payment methods.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}