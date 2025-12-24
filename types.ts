export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: WebSource[];
}

export interface ArtConcept {
  theme: string;
  technique: string;
  material: string;
  description: string;
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface ArtConceptResult {
  concept: ArtConcept;
  sources: WebSource[];
}

export interface ChatResponse {
  text: string;
  sources: WebSource[];
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