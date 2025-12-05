import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Minus, Plus } from 'lucide-react';
import { GameState, Bet } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

interface BetControlsProps {
  gameState: GameState;
  userBet: Bet | null;
  onPlaceBet: (amount: number) => boolean;
  onCashOut: () => boolean;
  maxBet?: number;
}

export const BetControls = ({ gameState, userBet, onPlaceBet, onCashOut, maxBet = 10000 }: BetControlsProps) => {
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(20);
  const [autoCashOut, setAutoCashOut] = useState(false);
  const [autoCashOutValue, setAutoCashOutValue] = useState(1.2);

  const quickAmounts = [50, 100, 200, 500];

  const handlePlaceBet = () => {
    if (betAmount > maxBet) {
      toast({
        title: 'Insufficient balance',
        description: `Your balance is KES ${maxBet.toFixed(2)}`,
        variant: 'destructive',
      });
      return;
    }
    const success = onPlaceBet(betAmount);
    if (success) {
      toast({
        title: 'Bet placed!',
        description: `KES ${betAmount} bet placed. Good luck!`,
      });
    }
  };

  const handleCashOut = () => {
    const success = onCashOut();
    if (success && userBet) {
      const winnings = userBet.amount * gameState.currentMultiplier;
      toast({
        title: 'Cashed out!',
        description: `You won KES ${winnings.toFixed(2)}!`,
        variant: 'default',
      });
    }
  };

  const adjustBet = (multiplier: number) => {
    setBetAmount(prev => Math.max(10, Math.min(maxBet, Math.floor(prev * multiplier))));
  };

  const canBet = gameState.status === 'waiting' && !userBet;
  const canCashOut = gameState.status === 'running' && userBet?.status === 'pending';

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex gap-2 mb-4">
        <button className="flex-1 py-2 text-sm font-medium bg-primary/10 text-primary rounded-t border-b-2 border-primary">
          STAKE SELECTOR
        </button>
        <button className="flex-1 py-2 text-sm font-medium text-muted-foreground rounded-t hover:text-foreground">
          AI
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Bet Amount Controls */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="game" size="sm" onClick={() => adjustBet(0.5)}>
              1/2
            </Button>
            <Button variant="game" size="icon" onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
              className="text-center font-display bg-secondary border-border"
            />
            <Button variant="game" size="icon" onClick={() => setBetAmount(prev => Math.min(maxBet, prev + 10))}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="game" size="sm" onClick={() => adjustBet(2)}>
              *2
            </Button>
          </div>

          <div className="flex gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant="game"
                size="sm"
                onClick={() => setBetAmount(Math.min(maxBet, amount))}
                className="flex-1"
              >
                {amount}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">AUTO CASH OUT</span>
            <Switch checked={autoCashOut} onCheckedChange={setAutoCashOut} />
            <Input
              type="number"
              step="0.1"
              value={autoCashOutValue}
              onChange={(e) => setAutoCashOutValue(parseFloat(e.target.value) || 1.2)}
              className="w-20 text-center bg-secondary border-border"
              disabled={!autoCashOut}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-48">
          {canCashOut ? (
            <Button
              variant="cashout"
              className="w-full h-full min-h-[80px] text-lg"
              onClick={handleCashOut}
            >
              <div className="text-center">
                <div>CASH OUT</div>
                <div className="text-xl font-display">
                  KSH {(userBet.amount * gameState.currentMultiplier).toFixed(2)}
                </div>
              </div>
            </Button>
          ) : userBet ? (
            <Button
              variant="secondary"
              className="w-full h-full min-h-[80px] text-lg"
              disabled
            >
              <div className="text-center">
                {userBet.status === 'won' ? (
                  <>
                    <div className="text-success">WON!</div>
                    <div className="text-xl font-display">
                      +KSH {userBet.profit?.toFixed(2)}
                    </div>
                  </>
                ) : userBet.status === 'lost' ? (
                  <>
                    <div className="text-destructive">LOST</div>
                    <div className="text-xl font-display">
                      -KSH {userBet.amount.toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse">WAITING...</div>
                )}
              </div>
            </Button>
          ) : (
            <Button
              variant="bet"
              className="w-full h-full min-h-[80px] text-lg"
              onClick={handlePlaceBet}
              disabled={!canBet}
            >
              <div className="text-center">
                <div>PLACE BET</div>
                <div className="text-xl font-display">KSH {betAmount.toFixed(2)}</div>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
