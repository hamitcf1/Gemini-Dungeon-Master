
import React from 'react';
import { PenLine, Map, Users, CheckCircle, Circle, MessageCircle, ShoppingBag, ScrollText, User } from 'lucide-react';
import { Quest, NPC } from '../types';

interface JournalProps {
  activeTab: 'notes' | 'quests' | 'npcs';
  setActiveTab: (tab: 'notes' | 'quests' | 'npcs') => void;
  notepadContent: string;
  setNotepadContent: (val: string) => void;
  quests: Quest[];
  npcs: NPC[];
  onInteract: (text: string) => void;
  playSfx: (type: 'CLICK') => void;
  t: Record<string, string>;
}

const Journal: React.FC<JournalProps> = ({ 
  activeTab, 
  setActiveTab, 
  notepadContent, 
  setNotepadContent,
  quests,
  npcs,
  onInteract,
  playSfx,
  t
}) => {

  const hasActiveQuest = (npcName: string) => {
    return quests.some(q => q.status === 'active' && q.description.toLowerCase().includes(npcName.toLowerCase()));
  };

  return (
    <div className="flex flex-col h-full bg-gray-950/50 rounded-lg border border-gray-800 flex-1 min-h-0 overflow-hidden">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800 shrink-0 bg-gray-900/30">
         <button 
           onClick={() => { setActiveTab('notes'); playSfx('CLICK'); }}
           className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors ${activeTab === 'notes' ? 'bg-gray-900 text-violet-400 border-b-2 border-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
         >
           <PenLine size={14} /> {t.notes}
         </button>
         <button 
           onClick={() => { setActiveTab('quests'); playSfx('CLICK'); }}
           className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors ${activeTab === 'quests' ? 'bg-gray-900 text-violet-400 border-b-2 border-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
         >
           <Map size={14} /> {t.quests}
         </button>
         <button 
           onClick={() => { setActiveTab('npcs'); playSfx('CLICK'); }}
           className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors ${activeTab === 'npcs' ? 'bg-gray-900 text-violet-400 border-b-2 border-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
         >
           <Users size={14} /> {t.npcs}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <textarea
            className="w-full h-full bg-transparent border-none resize-none text-gray-300 text-sm focus:ring-0 leading-relaxed placeholder-gray-700"
            placeholder={t.typeAction}
            value={notepadContent}
            onChange={(e) => setNotepadContent(e.target.value)}
            spellCheck={false}
          />
        )}

        {/* QUESTS TAB */}
        {activeTab === 'quests' && (
          <div className="space-y-3">
            {quests.length === 0 && (
              <div className="text-center text-gray-600 italic text-sm mt-10">No active quests.</div>
            )}
            {quests.map((quest) => (
              <div key={quest.id} className={`p-3 rounded border ${quest.status === 'completed' ? 'bg-green-900/20 border-green-800' : quest.status === 'failed' ? 'bg-red-900/20 border-red-800' : 'bg-gray-800/40 border-gray-700'}`}>
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`font-bold text-sm ${quest.status === 'completed' ? 'text-green-400 line-through' : 'text-violet-200'}`}>
                    {quest.title}
                  </h4>
                  {quest.status === 'completed' ? <CheckCircle size={14} className="text-green-500" /> : <Circle size={14} className="text-violet-500" />}
                </div>
                <p className="text-xs text-gray-400">{quest.description}</p>
                <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-gray-600">
                  Status: {quest.status}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NPCs TAB */}
        {activeTab === 'npcs' && (
          <div className="space-y-3">
             {npcs.length === 0 && (
              <div className="text-center text-gray-600 italic text-sm mt-10">You haven't met anyone yet.</div>
            )}
            {npcs.map((npc) => {
              const hasQuest = hasActiveQuest(npc.name);
              return (
                <div key={npc.id} className={`p-3 rounded border ${hasQuest ? 'bg-violet-900/10 border-violet-500/50' : 'bg-gray-800/40 border-gray-700'} group transition-all hover:bg-gray-800/60`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <User size={14} /> {npc.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{npc.description}</p>
                  
                  {/* Dynamic Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => { playSfx('CLICK'); onInteract(`I talk to ${npc.name}.`); }}
                      className="flex-1 py-1.5 px-2 bg-gray-700 hover:bg-violet-600 rounded text-xs text-white transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageCircle size={12} /> Talk
                    </button>
                    
                    <button 
                      onClick={() => { playSfx('CLICK'); onInteract(`I ask ${npc.name} to show me their wares.`); }}
                      className="flex-1 py-1.5 px-2 bg-gray-700 hover:bg-amber-600 rounded text-xs text-white transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingBag size={12} /> Trade
                    </button>

                    {hasQuest && (
                       <button 
                        onClick={() => { playSfx('CLICK'); onInteract(`I ask ${npc.name} about the quest.`); }}
                        className="flex-1 py-1.5 px-2 bg-violet-800 hover:bg-violet-600 rounded text-xs text-white transition-colors flex items-center justify-center gap-1 animate-pulse"
                      >
                        <ScrollText size={12} /> Quest
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase bg-gray-900/50 px-2 py-1 rounded w-fit mt-2">
                    <Map size={10} /> {npc.location}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
