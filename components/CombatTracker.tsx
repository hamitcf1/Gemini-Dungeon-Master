
import React, { useState } from 'react';
import { Combatant } from '../types';
import { Skull, Shield, Swords, Plus, X, Heart } from 'lucide-react';

interface CombatTrackerProps {
  combatants: Combatant[];
  setCombatants: React.Dispatch<React.SetStateAction<Combatant[]>>;
  t: Record<string, string>;
}

const CombatTracker: React.FC<CombatTrackerProps> = ({ combatants, setCombatants, t }) => {
  const [newName, setNewName] = useState('');
  const [newInit, setNewInit] = useState('');
  const [newHp, setNewHp] = useState('');
  const [newType, setNewType] = useState<'player' | 'enemy' | 'npc'>('enemy');

  const addCombatant = () => {
    if (!newName) return;
    const newCombatant: Combatant = {
      id: Date.now().toString(),
      name: newName,
      initiative: parseInt(newInit) || 0,
      hp: parseInt(newHp) || 10,
      maxHp: parseInt(newHp) || 10,
      type: newType
    };
    
    setCombatants(prev => [...prev, newCombatant].sort((a, b) => b.initiative - a.initiative));
    setNewName('');
    setNewInit('');
    setNewHp('');
  };

  const removeCombatant = (id: string) => {
    setCombatants(prev => prev.filter(c => c.id !== id));
  };

  const updateHp = (id: string, delta: number) => {
    setCombatants(prev => prev.map(c => 
      c.id === id ? { ...c, hp: Math.max(0, c.hp + delta) } : c
    ));
  };

  return (
    <div className="bg-gray-900/90 border border-gray-700 rounded-lg overflow-hidden flex flex-col h-full shadow-2xl backdrop-blur-md">
      <div className="bg-red-900/30 p-3 border-b border-red-900/50 flex items-center gap-2">
        <Swords className="text-red-400" size={18} />
        <h3 className="font-cinzel font-bold text-red-100">{t.combatTracker}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {combatants.map((c) => (
          <div key={c.id} className={`p-2 rounded border flex items-center justify-between ${
            c.type === 'enemy' ? 'bg-red-950/40 border-red-900/30' : 
            c.type === 'player' ? 'bg-blue-950/40 border-blue-900/30' : 
            'bg-gray-800/40 border-gray-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center font-bold text-gray-400 border border-gray-700">
                {c.initiative}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-200">{c.name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Heart size={10} className={c.hp < c.maxHp / 2 ? 'text-red-500' : 'text-green-500'} />
                  <span>{c.hp} / {c.maxHp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => updateHp(c.id, -1)} className="w-6 h-6 rounded bg-red-900/50 hover:bg-red-800 text-red-200 flex items-center justify-center">-</button>
              <button onClick={() => updateHp(c.id, 1)} className="w-6 h-6 rounded bg-green-900/50 hover:bg-green-800 text-green-200 flex items-center justify-center">+</button>
              <button onClick={() => removeCombatant(c.id)} className="w-6 h-6 rounded hover:bg-gray-700 text-gray-500 flex items-center justify-center ml-2">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New */}
      <div className="p-3 bg-gray-950 border-t border-gray-800 grid grid-cols-4 gap-2">
        <input 
          placeholder="Name" 
          value={newName} 
          onChange={e => setNewName(e.target.value)}
          className="col-span-4 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
        />
        <input 
          placeholder={t.initiative} 
          type="number"
          value={newInit} 
          onChange={e => setNewInit(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
        />
        <input 
          placeholder="HP" 
          type="number"
          value={newHp} 
          onChange={e => setNewHp(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
        />
        <select 
          value={newType}
          onChange={(e: any) => setNewType(e.target.value)}
          className="col-span-2 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
        >
          <option value="enemy">{t.enemy}</option>
          <option value="npc">{t.npc}</option>
          <option value="player">{t.player}</option>
        </select>
        <button onClick={addCombatant} className="col-span-4 bg-red-900 hover:bg-red-800 text-red-100 py-1 rounded text-xs font-bold border border-red-700">
          {t.addCombatant}
        </button>
      </div>
    </div>
  );
};

export default CombatTracker;
