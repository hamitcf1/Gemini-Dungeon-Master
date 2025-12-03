
import React, { useState } from 'react';
import { Dices, Hexagon } from 'lucide-react';

interface DiceRollerProps {
  onRoll: (result: string) => void;
  playSfx: (type: 'DICE_ROLL') => void;
  t: Record<string, string>;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, playSfx, t }) => {
  const [lastRoll, setLastRoll] = useState<string | null>(null);

  const rollDice = (sides: number) => {
    playSfx('DICE_ROLL');
    const result = Math.floor(Math.random() * sides) + 1;
    const resultString = `Rolled d${sides}: ${result}`;
    setLastRoll(resultString);
    onRoll(resultString);
  };

  const diceTypes = [4, 6, 8, 10, 12, 20];

  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-3 text-violet-400 font-cinzel font-bold text-sm">
        <Dices size={16} />
        <span>{t.diceRoller}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {diceTypes.map((sides) => (
          <button
            key={sides}
            onClick={() => rollDice(sides)}
            className="flex items-center justify-center gap-1 bg-gray-800 hover:bg-violet-900 border border-gray-700 hover:border-violet-500 rounded p-2 transition-all group"
          >
            <Hexagon size={14} className="text-gray-500 group-hover:text-white" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white">d{sides}</span>
          </button>
        ))}
      </div>

      {lastRoll && (
        <div className="mt-3 text-center text-sm font-bold text-violet-300 animate-pulse bg-violet-900/20 py-1 rounded border border-violet-500/30">
          {lastRoll}
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
