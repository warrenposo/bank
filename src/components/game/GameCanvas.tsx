import { GameState } from '@/types/game';
import { PlaneSprite } from './PlaneSprite';
import { useEffect, useState } from 'react';

interface GameCanvasProps {
  gameState: GameState;
}

export const GameCanvas = ({ gameState }: GameCanvasProps) => {
  const { status, currentMultiplier, roundId } = gameState;
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  // Calculate plane position
  const planeX = status === 'waiting' ? 10 : Math.min(15 + currentMultiplier * 6, 75);
  const planeY = status === 'waiting' ? 70 : Math.max(70 - currentMultiplier * 8, 15);

  // Update trail
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setTrail(prev => {
          const newTrail = [...prev, { x: planeX, y: planeY }];
          return newTrail.slice(-50); // Keep last 50 points
        });
      }, 50);
      return () => clearInterval(interval);
    } else if (status === 'waiting') {
      setTrail([]);
    }
  }, [status, planeX, planeY]);

  return (
    <div className="relative w-full aspect-video bg-game-bg rounded-lg overflow-hidden border border-border">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Curve/trail path */}
      {trail.length > 1 && (
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 85%, 55%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(0, 85%, 55%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(0, 85%, 55%)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d={`M ${trail.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          />
        </svg>
      )}

      {/* Plane */}
      <div
        className={`absolute transition-all duration-100 ease-linear ${
          status === 'crashed' ? 'animate-crash' : status === 'running' ? 'animate-fly' : ''
        }`}
        style={{
          left: `${planeX}%`,
          bottom: `${planeY}%`,
          transform: status === 'crashed' 
            ? 'rotate(45deg)' 
            : `rotate(${Math.max(-15, -5 - currentMultiplier * 0.5)}deg)`,
          filter: status !== 'crashed' 
            ? 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 30px rgba(239, 68, 68, 0.5))' 
            : 'none',
        }}
      >
        <PlaneSprite crashed={status === 'crashed'} className="w-20 h-10 md:w-28 md:h-14" />
      </div>

      {/* Multiplier display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {status === 'waiting' ? (
          <div className="text-center">
            <div className="text-xl md:text-2xl text-muted-foreground font-display mb-2 animate-pulse">
              WAITING FOR NEXT ROUND
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : status === 'crashed' ? (
          <div className="text-center animate-scale-in">
            <div className="text-5xl md:text-7xl font-bold font-display text-destructive drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
              {currentMultiplier.toFixed(2)}x
            </div>
            <div className="text-xl md:text-2xl text-destructive mt-2 font-display animate-pulse">
              FLEW AWAY!
            </div>
          </div>
        ) : (
          <div className="text-6xl md:text-8xl font-bold font-display text-game-multiplier drop-shadow-[0_0_40px_rgba(34,211,238,0.6)] animate-pulse-glow">
            {currentMultiplier.toFixed(2)}x
          </div>
        )}
      </div>

      {/* Round ID */}
      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-display bg-background/50 px-2 py-1 rounded">
        ROUND ID: {roundId}
      </div>

      {/* Danger warning when multiplier is high */}
      {status === 'running' && currentMultiplier > 3 && (
        <div className="absolute top-3 left-3 flex items-center gap-2 text-warning animate-pulse">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-display">CASH OUT NOW!</span>
        </div>
      )}
    </div>
  );
};
