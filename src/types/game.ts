export interface Bet {
  id: string;
  user: string;
  amount: number;
  cashoutMultiplier?: number;
  profit?: number;
  status: 'pending' | 'won' | 'lost';
}

export interface Round {
  id: string;
  crashPoint: number;
  timestamp: Date;
}

export interface GameState {
  status: 'waiting' | 'running' | 'crashed';
  currentMultiplier: number;
  roundId: string;
  bets: Bet[];
}

export interface UserBalance {
  amount: number;
  currency: string;
}
