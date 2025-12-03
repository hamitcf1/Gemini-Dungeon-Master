
import { GameSystemConfig, Language } from "./types";

export const COMBAT_MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3?filename=action-drums-sport-beat-17076.mp3"; 

export const SFX = {
  DICE_ROLL: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_33d0c3664e.mp3?filename=dice-142528.mp3",
  SPELL_CAST: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_73187c3556.mp3?filename=magic-spell-6005.mp3",
  DAMAGE: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=sword-slash-and-swing-185432.mp3",
  CLICK: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_06d87f730c.mp3?filename=mouse-click-153941.mp3",
  EQUIP: "https://cdn.pixabay.com/download/audio/2022/03/22/audio_d1767223e7.mp3?filename=cloth-heavy-105545.mp3"
};

export const UI_TEXT: Record<Language, Record<string, string>> = {
  en: {
    startNew: "Start New Campaign",
    continue: "Resume Journey",
    loadGame: "Load Game",
    settings: "Settings",
    logout: "Logout",
    selectSystem: "Select Campaign",
    chooseChar: "Choose Hero",
    createCustom: "Create Custom Hero",
    startAdv: "Begin Story",
    backMenu: "Main Menu",
    connect: "Connect to DM",
    typeAction: "Describe your action...",
    log: "Adventure Log",
    journal: "Journal",
    notes: "Notes",
    quests: "Quests",
    npcs: "NPCs",
    save: "Save Progress",
    bookify: "Write Chronicle",
    combatTracker: "Combat Tracker",
    // Character Sheet
    statsSkills: "Stats",
    inventory: "Inventory",
    health: "HP",
    armor: "AC",
    attributes: "Attributes",
    skills: "Skills",
    abilities: "Spells & Abilities",
    cheatSkills: "Cheat Skills",
    backpack: "Backpack",
    sortName: "Name",
    sortType: "Type",
    sortQty: "Qty",
    lootHint: "Tell the DM 'I loot the body' to find items.",
    use: "Use",
    drop: "Drop",
    // Combat
    initiative: "Init",
    enemy: "Enemy",
    npc: "NPC",
    player: "Player",
    addCombatant: "Add Entity",
    // Settings
    audio: "Audio",
    musicVolume: "Music Volume",
    sfxVolume: "SFX Volume",
    gameplay: "Gameplay",
    showSubtitles: "Show Subtitles",
    autoSave: "Auto-Save",
    done: "Done",
    // Story
    storyTitle: "The Chronicle",
    backToGame: "Return",
    chapter: "Chapter",
    emptyStory: "The pages are blank... Live the adventure to write the history.",
    // Dice
    diceRoller: "Dice",
    // Main Menu
    campaigns: "Saves",
    noSaves: "No saved chronicles found.",
    delete: "Delete",
    confirmDelete: "Delete this save permanently?",
    load: "Load"
  },
  tr: {
    startNew: "Yeni Sefer",
    continue: "Devam Et",
    loadGame: "Yükle",
    settings: "Ayarlar",
    logout: "Çıkış",
    selectSystem: "Sefer Seç",
    chooseChar: "Kahraman Seç",
    createCustom: "Özel Karakter",
    startAdv: "Hikayeye Başla",
    backMenu: "Ana Menü",
    connect: "DM'e Bağlan",
    typeAction: "Ne yapacağını yaz...",
    log: "Kayıt",
    journal: "Günlük",
    notes: "Notlar",
    quests: "Görevler",
    npcs: "NPC'ler",
    save: "Kaydet",
    bookify: "Kitaplaştır",
    combatTracker: "Savaş",
    statsSkills: "İstatistik",
    inventory: "Çanta",
    health: "Can",
    armor: "Zırh",
    attributes: "Nitelik",
    skills: "Beceri",
    abilities: "Yetenekler",
    cheatSkills: "Hileler",
    backpack: "Sırt Çantası",
    sortName: "İsim",
    sortType: "Tür",
    sortQty: "Adet",
    lootHint: "Eşya almak için 'Lootluyorum' deyin.",
    use: "Kullan",
    drop: "At",
    initiative: "İnisiyatif",
    enemy: "Düşman",
    npc: "NPC",
    player: "Oyuncu",
    addCombatant: "Ekle",
    audio: "Ses",
    musicVolume: "Müzik",
    sfxVolume: "Efekt",
    gameplay: "Oynanış",
    showSubtitles: "Altyazı",
    autoSave: "Oto-Kayıt",
    done: "Tamam",
    storyTitle: "Vakanüvis",
    backToGame: "Dön",
    chapter: "Bölüm",
    emptyStory: "Henüz bir hikaye yok...",
    diceRoller: "Zar",
    campaigns: "Kayıtlar",
    noSaves: "Kayıt yok.",
    delete: "Sil",
    confirmDelete: "Silinecek, emin misin?",
    load: "Yükle"
  },
  ru: {
    startNew: "Новая кампания",
    continue: "Продолжить",
    loadGame: "Загрузить",
    settings: "Настройки",
    logout: "Выйти",
    selectSystem: "Кампания",
    chooseChar: "Герой",
    createCustom: "Создать",
    startAdv: "Начать",
    backMenu: "В меню",
    connect: "Подключить DM",
    typeAction: "Ваше действие...",
    log: "Лог",
    journal: "Журнал",
    notes: "Заметки",
    quests: "Квесты",
    npcs: "NPC",
    save: "Сохранить",
    bookify: "Книга",
    combatTracker: "Бой",
    statsSkills: "Статы",
    inventory: "Инвентарь",
    health: "HP",
    armor: "AC",
    attributes: "Атрибуты",
    skills: "Навыки",
    abilities: "Способности",
    cheatSkills: "Читы",
    backpack: "Рюкзак",
    sortName: "Имя",
    sortType: "Тип",
    sortQty: "Кол-во",
    lootHint: "Скажите 'Обыскать тело', чтобы найти лут.",
    use: "Исп.",
    drop: "Выбросить",
    initiative: "Иниц.",
    enemy: "Враг",
    npc: "NPC",
    player: "Игрок",
    addCombatant: "Добавить",
    audio: "Аудио",
    musicVolume: "Музыка",
    sfxVolume: "SFX",
    gameplay: "Геймплей",
    showSubtitles: "Субтитры",
    autoSave: "Автосохранение",
    done: "Готово",
    storyTitle: "Хроники",
    backToGame: "Назад",
    chapter: "Глава",
    emptyStory: "История еще не написана...",
    diceRoller: "Кубики",
    campaigns: "Сохранения",
    noSaves: "Нет сохранений.",
    delete: "Удалить",
    confirmDelete: "Удалить навсегда?",
    load: "Загрузить"
  }
};

// --- CAMPAIGN CONFIGURATIONS ---

const DND_INSTRUCTION = `
ROLE: You are the Dungeon Master (DM) for a solo D&D 5e campaign titled "The Curse of Shadowfen".
TONE: Atmospheric, Grim, Gothic Horror, Suspenseful. 

CAMPAIGN START:
The player is a lone adventurer arriving at the cursed village of Raven's Hollow. The village is plagued by a thick, supernatural fog. Villagers are missing.

YOUR RESPONSIBILITIES:
1. **IMMERSION IS KEY**: Do not just say "You see a tavern." Say " The smell of stale ale and wet dog hits you as the heavy oak door creaks open. The tavern is silent, save for the crackling fire."
2. **WORLD BUILDING**: Introduce NPCs with distinct voices and personalities. Describe the environment (weather, lighting, smells).
3. **GAMEPLAY**: This is a game. Ask the player what they want to do. Call for skill checks (e.g., "Roll for Perception").
4. **COMBAT**: Narrate combat viscera. Use the tools to track damage.
5. **INVENTORY**: If the player says "I drink the potion", act out the healing.
`;

const VTM_INSTRUCTION = `
ROLE: You are the Storyteller for a solo Vampire: The Masquerade (V5) chronicle titled "Neon Blood".
TONE: Noir, Political, Seductive, Dangerous.

CAMPAIGN START:
The player is a fledgling vampire in Los Angeles. The Prince has summoned them to 'The Velveteen Room' nightclub. Someone broke the Masquerade, and you are the scapegoat unless you find the truth.

YOUR RESPONSIBILITIES:
1. **ATMOSPHERE**: Describe the neon lights reflecting on wet pavement, the thumping bass of the club, the hunger inside the character.
2. **THE BEAST**: Remind the player of their Hunger. Tempt them.
3. **POLITICS**: NPCs should be manipulative. Trust no one.
4. **MECHANICS**: Call for attribute + skill rolls.
`;

const ISEKAI_INSTRUCTION = `
ROLE: You are the "System AI" for a solo Isekai adventure titled "Tower of Ascension".
TONE: Video-game-like, Epic, Slightly Sarcastic helper.

CAMPAIGN START:
The player died in the real world and has been reincarnated in the world of Aethelgard. They are standing at the base of the Great Tower. They have a "Cheat Skill".

YOUR RESPONSIBILITIES:
1. **SYSTEM NOTIFICATIONS**: Speak like a game interface when relevant (e.g., "Quest Accepted", "Level Up").
2. **POWER FANTASY**: Make the player feel their unique power, but present massive monsters to fight.
3. **WORLD**: High fantasy. Floating islands, magic crystals, dragon riders.
4. **LOOT**: Be generous with loot descriptions.
`;

export const GAME_SYSTEMS: Record<string, GameSystemConfig> = {
  dnd5e: {
    id: 'dnd5e',
    name: "Campaign: The Curse of Shadowfen",
    description: "A D&D 5e Gothic Horror. Uncover the secrets of a vanishing village.",
    instruction: DND_INSTRUCTION,
    introText: "The heavy iron gates of Raven's Hollow screech open. A thick, unnatural fog clings to your boots. The village ahead looks abandoned, windows dark like empty eye sockets. A crow caws somewhere in the mist. You are alone.",
    theme: {
      primary: 'violet-600',
      secondary: 'violet-400',
      bgImage: "https://images.unsplash.com/photo-1542256844-3b6966a9d59a?q=80&w=2525&auto=format&fit=crop",
      font: 'font-cinzel'
    },
    templates: [
      {
        name: "Aelthos (Rogue)",
        description: "A stealthy investigator seeking a lost artifact.",
        character: {
          system: 'dnd5e',
          name: "Aelthos",
          class: "Rogue",
          level: 3,
          hp: 24,
          maxHp: 24,
          ac: 14,
          stats: { Str: 10, Dex: 16, Con: 12, Int: 14, Wis: 10, Cha: 13 },
          skills: ["Stealth +5", "Perception +4", "Investigation +4"],
          spells: [],
          resources: [],
          inventory: [
            { id: '1', name: "Shortsword", description: "A keen blade of elven steel.", type: "weapon", effect: "1d6 Piercing", quantity: 1 },
            { id: '2', name: "Studded Leather", description: "Darkened leather for stealth.", type: "armor", effect: "AC 12+Dex", quantity: 1 },
            { id: '3', name: "Healing Potion", description: "A vial of red liquid.", type: "potion", effect: "Heals 2d4+2 HP", quantity: 2 }
          ],
        }
      },
      {
        name: "Valerius (Paladin)",
        description: "A holy warrior sent to purge the darkness.",
        character: {
          system: 'dnd5e',
          name: "Valerius",
          class: "Paladin",
          level: 3,
          hp: 28,
          maxHp: 28,
          ac: 16,
          stats: { Str: 16, Dex: 10, Con: 14, Int: 8, Wis: 12, Cha: 14 },
          skills: ["Athletics +5", "Religion +2"],
          spells: ["Divine Smite", "Lay on Hands"],
          resources: [
            { name: "Spell Slots", current: 3, max: 3, color: "bg-yellow-500" }
          ],
          inventory: [
             { id: '1', name: "Warhammer", description: "Engraved with holy runes.", type: "weapon", effect: "1d8 Bludgeoning", quantity: 1 },
             { id: '2', name: "Chain Mail", description: "Heavy protection.", type: "armor", effect: "AC 16", quantity: 1 },
             { id: '3', name: "Holy Water", description: "Burns the undead.", type: "misc", quantity: 2 }
          ],
        }
      }
    ]
  },
  vtm: {
    id: 'vtm',
    name: "Campaign: Neon Blood",
    description: "Vampire: The Masquerade. Political intrigue in modern Los Angeles.",
    instruction: VTM_INSTRUCTION,
    introText: "The bass of 'The Velveteen Room' vibrates in your chest. Red strobe lights cut through the cigarette smoke. You stand on the VIP balcony, looking down at the dancing vessels. The Prince is waiting for you in the back office. He does not look happy.",
    theme: {
      primary: 'red-900',
      secondary: 'red-600',
      bgImage: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=2574&auto=format&fit=crop",
      font: 'font-lato'
    },
    templates: [
      {
        name: "Darius (Brujah)",
        description: "An ex-MMA fighter turned immortal enforcer.",
        character: {
          system: 'vtm',
          name: "Darius",
          class: "Brujah",
          level: 1,
          hp: 10,
          maxHp: 10,
          stats: { Str: 4, Dex: 3, Sta: 3, Cha: 2, Man: 2, App: 2 },
          skills: ["Brawl 4", "Streetwise 3", "Intimidation 3"],
          spells: ["Potence", "Celerity"],
          resources: [
            { name: "Hunger", current: 1, max: 5, color: "bg-red-600" },
            { name: "Willpower", current: 5, max: 5, color: "bg-gray-400" }
          ],
          inventory: [
             { id: '1', name: "Brass Knuckles", description: "For when words fail.", type: "weapon", effect: "+1 DMG", quantity: 1 },
             { id: '2', name: "Smartphone", description: "Burner phone.", type: "misc", quantity: 1 }
          ],
        }
      }
    ]
  },
  isekai: {
    id: 'isekai',
    name: "Campaign: Tower of Ascension",
    description: "Reborn in a world of magic. Climb the tower to become a god.",
    instruction: ISEKAI_INSTRUCTION,
    introText: "Consciousness returns slowly. You are lying on a field of azure grass floating in the sky. Massive stone chains tether this island to a colossal tower that pierces the clouds. A blue window pops up in your vision: [WELCOME PLAYER. INITIATING TUTORIAL.]",
    theme: {
      primary: 'sky-500',
      secondary: 'sky-300',
      bgImage: "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=2670&auto=format&fit=crop",
      font: 'font-lato'
    },
    templates: [
      {
        name: "Kenji (Spellblade)",
        description: "Wields a sword and magic with a balanced build.",
        character: {
          system: 'isekai',
          name: "Kenji",
          class: "Spellblade",
          level: 1,
          hp: 100,
          maxHp: 100,
          stats: { Str: 12, Dex: 12, Vit: 12, Int: 10, Wis: 10, Luk: 50 },
          skills: ["Analysis", "Double Jump"],
          spells: ["Fireball", "Heal"],
          resources: [
            { name: "MP", current: 50, max: 50, color: "bg-sky-400" }
          ],
          inventory: [
             { id: '1', name: "Starter Sword", description: "Basic iron blade.", type: "weapon", effect: "10 DMG", quantity: 1 },
             { id: '2', name: "Health Potion", description: "Restores HP.", type: "potion", effect: "Heal 50 HP", quantity: 5 }
          ],
        }
      }
    ]
  }
};
