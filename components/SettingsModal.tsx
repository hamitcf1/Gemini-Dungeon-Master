
import React from 'react';
import { X, Volume2, Music, Save, Type } from 'lucide-react';
import { AppSettings } from '../types';
import { UI_TEXT } from '../constants';

interface SettingsModalProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, setSettings, onClose }) => {
  const t = UI_TEXT[settings.language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <h2 className="text-lg font-cinzel font-bold text-white">{t.settings}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          
          {/* Audio Settings */}
          <div className="space-y-4">
             <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
               <Music size={14} /> {t.audio}
             </h3>
             
             <div>
               <div className="flex justify-between text-sm text-gray-300 mb-1">
                 <span>{t.musicVolume}</span>
                 <span>{Math.round(settings.musicVolume * 100)}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" max="1" step="0.1"
                 value={settings.musicVolume}
                 onChange={(e) => setSettings({...settings, musicVolume: parseFloat(e.target.value)})}
                 className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
               />
             </div>
             
             <div>
               <div className="flex justify-between text-sm text-gray-300 mb-1">
                 <span>{t.sfxVolume}</span>
                 <span>{Math.round(settings.sfxVolume * 100)}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" max="1" step="0.1"
                 value={settings.sfxVolume}
                 onChange={(e) => setSettings({...settings, sfxVolume: parseFloat(e.target.value)})}
                 className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
               />
             </div>
          </div>

          <div className="h-px bg-gray-800"></div>

          {/* Gameplay Settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
               <Type size={14} /> {t.gameplay}
             </h3>
             
             <div className="flex items-center justify-between">
               <span className="text-sm text-gray-300">{t.showSubtitles}</span>
               <button 
                 onClick={() => setSettings({...settings, showSubtitles: !settings.showSubtitles})}
                 className={`w-10 h-5 rounded-full relative transition-colors ${settings.showSubtitles ? 'bg-violet-600' : 'bg-gray-700'}`}
               >
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.showSubtitles ? 'left-6' : 'left-1'}`}></div>
               </button>
             </div>

             <div className="flex items-center justify-between">
               <span className="text-sm text-gray-300">{t.autoSave}</span>
               <button 
                 onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
                 className={`w-10 h-5 rounded-full relative transition-colors ${settings.autoSave ? 'bg-violet-600' : 'bg-gray-700'}`}
               >
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.autoSave ? 'left-6' : 'left-1'}`}></div>
               </button>
             </div>
          </div>

        </div>

        <div className="p-4 bg-gray-950 border-t border-gray-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-bold">
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
