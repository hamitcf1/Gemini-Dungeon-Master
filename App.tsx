
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { Mic, MicOff, Power, Send, Sword, Skull, User, ChevronRight, Save, Sparkles, Plus, Swords, BookOpen, Settings as SettingsIcon, PanelLeftClose, PanelRightClose, PanelLeftOpen, PanelRightOpen, GripVertical, LogOut } from 'lucide-react';
import { GAME_SYSTEMS, COMBAT_MUSIC_URL, SFX, UI_TEXT } from './constants';
import { Character, ChatMessage, GameState, GameSave, Combatant, Quest, NPC, User as UserType, StoryChapter, AppSettings, Item, ViewMode } from './types';
import { base64ToUint8Array, createPcmBlob, decodeAudioData } from './services/audioUtils';
import Visualizer from './components/Visualizer';
import CharacterSheet from './components/CharacterSheet';
import ChatLog from './components/ChatLog';
import DiceRoller from './components/DiceRoller';
import Journal from './components/Journal';
import CombatTracker from './components/CombatTracker';
import AuthScreen from './components/AuthScreen';
import SettingsModal from './components/SettingsModal';
import StoryBook from './components/StoryBook';
import MainMenu from './components/MainMenu';

// --- TOOLS DEFINITION ---

const updateHpTool: FunctionDeclaration = {
  name: 'updateHp',
  description: 'Update the character\'s Hit Points (HP).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.NUMBER, description: 'HP to add or remove (negative for damage).' },
    },
    required: ['amount'],
  },
};

const addItemTool: FunctionDeclaration = {
  name: 'addItem',
  description: 'Add an item to the character\'s inventory.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Item name.' },
      description: { type: Type.STRING, description: 'Short visual description.' },
      type: { type: Type.STRING, description: 'Item type: weapon, armor, potion, or misc.' },
      effect: { type: Type.STRING, description: 'Stat effect e.g. "+1 DMG" or "Heals 5 HP". Optional.' },
    },
    required: ['name', 'description', 'type'],
  },
};

const updateQuestTool: FunctionDeclaration = {
  name: 'updateQuest',
  description: 'Add a new quest or update an existing one.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'Title of the quest' },
      description: { type: Type.STRING, description: 'Short description of the objective' },
      status: { type: Type.STRING, description: 'Current status: active, completed, or failed' },
    },
    required: ['title', 'status'],
  }
};

const addNpcTool: FunctionDeclaration = {
  name: 'addNpc',
  description: 'Register a new NPC that the player has met.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Name of the NPC' },
      description: { type: Type.STRING, description: 'Who they are and what they look like' },
      location: { type: Type.STRING, description: 'Where they were met' },
    },
    required: ['name', 'description'],
  }
};

const SAVES_KEY = 'gemini_rpg_saves';

const App: React.FC = () => {
  // --- STATE ---
  const [viewMode, setViewMode] = useState<ViewMode>('AUTH');
  const [user, setUser] = useState<UserType | null>(null);
  const [settings, setSettings] = useState<AppSettings>({ musicVolume: 0.3, sfxVolume: 0.5, showSubtitles: true, autoSave: true, language: 'en' });
  const [showSettings, setShowSettings] = useState(false);
  const [showStoryBook, setShowStoryBook] = useState(false);
  
  // Layout State
  const [leftPanelWidth, setLeftPanelWidth] = useState(340);
  const [rightPanelWidth, setRightPanelWidth] = useState(380);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);

  // Game Setup
  const [selectedSystemKey, setSelectedSystemKey] = useState<string>('dnd5e');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customChar, setCustomChar] = useState<Partial<Character>>({ name: '', class: '', background: '' });

  // Gameplay
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notepadContent, setNotepadContent] = useState<string>('');
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'journal'>('chat');
  const [journalTab, setJournalTab] = useState<'notes' | 'quests' | 'npcs'>('notes');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [chapters, setChapters] = useState<StoryChapter[]>([]);
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null);

  // Combat
  const [showCombatTracker, setShowCombatTracker] = useState(false);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const combatAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio/AI
  const [isMicOn, setIsMicOn] = useState(true);
  const [currentTranscription, setCurrentTranscription] = useState<{user: string, model: string}>({user: '', model: ''});
  const [inputText, setInputText] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  const t = UI_TEXT[settings.language];

  // SFX Helper
  const playSfx = (type: keyof typeof SFX) => {
    const audio = new Audio(SFX[type]);
    audio.volume = settings.sfxVolume;
    audio.play().catch(e => console.warn("SFX Error", e));
  };

  // --- EFFECTS ---

  // Resize Handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      if (isResizing === 'left') {
        const newWidth = Math.max(260, Math.min(e.clientX, 600)); // Min 260, Max 600
        setLeftPanelWidth(newWidth);
      } else if (isResizing === 'right') {
        const newWidth = Math.max(300, Math.min(window.innerWidth - e.clientX, 800)); // Min 300, Max 800
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);


  useEffect(() => {
    // Combat Music Logic
    if (!combatAudioRef.current) {
      combatAudioRef.current = new Audio(COMBAT_MUSIC_URL);
      combatAudioRef.current.loop = true;
    }
    
    combatAudioRef.current.volume = settings.musicVolume;

    if (showCombatTracker && gameState === GameState.PLAYING) {
      combatAudioRef.current.play().catch(e => console.error("Audio play failed", e));
    } else {
      combatAudioRef.current.pause();
    }

    return () => {
      combatAudioRef.current?.pause();
    };
  }, [showCombatTracker, gameState, settings.musicVolume]);

  // --- ACTIONS ---

  const handleLogin = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    setViewMode('MENU');
  };

  const handleLogout = () => {
    setUser(null);
    setViewMode('AUTH');
    setCharacter(null);
    setMessages([]);
    setGameState(GameState.IDLE);
    window.location.reload();
  };

  const loadGame = (saveId: string) => {
    try {
      const raw = localStorage.getItem(SAVES_KEY);
      if (raw) {
        const saves = JSON.parse(raw);
        const parsed: GameSave = saves[saveId];
        if (parsed) {
          setCurrentSaveId(saveId);
          setCharacter(parsed.character);
          setMessages(parsed.messages);
          setNotepadContent(parsed.notepadContent || '');
          setQuests(parsed.quests || []);
          setNpcs(parsed.npcs || []);
          setChapters(parsed.chapters || []);
          setSelectedSystemKey(parsed.systemKey);
          setViewMode('GAME');
        }
      }
    } catch (e) {
      console.error("Failed to load game", e);
    }
  };

  const saveGame = () => {
    if (!character) return;
    const saveId = currentSaveId || Date.now().toString();
    const save: GameSave = {
      id: saveId,
      timestamp: Date.now(),
      systemKey: selectedSystemKey,
      character,
      messages,
      notepadContent,
      quests,
      npcs,
      chapters
    };
    
    // Multi-save logic
    const existingRaw = localStorage.getItem(SAVES_KEY);
    const saves = existingRaw ? JSON.parse(existingRaw) : {};
    saves[saveId] = save;
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
    
    setCurrentSaveId(saveId);
    setSaveStatus(t.done);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const generateStoryChapter = async () => {
    if (messages.length < 2) return; 
    setIsGeneratingStory(true);
    
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("No API Key");
      const ai = new GoogleGenAI({ apiKey });
      
      const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
      const context = notepadContent ? `Player Notes:\n${notepadContent}\n` : '';
      
      const prompt = `You are a best-selling fantasy author. 
      Convert the following RPG session transcript into a high-quality novel chapter.
      
      STRICT RULES:
      1. ONLY use events that happened in the transcript. Do NOT invent new encounters, dialogue, or scenarios.
      2. If the transcript implies an action (e.g. "I attack with my sword"), narrate it vividly.
      3. Use descriptive prose and internal monologue based on the character's background.
      4. Write in ${settings.language === 'tr' ? 'Turkish' : settings.language === 'ru' ? 'Russian' : 'English'}.
      5. Fix grammar and pacing.
      6. Use Markdown formatting.
      7. Create a creative Title for the chapter.
      
      ${context}
      
      Transcript:
      ${transcript}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      const content = response.text;
      const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^Title:\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1] : `${t.chapter} ${chapters.length + 1}`;

      const newChapter: StoryChapter = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString(),
        system: GAME_SYSTEMS[selectedSystemKey].name
      };

      setChapters(prev => [...prev, newChapter]);
      setSaveStatus("Story Written!");
      setTimeout(() => setSaveStatus(null), 2000);
      setShowStoryBook(true);
    } catch (e) {
      console.error("Story generation failed", e);
      setSaveStatus("Failed.");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const startCustomGame = () => {
    const newChar: Character = {
      system: selectedSystemKey as any,
      name: customChar.name || "Adventurer",
      class: customChar.class || "Unknown",
      background: customChar.background || "A mysterious traveler.",
      level: 1,
      hp: 12,
      maxHp: 12,
      ac: 10,
      stats: { Str: 10, Dex: 10, Con: 10, Int: 10, Wis: 10, Cha: 10 },
      skills: ["Survival"],
      spells: [],
      resources: [],
      inventory: [{ id: '1', name: "Traveler's Clothes", description: "Worn but sturdy.", type: "misc", quantity: 1 }],
    };
    setCharacter(newChar);
    setMessages([]);
    setCurrentSaveId(null);
    setViewMode('GAME');
  };

  const startGame = () => {
    const system = GAME_SYSTEMS[selectedSystemKey];
    const template = system.templates[selectedTemplateIndex];
    const charCopy = JSON.parse(JSON.stringify(template.character));
    setCharacter(charCopy);
    setMessages([]);
    setCurrentSaveId(null);
    setViewMode('GAME');
  };

  const handleResourceUpdate = (resName: string, val: number) => {
    setCharacter(prev => {
      if (!prev) return null;
      const newRes = prev.resources.map(r => r.name === resName ? { ...r, current: Math.max(0, Math.min(r.max, val)) } : r);
      return { ...prev, resources: newRes };
    });
  };

  const handleCastSpell = (spell: string) => {
    handleInteract(`[Action: Casts "${spell}"]`);
  };

  const handleUseItem = (item: Item) => {
    handleInteract(`[Action: Uses item "${item.name}"]`);
  };

  const handleDropItem = (itemId: string, itemName: string) => {
    setCharacter(prev => {
      if(!prev) return null;
      return { ...prev, inventory: prev.inventory.filter(i => i.id !== itemId) };
    });
    handleInteract(`[Action: Drops item "${itemName}" from inventory]`);
  };

  const handleInteract = (text: string) => {
    // Immediate UI feedback
    const userMsg: ChatMessage = { id: Date.now().toString() + 'u', role: 'user', text: text, timestamp: new Date() };
    setMessages(prev => {
      const newState = [...prev, userMsg];
      return newState.slice(-50); // Limit chat log to last 50 messages to prevent memory issues
    });

    if (sessionRef.current && gameState === GameState.PLAYING) {
      sessionRef.current.then((session: any) => {
         // Safety check for send function
         if (typeof session.send === 'function') {
           session.send([{ text: text }]);
         } else {
           console.warn("session.send is not available. Ensure SDK supports text turns in Live API.");
           // Fallback or silently fail if not supported, but UI is updated.
         }
      });
    }
  };

  const exitToMenu = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    
    setGameState(GameState.IDLE);
    setMessages([]);
    setCharacter(null);
    setQuests([]);
    setNpcs([]);
    setChapters([]);
    setNotepadContent('');
    setViewMode('MENU');
  };

  // --- CONNECT ---

  const connect = async () => {
    try {
      if (!character) return;
      setGameState(GameState.CONNECTING);
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY not found");
      
      const ai = new GoogleGenAI({ apiKey });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;
      
      const analyser = outputCtx.createAnalyser();
      analyserRef.current = analyser;
      const outputNode = outputCtx.createGain();
      outputNode.connect(analyser);
      analyser.connect(outputCtx.destination);
      outputNode.gain.value = settings.sfxVolume; 

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;

      const systemConfig = GAME_SYSTEMS[selectedSystemKey];
      const isNewGame = messages.length === 0;
      
      const langInstruction = settings.language === 'tr' ? "You must speak, narrate, and reply strictly in Turkish." :
                              settings.language === 'ru' ? "You must speak, narrate, and reply strictly in Russian." :
                              "You must speak, narrate, and reply strictly in English.";

      const instructions = `${systemConfig.instruction}
      
      LANGUAGE REQUIREMENT: ${langInstruction}

      Character Context: ${JSON.stringify(character)}
      
      IMPORTANT: You are the narrator and game master. 
      You MUST speak immediately when the session starts.
      
      IF this is a new game, START with the intro: "${systemConfig.introText}"
      IF this is a resumed game, summarize the last situation.
      
      Describe the world, the smells, the sounds, and the atmosphere vividly. Do not be brief.`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: { parts: [{ text: instructions }] },
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          tools: [{ functionDeclarations: [updateHpTool, addItemTool, updateQuestTool, addNpcTool] }],
          inputAudioTranscription: {}, 
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setGameState(GameState.PLAYING);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              if (!isMicOn) return; 
              const pcmBlob = createPcmBlob(e.inputBuffer.getChannelData(0));
              sessionPromise.then((session: any) => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
            
            // Removed direct session.send() call to prevent crashes.
            // The system instruction now forces the model to speak first.
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription?.text) {
              setCurrentTranscription(prev => ({ ...prev, model: prev.model + message.serverContent!.outputTranscription!.text }));
            }
            if (message.serverContent?.inputTranscription?.text) {
              setCurrentTranscription(prev => ({ ...prev, user: prev.user + message.serverContent!.inputTranscription!.text }));
            }
            
            if (message.serverContent?.turnComplete) {
              setCurrentTranscription((prev) => {
                // If we already added the user message via text input, don't duplicate it from audio transcription
                if (prev.model) {
                   setMessages(m => {
                      const newMsg: ChatMessage = { id: Date.now().toString() + 'm', role: 'model', text: prev.model, timestamp: new Date() };
                      const newM = [...m, newMsg];
                      return newM.slice(-50);
                   });
                   setNotepadContent(c => c + `\n\nDM: ${prev.model}`); 
                }
                return { user: '', model: '' };
              });
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputCtx) {
                const audioBuffer = await decodeAudioData(base64ToUint8Array(base64Audio), outputCtx, 24000, 1);
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                let result = { result: "ok" };
                if (fc.name === 'updateHp') {
                   const amount = Number(fc.args.amount);
                   if (amount < 0) playSfx('DAMAGE');
                   setCharacter(prev => prev ? ({ ...prev, hp: Math.min(prev.maxHp, Math.max(0, prev.hp + amount)) }) : null);
                   result = { result: `HP updated by ${amount}.` };
                } else if (fc.name === 'addItem') {
                  playSfx('EQUIP');
                  const newItem: Item = {
                    id: Date.now().toString(),
                    name: String(fc.args.name),
                    description: String(fc.args.description),
                    type: String(fc.args.type) as any,
                    effect: fc.args.effect ? String(fc.args.effect) : undefined,
                    quantity: 1
                  };
                  setCharacter(prev => prev ? ({ ...prev, inventory: [...prev.inventory, newItem] }) : null);
                  result = { result: `Added ${newItem.name} to inventory.` };
                } else if (fc.name === 'updateQuest') {
                  const title = String(fc.args.title);
                  const status = String(fc.args.status) as any;
                  setQuests(prev => {
                    const existing = prev.find(q => q.title === title);
                    return existing 
                      ? prev.map(q => q.title === title ? { ...q, status, description: fc.args.description ? String(fc.args.description) : q.description } : q)
                      : [...prev, { id: Date.now().toString(), title, description: String(fc.args.description || ""), status }];
                  });
                  result = { result: `Quest updated.` };
                } else if (fc.name === 'addNpc') {
                  const name = String(fc.args.name);
                  setNpcs(prev => prev.find(n => n.name === name) ? prev : [...prev, { id: Date.now().toString(), name, description: String(fc.args.description), location: fc.args.location ? String(fc.args.location) : "Unknown" }]);
                  result = { result: `NPC ${name} added.` };
                }
                sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: result } }));
              }
            }
          },
          onclose: () => setGameState(GameState.IDLE),
          onerror: (e) => { console.error(e); setGameState(GameState.ERROR); }
        }
      });
      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      setGameState(GameState.ERROR);
    }
  };

  const disconnect = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    inputAudioContextRef.current?.close();
    audioContextRef.current?.close();
    setGameState(GameState.IDLE);
    window.location.reload(); 
  };


  // --- RENDER ---

  if (viewMode === 'AUTH' || !user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (viewMode === 'MENU') {
    return (
      <>
        {showSettings && <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />}
        <MainMenu 
          user={user} 
          settings={settings}
          setSettings={setSettings}
          onNewGame={() => setViewMode('SETUP')} 
          onLoadGame={loadGame}
          onSettings={() => setShowSettings(true)}
          onLogout={handleLogout}
          saveKeys={[]} // Handled internally in menu now
        />
      </>
    );
  }

  if (viewMode === 'SETUP') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 font-sans animate-in fade-in">
        <div className="max-w-5xl w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
          {/* System Selection */}
          <div className="w-full md:w-1/3 bg-gray-950 p-6 border-r border-gray-800 flex flex-col overflow-y-auto custom-scrollbar">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-cinzel font-bold text-violet-400">{t.selectSystem}</h2>
               <button onClick={() => setViewMode('MENU')} className="text-gray-500 hover:text-white" title={t.backMenu}><PanelLeftClose size={16}/></button>
             </div>
             <div className="space-y-4 flex-1">
               {Object.values(GAME_SYSTEMS).map((sys) => (
                 <button
                   key={sys.id}
                   onClick={() => { setSelectedSystemKey(sys.id); setIsCreatingCustom(false); playSfx('CLICK'); }}
                   className={`w-full text-left p-4 rounded-xl border transition-all ${selectedSystemKey === sys.id ? 'bg-violet-900/20 border-violet-500 ring-1 ring-violet-500/50' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                 >
                    <div className="flex items-center gap-3 mb-2">
                       {sys.id === 'dnd5e' ? <Sword size={20} className="text-violet-400" /> : sys.id === 'vtm' ? <Skull size={20} className="text-red-500" /> : <Sparkles size={20} className="text-yellow-400" />}
                       <span className="font-bold text-gray-200">{sys.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{sys.description}</p>
                 </button>
               ))}
             </div>
          </div>
          {/* Character Selection */}
          <div className="w-full md:w-2/3 p-8 flex flex-col overflow-y-auto custom-scrollbar bg-gray-900/50">
            <h2 className="text-xl font-cinzel font-bold text-gray-200 mb-6">{t.chooseChar}</h2>
            {!isCreatingCustom ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button onClick={() => { setIsCreatingCustom(true); playSfx('CLICK'); }} className="p-6 rounded-xl border border-dashed border-gray-600 hover:border-violet-500 bg-gray-900/30 hover:bg-violet-900/10 flex flex-col items-center justify-center gap-3 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                      <Plus size={24} className="text-gray-400 group-hover:text-white" />
                    </div>
                    <span className="font-bold text-gray-300 group-hover:text-violet-300">{t.createCustom}</span>
                  </button>
                  {GAME_SYSTEMS[selectedSystemKey].templates.map((tpl, idx) => (
                    <button key={idx} onClick={() => { setSelectedTemplateIndex(idx); playSfx('CLICK'); }} className={`p-4 rounded-xl border text-left transition-all relative ${selectedTemplateIndex === idx ? 'bg-gray-800 border-gray-500 shadow-lg' : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800/80'}`}>
                      <div className="flex items-center gap-3 mb-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTemplateIndex === idx ? 'bg-violet-600' : 'bg-gray-700'}`}><User size={16} className="text-white" /></div>
                          <div><span className="font-bold text-white block">{tpl.name}</span><span className="text-xs text-violet-400">{tpl.character.class}</span></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{tpl.description}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-auto flex justify-end">
                  <button onClick={startGame} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-violet-900/20 group">{t.startAdv} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
                </div>
              </>
            ) : (
               <div className="flex flex-col h-full animate-in fade-in">
                  <div className="space-y-6 flex-1">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Character Name</label>
                       <input type="text" placeholder="e.g. Arin the Bold" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white outline-none focus:border-violet-500 transition-colors" onChange={e => setCustomChar({...customChar, name: e.target.value})}/>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Class / Archetype</label>
                       <input type="text" placeholder="e.g. Paladin, Netrunner, Mage" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white outline-none focus:border-violet-500 transition-colors" onChange={e => setCustomChar({...customChar, class: e.target.value})}/>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Background Story</label>
                       <textarea placeholder="Who are you? Where do you come from? What drives you?" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white outline-none h-32 focus:border-violet-500 transition-colors resize-none" onChange={e => setCustomChar({...customChar, background: e.target.value})}/>
                     </div>
                  </div>
                  <div className="flex justify-between pt-6 mt-6 border-t border-gray-800">
                    <button onClick={() => setIsCreatingCustom(false)} className="text-gray-500 hover:text-white transition-colors">Cancel</button>
                    <button onClick={startCustomGame} disabled={!customChar.name} className="bg-violet-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-8 py-3 rounded-full font-bold transition-all">{t.startAdv}</button>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- GAME VIEW ---

  const systemTheme = GAME_SYSTEMS[selectedSystemKey].theme;

  return (
    <div className={`min-h-screen bg-black text-white flex flex-row overflow-hidden font-sans ${systemTheme.font}`}>
      {/* Modals */}
      {showSettings && <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />}
      {showStoryBook && <StoryBook chapters={chapters} onClose={() => setShowStoryBook(false)} language={settings.language} />}

      {/* --- LEFT SIDEBAR: Character & Dice --- */}
      <div 
        className={`hidden md:flex flex-col border-r border-gray-800 bg-gray-950 z-20 shadow-xl transition-[width] duration-300 ease-in-out relative flex-shrink-0 ${isResizing ? 'transition-none' : ''}`}
        style={{ width: isLeftOpen ? leftPanelWidth : 0, opacity: isLeftOpen ? 1 : 0 }}
      >
        {isLeftOpen && (
          <>
            <div className="flex items-center justify-between p-2 border-b border-gray-800">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Character</span>
              <button onClick={() => setIsLeftOpen(false)} className="text-gray-500 hover:text-white"><PanelLeftClose size={16}/></button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              {character && <CharacterSheet 
                              character={character} 
                              onCastSpell={handleCastSpell} 
                              onUpdateResource={handleResourceUpdate} 
                              onUseItem={handleUseItem}
                              onDropItem={handleDropItem}
                              playSfx={playSfx} 
                              t={t} />}
            </div>
            <DiceRoller onRoll={(res) => handleInteract(`[Rolled: ${res}]`)} playSfx={playSfx} t={t} />
          </>
        )}
      </div>

      {/* Resizer LEFT */}
      {isLeftOpen && (
        <div 
          className="w-1 bg-gray-900 hover:bg-violet-500 cursor-col-resize z-30 transition-colors flex items-center justify-center group flex-shrink-0"
          onMouseDown={() => setIsResizing('left')}
        >
          <GripVertical size={12} className="text-gray-600 group-hover:text-white" />
        </div>
      )}

      {/* --- MAIN STAGE --- */}
      <div className="flex-1 relative flex flex-col min-w-0">
         {/* Background */}
         <div className="absolute inset-0 z-0">
           <img src={systemTheme.bgImage} className="w-full h-full object-cover opacity-40 blur-sm" alt="bg" />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/30"></div>
           {/* Particles/Dust Overlay */}
           <div className="absolute inset-0 opacity-20 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] bg-cover mix-blend-screen pointer-events-none"></div>
         </div>

         {/* Header */}
         <div className="relative z-10 flex items-center justify-between p-4">
           <div className="flex items-center gap-2">
             {!isLeftOpen && <button onClick={() => setIsLeftOpen(true)} className="text-gray-400 hover:text-white"><PanelLeftOpen size={20}/></button>}
           </div>
           
           <div className="flex items-center gap-2 bg-black/40 backdrop-blur rounded-full px-4 py-2 border border-white/10">
             <div className={`w-2 h-2 rounded-full ${gameState === GameState.PLAYING ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-xs font-bold tracking-widest text-gray-300">{gameState === GameState.PLAYING ? 'LIVE' : 'OFFLINE'}</span>
           </div>

           <div className="flex items-center gap-2">
             <button onClick={() => setShowSettings(true)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><SettingsIcon size={20}/></button>
             <button onClick={exitToMenu} className="text-gray-400 hover:text-red-400 p-2 hover:bg-white/10 rounded-full transition-colors" title={t.backMenu}><LogOut size={20}/></button>
             {!isRightOpen && <button onClick={() => setIsRightOpen(true)} className="text-gray-400 hover:text-white"><PanelRightOpen size={20}/></button>}
           </div>
         </div>

         {/* Center Visualization */}
         <div className="flex-1 relative z-10 flex flex-col items-center justify-center">
            {showCombatTracker && (
              <div className="absolute top-4 right-4 bottom-20 w-72 z-40 animate-in slide-in-from-right fade-in duration-300">
                <CombatTracker combatants={combatants} setCombatants={setCombatants} t={t} />
              </div>
            )}

            <div className="relative group cursor-pointer" onClick={gameState === GameState.IDLE ? connect : disconnect}>
              <Visualizer analyser={analyserRef.current} isActive={gameState === GameState.PLAYING} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {gameState === GameState.IDLE ? (
                   <Power size={40} className="text-violet-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                 ) : (
                   <div className="w-12 h-12"></div>
                 )}
              </div>
            </div>

            {/* Subtitles Overlay */}
            {settings.showSubtitles && (currentTranscription.model || currentTranscription.user) && (
              <div className="absolute bottom-24 left-10 right-10 text-center pointer-events-none">
                 <div className="inline-block bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/10 text-violet-100 text-lg font-cinzel shadow-2xl max-w-2xl">
                    {currentTranscription.user && <span className="text-blue-300 mr-2">You: {currentTranscription.user}</span>}
                    {currentTranscription.model && <span>{currentTranscription.model}</span>}
                 </div>
              </div>
            )}
         </div>

         {/* Bottom Control Bar */}
         <div className="relative z-20 p-4 border-t border-gray-800 bg-gray-950/80 backdrop-blur-md flex items-center gap-4">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/50' : 'bg-gray-800 text-red-400 hover:bg-gray-700'}`}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && inputText) { handleInteract(inputText); setInputText(''); } }}
                placeholder={gameState === GameState.PLAYING ? t.typeAction : t.connect}
                disabled={gameState !== GameState.PLAYING}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-full px-4 py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all disabled:opacity-50"
              />
              <button 
                onClick={() => { if(inputText) { handleInteract(inputText); setInputText(''); } }}
                disabled={!inputText || gameState !== GameState.PLAYING}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-violet-600 rounded-full text-white hover:bg-violet-500 transition-colors disabled:opacity-0 disabled:scale-0"
              >
                <Send size={16} />
              </button>
            </div>
         </div>
      </div>

      {/* Resizer RIGHT */}
      {isRightOpen && (
        <div 
          className="w-1 bg-gray-900 hover:bg-violet-500 cursor-col-resize z-30 transition-colors flex items-center justify-center group flex-shrink-0"
          onMouseDown={() => setIsResizing('right')}
        >
          <GripVertical size={12} className="text-gray-600 group-hover:text-white" />
        </div>
      )}

      {/* --- RIGHT SIDEBAR: Chat & Journal --- */}
      <div 
        className={`hidden md:flex flex-col border-l border-gray-800 bg-gray-950 z-20 shadow-xl transition-[width] duration-300 ease-in-out relative flex-shrink-0 ${isResizing ? 'transition-none' : ''}`}
        style={{ width: isRightOpen ? rightPanelWidth : 0, opacity: isRightOpen ? 1 : 0 }}
      >
         {isRightOpen && (
           <>
              {/* Top Tabs */}
              <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
                <div className="flex">
                  <button 
                    onClick={() => setActiveRightTab('chat')} 
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeRightTab === 'chat' ? 'border-violet-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    {t.log}
                  </button>
                  <button 
                    onClick={() => setActiveRightTab('journal')} 
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeRightTab === 'journal' ? 'border-violet-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    {t.journal}
                  </button>
                </div>
                <div className="flex items-center pr-2 gap-1">
                   <button onClick={() => setShowCombatTracker(!showCombatTracker)} className={`p-1.5 rounded hover:bg-gray-800 ${showCombatTracker ? 'text-red-400' : 'text-gray-500'}`} title={t.combatTracker}>
                     <Swords size={16} />
                   </button>
                   <button onClick={() => setIsRightOpen(false)} className="p-1.5 text-gray-500 hover:text-white">
                     <PanelRightClose size={16}/>
                   </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden p-2 flex flex-col min-h-0">
                 {activeRightTab === 'chat' ? (
                   <ChatLog messages={messages} t={t} />
                 ) : (
                   <Journal 
                    activeTab={journalTab} 
                    setActiveTab={setJournalTab} 
                    notepadContent={notepadContent}
                    setNotepadContent={setNotepadContent}
                    quests={quests}
                    npcs={npcs}
                    onInteract={(text) => handleInteract(text)}
                    playSfx={playSfx}
                    t={t as any}
                   />
                 )}
              </div>

              {/* Footer Controls */}
              <div className="p-3 border-t border-gray-800 grid grid-cols-2 gap-2 flex-shrink-0">
                 <button onClick={saveGame} className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                   <Save size={14} /> {saveStatus || t.save}
                 </button>
                 <button onClick={generateStoryChapter} disabled={isGeneratingStory} className="bg-violet-900/30 hover:bg-violet-900/50 border border-violet-500/30 text-violet-300 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                   {isGeneratingStory ? <Sparkles size={14} className="animate-spin" /> : <BookOpen size={14} />} 
                   {t.bookify}
                 </button>
              </div>
           </>
         )}
      </div>
    </div>
  );
};

export default App;
