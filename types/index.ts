
// Shared type definitions for the application
export enum AppTab {
  CHAT = 'chat',
  VIDEO = 'video',
  FLASH = 'flash',
  ANALYZE = 'analyze',
  LIVE = 'live',
  MAPS = 'maps',
  EXERCISES = 'exercises'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

export interface VideoGenerationStatus {
  status: 'idle' | 'generating' | 'polling' | 'completed' | 'error';
  progress?: string;
  videoUrl?: string;
  error?: string;
}

export type CognitiveSkillType = 
  | "working_memory"
  | "attention"
  | "emotion_regulation"
  | "logic"
  | "creativity"
  | "metacognition";

export type GameType = 'sequence' | 'matching' | 'odd_one_out' | 'pattern_completion' | 'emotional_matching';

export type BloomBrainActivity = {
  id: string;
  name: string;
  ageGroup: "4-6" | "7-9" | "10-12";
  primarySkill: CognitiveSkillType;
  researchBasis: string[];
  durationMinutes: number;
  difficultyLevel: number;
  adaptiveRule: string;
  aiTone: "gentle" | "encouraging" | "reflective";
  customInstructions?: string;
  gameData?: {
    type: GameType;
    items: string[];
    solution: number[];
  };
};
