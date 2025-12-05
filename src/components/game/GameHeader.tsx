import { Plane, Wallet, Menu, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

interface GameHeaderProps {
  balance: number;
  onDeposit: () => void;
  userName?: string;
  onLogout?: () => void;
}

export const GameHeader = ({ balance, onDeposit, userName, onLogout }: GameHeaderProps) => {
  const { isAdmin } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <Plane className="h-8 w-8 text-game-plane" style={{ filter: 'drop-shadow(0 0 10px hsl(0, 85%, 55%))' }} />
        <span className="font-display text-xl font-bold text-primary" style={{ textShadow: '0 0 15px hsl(187, 100%, 50%)' }}>AVIATOR</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="neon" onClick={onDeposit} className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="font-display">KES {balance.toFixed(2)}</span>
          <span className="text-muted-foreground">|</span>
          <span>DEPOSIT</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            {userName && (
              <>
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Hi, {userName}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            
            {isAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4 text-warning" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
