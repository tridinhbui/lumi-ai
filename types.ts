export enum Sender {
  USER = 'user',
  BOT = 'bot'
}

export enum MessageType {
  TEXT = 'text',
  EXHIBIT_1 = 'exhibit_1',
  EXHIBIT_2 = 'exhibit_2',
  SCORE = 'score'
}

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string;
  timestamp: number;
}

export interface ChartDataPoint {
  category: string;
  value: number;
  value2?: number;
}

export type CaseStage = 'intro' | 'structure' | 'quant' | 'interpretation' | 'synthesis';

export interface CaseState {
  stage: CaseStage;
  messages: Message[];
  isLoading: boolean;
}

export interface DashboardProps {
  currentStage: CaseStage;
  currentFeedback: string;
  feedbackStatus: 'neutral' | 'positive' | 'attention';
}
