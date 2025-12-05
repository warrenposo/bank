import { GameState } from '@/types/game';
import { PlaneSprite } from './PlaneSprite';
import { useEffect, useState, useRef } from 'react';

interface GameCanvasProps {
  gameState: GameState;
}

interface TrailPoint {
  x: number;
  y: number;
  multiplier: number;
}

export const GameCanvas = ({ gameState }: GameCanvasProps) => {
  const { status, currentMultiplier, roundId } = gameState;
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate plane position - make it follow a more natural curve
  const planeX = status === 'waiting' ? 5 : Math.min(10 + currentMultiplier * 8, 85);
  const planeY = status === 'waiting' ? 10 : Math.max(10 + currentMultiplier * 12, 80);

  // Update trail with smooth curve - faster updates
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setTrail(prev => {
          const newPoint: TrailPoint = { 
            x: planeX, 
            y: planeY,
            multiplier: currentMultiplier
          };
          const newTrail = [...prev, newPoint];
          return newTrail.slice(-80); // Keep last 80 points for smooth trail
        });
      }, 16); // 60fps update rate
      return () => clearInterval(interval);
    } else if (status === 'waiting') {
      setTrail([]);
    }
  }, [status, planeX, planeY, currentMultiplier]);

  // Create smooth curve path for the trail
  const createCurvePath = (points: TrailPoint[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${100 - points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = points[i].x;
      const y = 100 - points[i].y;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <div ref={canvasRef} className="relative w-full aspect-video bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden border border-border shadow-2xl">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Grid lines - diagonal pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <defs>
          <pattern id="diagonal-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1" className="text-cyan-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-grid)" />
      </svg>

      {/* Ground/Runway for waiting state */}
      {status === 'waiting' && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800/80 to-transparent border-t border-slate-700">
          <div className="absolute bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          <div className="absolute bottom-8 left-1/4 right-1/4 flex justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-12 h-1 bg-white/30" />
            ))}
          </div>
        </div>
      )}

      {/* Graph-style trail line */}
      {trail.length > 1 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Shadow/glow under the line */}
          <path
            d={createCurvePath(trail)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
            filter="url(#glow)"
            style={{ transform: 'translateY(2px)' }}
          />
          
          {/* Main red line */}
          <path
            d={createCurvePath(trail)}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className="drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]"
          />
        </svg>
      )}

      {/* Plane */}
      <div
        className={`absolute ${
          status === 'crashed' 
            ? 'animate-crash-fast' 
            : status === 'running' 
            ? 'transition-all duration-100 ease-out animate-fly-smooth' 
            : 'transition-all duration-500'
        }`}
        style={{
          left: `${planeX}%`,
          bottom: `${planeY}%`,
          transform: status === 'crashed' 
            ? 'rotate(180deg) scale(0.7)' 
            : status === 'waiting'
            ? 'rotate(0deg)'
            : `rotate(${Math.min(-10 - Math.log(currentMultiplier + 1) * 5, -30)}deg)`,
          filter: status !== 'crashed' 
            ? 'drop-shadow(0 0 25px rgba(239, 68, 68, 1)) drop-shadow(0 0 50px rgba(239, 68, 68, 0.7))' 
            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
          transition: status === 'running' ? 'all 0.05s linear' : 'all 0.3s ease-out',
        }}
      >
        <PlaneSprite crashed={status === 'crashed'} className="w-24 h-12 md:w-32 md:h-16" />
      </div>

      {/* Multiplier display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {status === 'waiting' ? (
          <div className="text-center space-y-6">
            <div className="text-2xl md:text-4xl text-cyan-400 font-display font-bold tracking-wider drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
              PLACE YOUR BETS
            </div>
            <div className="text-base md:text-xl text-slate-400 font-display mb-3 animate-pulse">
              WAITING FOR NEXT ROUND...
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : status === 'crashed' ? (
          <div className="text-center animate-scale-in">
            <div className="text-6xl md:text-8xl font-bold font-display text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,1)] mb-3">
              {currentMultiplier.toFixed(2)}x
            </div>
            <div className="text-2xl md:text-3xl text-red-400 font-display font-bold animate-pulse tracking-wider drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
              FLEW AWAY!
            </div>
          </div>
        ) : (
          <div className="text-7xl md:text-9xl font-bold font-display text-cyan-400 drop-shadow-[0_0_50px_rgba(34,211,238,0.9)] animate-pulse-glow tracking-wider">
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
