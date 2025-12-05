import { Round } from '@/types/game';

interface RoundHistoryProps {
  rounds: Round[];
}

const getMultiplierClass = (multiplier: number) => {
  if (multiplier >= 5) return 'multiplier-high';
  if (multiplier >= 2) return 'multiplier-medium';
  return 'multiplier-low';
};

export const RoundHistory = ({ rounds }: RoundHistoryProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4 scrollbar-hide">
      {rounds.map((round, i) => (
        <span
          key={round.id + i}
          className={`multiplier-badge whitespace-nowrap ${getMultiplierClass(round.crashPoint)}`}
        >
          {round.crashPoint.toFixed(2)}x
        </span>
      ))}
    </div>
  );
};
