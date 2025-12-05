import { cn } from '@/lib/utils';

interface PlaneSpriteProps {
  className?: string;
  crashed?: boolean;
}

export const PlaneSprite = ({ className, crashed = false }: PlaneSpriteProps) => {
  return (
    <svg
      viewBox="0 0 120 60"
      className={cn("w-24 h-12", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Plane body */}
      <ellipse 
        cx="55" 
        cy="30" 
        rx="40" 
        ry="12" 
        className={cn(
          "transition-all duration-300",
          crashed ? "fill-orange-600" : "fill-red-500"
        )}
      />
      
      {/* Cockpit */}
      <ellipse 
        cx="85" 
        cy="28" 
        rx="12" 
        ry="8" 
        className="fill-cyan-400/80"
      />
      <ellipse 
        cx="85" 
        cy="28" 
        rx="8" 
        ry="5" 
        className="fill-cyan-300/60"
      />
      
      {/* Top wing */}
      <path
        d="M 35 18 L 65 18 L 70 30 L 30 30 Z"
        className={cn(
          "transition-all duration-300",
          crashed ? "fill-orange-700" : "fill-red-600"
        )}
      />
      
      {/* Bottom wing */}
      <path
        d="M 35 42 L 65 42 L 70 30 L 30 30 Z"
        className={cn(
          "transition-all duration-300",
          crashed ? "fill-orange-700" : "fill-red-600"
        )}
      />
      
      {/* Tail fin */}
      <path
        d="M 15 30 L 25 12 L 30 30 Z"
        className={cn(
          "transition-all duration-300",
          crashed ? "fill-orange-600" : "fill-red-500"
        )}
      />
      
      {/* Tail horizontal */}
      <path
        d="M 10 25 L 28 25 L 28 35 L 10 35 Z"
        className={cn(
          "transition-all duration-300",
          crashed ? "fill-orange-700" : "fill-red-600"
        )}
      />
      
      {/* Engine glow / thrust */}
      {!crashed && (
        <>
          <ellipse 
            cx="8" 
            cy="30" 
            rx="8" 
            ry="4" 
            className="fill-orange-500 animate-pulse opacity-80"
          />
          <ellipse 
            cx="5" 
            cy="30" 
            rx="5" 
            ry="2" 
            className="fill-yellow-400 animate-pulse"
          />
        </>
      )}
      
      {/* Smoke/fire when crashed */}
      {crashed && (
        <>
          <circle cx="20" cy="20" r="6" className="fill-gray-600 opacity-60 animate-ping" />
          <circle cx="30" cy="15" r="4" className="fill-gray-500 opacity-50 animate-ping" style={{ animationDelay: '0.2s' }} />
          <circle cx="40" cy="10" r="3" className="fill-orange-500 opacity-70 animate-ping" style={{ animationDelay: '0.1s' }} />
        </>
      )}
      
      {/* Propeller blur effect */}
      {!crashed && (
        <ellipse 
          cx="100" 
          cy="28" 
          rx="2" 
          ry="10" 
          className="fill-gray-400/50"
        />
      )}
    </svg>
  );
};
