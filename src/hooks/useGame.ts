import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Bet, Round } from '@/types/game';

const generateRoundId = () => `#${Math.floor(100000 + Math.random() * 900000)}`;

const generateFakeBets = (): Bet[] => {
  const users = ['k****8', 'k****9', 'o****7', 'c****0', 'm****4', 'm****2', 'b****8', 'o****0', 'j****3', 'c****5'];
  return users.map((user, i) => ({
    id: `bet-${i}`,
    user,
    amount: Math.floor(Math.random() * 900 + 100) * 10,
    status: 'pending' as const,
  }));
};

export const useGame = (adminCrashPoint?: number) => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    currentMultiplier: 1.0,
    roundId: generateRoundId(),
    bets: generateFakeBets(),
  });
  
  const [roundHistory, setRoundHistory] = useState<Round[]>([
    { id: '1', crashPoint: 1.02, timestamp: new Date() },
    { id: '2', crashPoint: 9.6, timestamp: new Date() },
    { id: '3', crashPoint: 1.02, timestamp: new Date() },
    { id: '4', crashPoint: 1.02, timestamp: new Date() },
    { id: '5', crashPoint: 2.75, timestamp: new Date() },
    { id: '6', crashPoint: 5.6, timestamp: new Date() },
    { id: '7', crashPoint: 1.4, timestamp: new Date() },
    { id: '8', crashPoint: 1.02, timestamp: new Date() },
    { id: '9', crashPoint: 6.2, timestamp: new Date() },
    { id: '10', crashPoint: 1.02, timestamp: new Date() },
  ]);

  const [userBalance, setUserBalance] = useState(1000);
  const [userBet, setUserBet] = useState<Bet | null>(null);
  const crashPointRef = useRef(adminCrashPoint || Math.random() * 10 + 1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = useCallback(() => {
    crashPointRef.current = adminCrashPoint || Math.random() * 10 + 1;
    
    setGameState(prev => ({
      ...prev,
      status: 'running',
      currentMultiplier: 1.0,
      bets: generateFakeBets(),
    }));

    let multiplier = 1.0;
    const increment = 0.01;
    const speed = 50;

    intervalRef.current = setInterval(() => {
      multiplier += increment * (1 + multiplier * 0.1);
      
      if (multiplier >= crashPointRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        setGameState(prev => ({
          ...prev,
          status: 'crashed',
          currentMultiplier: crashPointRef.current,
        }));

        setRoundHistory(prev => [
          { id: Date.now().toString(), crashPoint: crashPointRef.current, timestamp: new Date() },
          ...prev.slice(0, 19),
        ]);

        setUserBet(prev => {
          if (prev && prev.status === 'pending') {
            return { ...prev, status: 'lost' };
          }
          return prev;
        });

        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            status: 'waiting',
            currentMultiplier: 1.0,
            roundId: generateRoundId(),
          }));
          setUserBet(null);
        }, 3000);

      } else {
        setGameState(prev => ({
          ...prev,
          currentMultiplier: multiplier,
        }));
      }
    }, speed);
  }, [adminCrashPoint]);

  useEffect(() => {
    const waitTime = gameState.status === 'waiting' ? 5000 : null;
    
    if (waitTime && gameState.status === 'waiting') {
      const timeout = setTimeout(startRound, waitTime);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState.status, startRound]);

  const placeBet = useCallback((amount: number) => {
    if (gameState.status !== 'waiting' || amount > userBalance) return false;
    
    setUserBalance(prev => prev - amount);
    setUserBet({
      id: `user-${Date.now()}`,
      user: 'You',
      amount,
      status: 'pending',
    });
    
    return true;
  }, [gameState.status, userBalance]);

  const cashOut = useCallback(() => {
    if (!userBet || userBet.status !== 'pending' || gameState.status !== 'running') return false;

    const winnings = userBet.amount * gameState.currentMultiplier;
    setUserBalance(prev => prev + winnings);
    setUserBet(prev => prev ? {
      ...prev,
      status: 'won',
      cashoutMultiplier: gameState.currentMultiplier,
      profit: winnings - prev.amount,
    } : null);

    return true;
  }, [userBet, gameState]);

  const deposit = useCallback((amount: number) => {
    setUserBalance(prev => prev + amount);
  }, []);

  return {
    gameState,
    roundHistory,
    userBalance,
    userBet,
    placeBet,
    cashOut,
    deposit,
    setCrashPoint: (point: number) => { crashPointRef.current = point; },
  };
};
