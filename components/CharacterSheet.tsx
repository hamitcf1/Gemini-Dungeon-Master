
import React, { useState } from 'react';
import { Character, Resource, Item } from '../types';
import { Shield, Heart, Backpack, Zap, Scroll, Sword, Sparkles, AlertCircle, FlaskConical, Box, ArrowUpDown, Filter, Trash2, Hand } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onCastSpell?: (spell: string) => void;
  onUpdateResource?: (resourceName: string, newValue: number) => void;
  onUseItem: (item: Item) => void;
  onDropItem: (itemId: string, itemName: string) => void;
  playSfx: (type: 'CLICK' | 'EQUIP' | 'SPELL_CAST') => void;
  t: Record<string, string>;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onCastSpell, onUpdateResource, onUseItem, onDropItem, playSfx, t }) => {
  const isDnD = character.system === 'dnd5e';
  const isIsekai = character.system === 'isekai';
  const [activeTab, setActiveTab] = useState<'stats' | 'inv'>('stats');
  const [sortInvBy, setSortInvBy] = useState<'name' | 'type' | 'qty'>('name');

  const handleCast = (spell: string) => {
    playSfx('SPELL_CAST');
    onCastSpell?.(spell);
  };

  const getInvIcon = (type: string) => {
    switch (type) {
      case 'weapon': return <Sword size={14} className="text-red-400" />;
      case 'armor': return <Shield size={14} className="text-blue-400" />;
      case 'potion': return <FlaskConical size={14} className="text-green-400" />;
      default: return <Box size={14} className="text-gray-400" />;
    }
  };

  const sortedInventory = [...character.inventory].sort((a, b) => {
    if (sortInvBy === 'name') return a.name.localeCompare(b.name);
    if (sortInvBy === 'type') return a.type.localeCompare(b.type);
    if (sortInvBy === 'qty') return b.quantity - a.quantity;
    return 0;
  });

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg flex flex-col h-full overflow-hidden shadow-xl backdrop-blur-sm transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700 shrink-0 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-violet-400 font-cinzel">{character.name}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {character.class} • Lvl {character.level}
            </p>
          </div>
          <div className="text-[10px] font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded bg-gray-800 shadow-inner">
            {isDnD ? 'D&D 5E' : isIsekai ? 'ISEKAI' : 'VTM V5'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 shrink-0 relative">
        <button 
          onClick={() => { setActiveTab('stats'); playSfx('CLICK'); }}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'stats' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          {t.statsSkills}
        </button>
        <button 
          onClick={() => { setActiveTab('inv'); playSfx('CLICK'); }}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'inv' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          {t.inventory}
        </button>
        
        {/* Animated Underline */}
        <div 
          className={`absolute bottom-0 h-0.5 bg-violet-500 transition-all duration-300 w-1/2 ${activeTab === 'stats' ? 'left-0' : 'left-1/2'}`}
        ></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
        
        {/* Vitals - Always Visible */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col items-center bg-gray-800/80 p-3 rounded-lg border border-gray-700 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/10 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>
            <Heart className="w-5 h-5 text-red-500 mb-1 z-10" />
            <span className="text-2xl font-bold font-cinzel z-10">{character.hp}<span className="text-sm text-gray-500">/{character.maxHp}</span></span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest z-10">{t.health}</span>
          </div>
          {character.ac !== undefined && (
            <div className="flex-1 flex flex-col items-center bg-gray-800/80 p-3 rounded-lg border border-gray-700 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>
              <Shield className="w-5 h-5 text-blue-500 mb-1 z-10" />
              <span className="text-2xl font-bold font-cinzel z-10">{character.ac}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest z-10">{t.armor}</span>
            </div>
          )}
        </div>

        {/* Dynamic Resource Tracking */}
        {character.resources && character.resources.length > 0 && (
           <div className="space-y-3">
             {character.resources.map((res, idx) => (
               <div key={idx}>
                 <div className="flex justify-between text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">
                    <span>{res.name}</span>
                    <span>{res.current}/{res.max}</span>
                 </div>
                 <div className="flex gap-1">
                   {[...Array(res.max)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { playSfx('CLICK'); onUpdateResource && onUpdateResource(res.name, i < res.current ? res.current - 1 : res.current + 1); }}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${i < res.current ? res.color : 'bg-gray-800'}`}
                      />
                   ))}
                 </div>
               </div>
             ))}
           </div>
        )}

        <div className={`transition-opacity duration-300 ${activeTab === 'stats' ? 'opacity-100' : 'hidden opacity-0'}`}>
            {/* Attributes */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase flex items-center gap-2">
                <Zap className="w-3 h-3" /> {t.attributes}
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                {Object.entries(character.stats).map(([stat, value]) => {
                  const statValue = value as number;
                  const mod = isDnD ? Math.floor((statValue - 10) / 2) : 0;
                  
                  return (
                    <div key={stat} className="bg-gray-800/50 p-2 rounded border border-gray-700/50 hover:border-violet-500/50 transition-colors">
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide mb-1">{stat}</div>
                      <div className="text-lg font-cinzel font-bold text-white">{statValue}</div>
                      {isDnD && (
                        <div className={`text-[10px] font-bold ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {mod >= 0 ? '+' : ''}{mod}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            {character.skills && character.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase flex items-center gap-2">
                  <Sword className="w-3 h-3" /> {t.skills}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {character.skills.map((skill, idx) => (
                    <div key={idx} className="bg-gray-800/30 px-3 py-1.5 rounded-full text-xs text-gray-300 border border-gray-700/30">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spells/Abilities */}
            {character.spells && character.spells.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase flex items-center gap-2">
                  <Scroll className="w-3 h-3" /> {isIsekai ? t.cheatSkills : t.abilities}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {character.spells.map((spell, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleCast(spell)}
                      className="group flex items-center justify-between bg-violet-900/10 hover:bg-violet-900/30 px-3 py-2 rounded border border-violet-500/20 hover:border-violet-500/50 transition-all text-left"
                    >
                      <span className="text-xs font-medium text-violet-200 group-hover:text-white transition-colors">{spell}</span>
                      <Sparkles className="w-3 h-3 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className={`transition-opacity duration-300 ${activeTab === 'inv' ? 'opacity-100' : 'hidden opacity-0'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Backpack className="w-3 h-3" /> {t.backpack}
              </h3>
              
              {/* Sort Controls */}
              <div className="flex bg-gray-800 rounded p-0.5">
                <button onClick={() => setSortInvBy('name')} className={`p-1 rounded ${sortInvBy === 'name' ? 'bg-gray-700 text-white' : 'text-gray-500'}`} title={t.sortName}><Filter size={10} /></button>
                <button onClick={() => setSortInvBy('type')} className={`p-1 rounded ${sortInvBy === 'type' ? 'bg-gray-700 text-white' : 'text-gray-500'}`} title={t.sortType}><Box size={10} /></button>
                <button onClick={() => setSortInvBy('qty')} className={`p-1 rounded ${sortInvBy === 'qty' ? 'bg-gray-700 text-white' : 'text-gray-500'}`} title={t.sortQty}><ArrowUpDown size={10} /></button>
              </div>
            </div>

            <div className="space-y-2">
              {sortedInventory.map((item, idx) => (
                <div key={idx} className="bg-gray-800/50 p-3 rounded border border-gray-700/30 hover:border-gray-600 transition-all flex flex-col gap-2 group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-900 rounded border border-gray-700 mt-1">
                      {getInvIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{item.name}</span>
                        <span className="text-[10px] bg-gray-900 px-2 py-0.5 rounded text-gray-500 uppercase">{item.type}</span>
                      </div>
                      <p className="text-xs text-gray-400 italic leading-snug">{item.description}</p>
                      {item.effect && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                          <Sparkles size={10} /> {item.effect}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Item Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-700/30">
                    <button 
                      onClick={() => { playSfx('EQUIP'); onUseItem(item); }}
                      className="flex-1 bg-violet-900/30 hover:bg-violet-700 text-violet-200 hover:text-white py-1 rounded text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Hand size={12} /> {t.use}
                    </button>
                    <button 
                      onClick={() => { playSfx('CLICK'); onDropItem(item.id, item.name); }}
                      className="w-8 bg-gray-700/50 hover:bg-red-900/50 text-gray-400 hover:text-red-400 py-1 rounded flex items-center justify-center transition-colors"
                      title={t.drop}
                    >
                      <Trash2 size={12} />
                    </button>
                    {item.quantity > 1 && (
                       <div className="flex items-center justify-end flex-1 text-[10px] text-gray-500 font-mono">x{item.quantity}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center gap-2 p-3 bg-blue-900/10 border border-blue-900/30 rounded text-xs text-blue-200">
               <AlertCircle size={14} />
               <span>{t.lootHint}</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterSheet;
