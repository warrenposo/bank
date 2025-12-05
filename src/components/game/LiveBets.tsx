import { Bet } from '@/types/game';
import { Users } from 'lucide-react';

interface LiveBetsProps {
  bets: Bet[];
  onlineUsers?: number;
  playingUsers?: number;
  totalBets?: number;
  totalAmount?: number;
  totalWinnings?: number;
}

export const LiveBets = ({ 
  bets, 
  onlineUsers = 6980, 
  playingUsers = 3522,
  totalBets = 3522,
  totalAmount = 18580,
  totalWinnings = 0,
}: LiveBetsProps) => {
  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="flex border-b border-border">
        <button className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-b-2 border-primary">
          LIVE BETS
        </button>
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          LIVE WITHDRAWALS
        </button>
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          CHATS/RAIN
        </button>
      </div>

      <div className="bg-secondary/50 px-3 py-2 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-primary" />
          <span className="text-primary font-medium">ONLINE USERS: {onlineUsers.toLocaleString()}</span>
        </div>
        <span className="text-muted-foreground">|</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <span className="text-warning">PLAYING: {playingUsers.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 px-3 py-2 text-xs text-muted-foreground border-b border-border">
        <div>
          <div className="font-medium">TOTAL BETS</div>
          <div className="text-foreground">{totalBets.toLocaleString()}</div>
        </div>
        <div>
          <div className="font-medium">TOTAL AMOUNT</div>
          <div className="text-foreground">KES {totalAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="font-medium">TOTAL WINNINGS</div>
          <div className="text-foreground">KES {totalWinnings.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 px-3 py-2 text-xs text-muted-foreground border-b border-border font-medium">
        <span>USER</span>
        <span>BET KES X</span>
        <span>CASH OUT KES</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {bets.map((bet) => (
          <div
            key={bet.id}
            className="grid grid-cols-3 px-3 py-2 text-sm border-b border-border/50 hover:bg-secondary/30"
          >
            <span className="text-muted-foreground">{bet.user}</span>
            <span className="text-foreground">KES {bet.amount.toFixed(2)}</span>
            <span className={bet.cashoutMultiplier ? 'text-success' : 'text-muted-foreground'}>
              {bet.cashoutMultiplier ? `KES ${(bet.amount * bet.cashoutMultiplier).toFixed(2)}` : '--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
