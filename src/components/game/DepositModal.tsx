import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  phoneNumber?: string;
}

export const DepositModal = ({ open, onClose, onDeposit, phoneNumber = '' }: DepositModalProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState(100);
  const [phone, setPhone] = useState(phoneNumber);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDeposit = async () => {
    setProcessing(true);
    
    // Simulate M-Pesa STK push processing
    // In production, this would call your backend to initiate STK push
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful deposit
    onDeposit(amount);
    setSuccess(true);
    
    toast({
      title: 'Deposit successful!',
      description: `KES ${amount} has been added to your account.`,
    });
    
    setTimeout(() => {
      setProcessing(false);
      setSuccess(false);
      onClose();
    }, 1500);
  };

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-primary text-center text-xl">
            DEPOSIT VIA M-PESA
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4 animate-scale-in" />
            <h3 className="text-xl font-bold text-success mb-2">Success!</h3>
            <p className="text-muted-foreground">KES {amount} deposited</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
              <Smartphone className="h-8 w-8 text-success" />
              <div className="text-sm">
                <div className="font-medium text-success">M-PESA STK Push</div>
                <div className="text-muted-foreground">You'll receive a prompt on your phone</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Amount (KES)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="bg-secondary border-border text-lg font-display"
              />
              <div className="flex gap-2">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    variant="game"
                    size="sm"
                    onClick={() => setAmount(amt)}
                    className="flex-1"
                  >
                    {amt}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="success"
              className="w-full"
              size="lg"
              onClick={handleDeposit}
              disabled={!phone || amount < 10 || processing}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  PROCESSING...
                </span>
              ) : (
                `DEPOSIT KES ${amount.toLocaleString()}`
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Funds will be credited instantly after M-Pesa confirmation
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
