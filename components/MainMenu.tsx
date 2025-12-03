
import React, { useState, useEffect } from 'react';
import { Sword, Settings, LogOut, RotateCcw, Trash2, HardDrive, X } from 'lucide-react';
import { User, AppSettings, Language, GameSave } from '../types';
import { UI_TEXT } from '../constants';

interface MainMenuProps {
  user: User;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  onNewGame: () => void;
  onLoadGame: (saveId: string) => void;
  onSettings: () => void;
  onLogout: () => void;
  saveKeys: string[]; // Pass available save keys
}

const MainMenu: React.FC<MainMenuProps> = ({ user, settings, setSettings, onNewGame, onLoadGame, onSettings, onLogout, saveKeys }) => {
  const t = UI_TEXT[settings.language];
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saves, setSaves] = useState<GameSave[]>([]);

  useEffect(() => {
    if (showLoadModal) {
      const loadedSaves: GameSave[] = [];
      try {
        const raw = localStorage.getItem('gemini_rpg_saves');
        if (raw) {
          const savesMap = JSON.parse(raw);
          Object.values(savesMap).forEach((s: any) => loadedSaves.push(s));
        }
      } catch (e) { console.error(e); }
      setSaves(loadedSaves.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [showLoadModal]);

  const handleDelete = (id: string) => {
    if(!confirm(t.confirmDelete)) return;
    try {
      const raw = localStorage.getItem('gemini_rpg_saves');
      if (raw) {
        const savesMap = JSON.parse(raw);
        delete savesMap[id];
        localStorage.setItem('gemini_rpg_saves', JSON.stringify(savesMap));
        setSaves(prev => prev.filter(s => s.id !== id));
      }
    } catch(e) {}
  };

  const changeLang = (lang: Language) => {
    setSettings({...settings, language: lang});
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
      
      <div className="z-10 w-full max-w-lg p-8 animate-in zoom-in duration-500 relative">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-600 mb-2 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
            Gemini RPG
          </h1>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs">Voice-Powered Roleplaying</p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button onClick={() => changeLang('en')} className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${settings.language === 'en' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>English</button>
          <button onClick={() => changeLang('tr')} className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${settings.language === 'tr' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>Türkçe</button>
          <button onClick={() => changeLang('ru')} className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${settings.language === 'ru' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>Русский</button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-3">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
               <div className="w-10 h-10 rounded-full bg-violet-900 flex items-center justify-center text-violet-300 font-bold">
                 {user.username.charAt(0).toUpperCase()}
               </div>
               <div>
                 <p className="text-sm text-gray-400">ID: {user.username}</p>
                 <p className="font-bold text-white text-lg">{user.campaignsPlayed} {t.campaigns}</p>
               </div>
             </div>

             <button 
               onClick={onNewGame}
               className="w-full group relative overflow-hidden bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2"
             >
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
               <Sword size={20} className="group-hover:rotate-45 transition-transform" /> {t.startNew}
             </button>

             <button 
                 onClick={() => setShowLoadModal(true)}
                 className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-4 rounded-xl transition-all border border-gray-700 hover:border-violet-500 flex items-center justify-center gap-2"
             >
                 <RotateCcw size={20} /> {t.loadGame}
             </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={onSettings} className="bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 rounded-xl p-4 text-gray-400 hover:text-white transition-all flex flex-col items-center gap-2">
                <Settings size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.settings}</span>
             </button>
             <button onClick={onLogout} className="bg-gray-900/50 hover:bg-red-900/20 border border-gray-800 hover:border-red-900/50 rounded-xl p-4 text-gray-400 hover:text-red-400 transition-all flex flex-col items-center gap-2">
                <LogOut size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.logout}</span>
             </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-600 font-mono">
          v2.2 • Gemini Flash 2.5
        </p>

        {/* Load Game Modal */}
        {showLoadModal && (
          <div className="absolute inset-0 bg-gray-950 z-20 rounded-2xl p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-cinzel font-bold text-violet-400">{t.loadGame}</h3>
               <button onClick={() => setShowLoadModal(false)}><X size={20} className="text-gray-500 hover:text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
               {saves.length === 0 && <p className="text-center text-gray-500 text-sm mt-10">{t.noSaves}</p>}
               {saves.map(save => (
                 <div key={save.id} className="bg-gray-900 p-3 rounded-lg border border-gray-800 hover:border-violet-500 flex items-center justify-between group">
                    <div className="cursor-pointer flex-1" onClick={() => onLoadGame(save.id)}>
                      <p className="font-bold text-white text-sm">{save.character.name} <span className="text-xs text-gray-500 font-normal">({save.character.class})</span></p>
                      <p className="text-[10px] text-gray-500">{new Date(save.timestamp).toLocaleString()} • {save.systemKey.toUpperCase()}</p>
                    </div>
                    <button onClick={() => handleDelete(save.id)} className="p-2 text-gray-600 hover:text-red-500"><Trash2 size={16} /></button>
                 </div>
               ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MainMenu;
