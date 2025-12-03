
export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'potion' | 'misc';
  effect?: string; // e.g., "+2 DMG", "Heals 5 HP"
  quantity: number;
}

export interface Resource {
  name: string; // e.g. "Level 1 Slots", "Blood", "Mana"
  current: number;
  max: number;
  color: string; // Tailwind color class e.g. "bg-blue-500"
}

export interface Character {
  system: 'dnd5e' | 'vtm' | 'isekai';
  name: string;
  class: string; 
  background?: string;
  level: number;
  hp: number;
  maxHp: number;
  ac?: number; 
  stats: Record<string, number>;
  skills: string[]; 
  spells: string[]; 
  resources: Resource[]; // Replaces generic spell slots
  inventory: Item[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export enum GameState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  PLAYING = 'PLAYING',
  ERROR = 'ERROR',
}

export type ViewMode = 'AUTH' | 'MENU' | 'SETUP' | 'GAME';

export interface GameTemplate {
  name: string;
  description: string;
  character: Character;
}

export interface GameSystemConfig {
  id: string;
  name: string;
  description: string;
  instruction: string;
  introText: string;
  templates: GameTemplate[];
  theme: ThemeConfig;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  bgImage: string;
  font: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  location: string;
}

export interface User {
  username: string;
  campaignsPlayed: number;
}

export interface StoryChapter {
  id: string;
  title: string;
  content: string; // The novelized text
  date: string;
  system: string;
}

export type Language = 'en' | 'tr' | 'ru';

export interface AppSettings {
  musicVolume: number;
  sfxVolume: number;
  showSubtitles: boolean;
  autoSave: boolean;
  language: Language;
}

export interface GameSave {
  id: string;
  timestamp: number;
  systemKey: string;
  character: Character;
  messages: ChatMessage[];
  notepadContent: string;
  quests: Quest[];
  npcs: NPC[];
  chapters: StoryChapter[];
}

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  type: 'player' | 'npc' | 'enemy';
}
