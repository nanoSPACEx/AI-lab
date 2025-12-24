export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ArtConcept {
  theme: string;
  technique: string;
  material: string;
  description: string;
}

export enum AppMode {
  HOME = 'HOME',
  GENERATOR = 'GENERATOR',
  ANALYZER = 'ANALYZER',
  CHAT = 'CHAT'
}

export interface AnalysisResult {
  composition: string;
  color: string;
  technique: string;
  feedback: string;
}