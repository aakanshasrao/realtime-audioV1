export enum InterviewState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
}

export interface TranscriptionChunk {
  text: string;
  isFinal: boolean;
}
