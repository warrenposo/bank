import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/hooks/useGame';
import { useAuth } from '@/hooks/useAuth';
import { GameHeader } from '@/components/game/GameHeader';
import { RoundHistory } from '@/components/game/RoundHistory';
import { LiveBets } from '@/components/game/LiveBets';
import { GameCanvas } from '@/components/game/GameCanvas';
import { BetControls } from '@/components/game/BetControls';
import { DepositModal } from '@/components/game/DepositModal';

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const [depositOpen, setDepositOpen] = useState(false);
  
  const { gameState, roundHistory, userBalance, userBet, placeBet, cashOut, deposit } = useGame();

  // Use profile balance if logged in, otherwise use local balance
  const displayBalance = profile?.balance ?? userBalance;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    // Redirect admins to admin dashboard
    if (!loading && user && isAdmin) {
      navigate('/admin');
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-display">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader 
        balance={displayBalance} 
        onDeposit={() => setDepositOpen(true)}
        userName={user?.user_metadata?.name}
        onLogout={signOut}
      />
      
      <div className="text-center py-2 text-sm text-warning font-medium bg-warning/10">
        WELCOME TO THE BEST GAME ON EARTH
      </div>

      <RoundHistory rounds={roundHistory} />

      <div className="flex-1 p-4 flex gap-4">
        {/* Left sidebar - Live Bets */}
        <div className="hidden lg:block w-80">
          <LiveBets bets={gameState.bets} />
        </div>

        {/* Main game area */}
        <div className="flex-1 space-y-4">
          <GameCanvas gameState={gameState} />
          <BetControls
            gameState={gameState}
            userBet={userBet}
            onPlaceBet={placeBet}
            onCashOut={cashOut}
            maxBet={displayBalance}
          />
        </div>
      </div>

      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onDeposit={deposit}
        phoneNumber={profile?.phone_number || ''}
      />
    </div>
  );
};

export default Index;
