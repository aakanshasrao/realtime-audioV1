import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from '@google/genai';
import { InterviewState, TranscriptionChunk } from '../types';

class GeminiService {
  private ai: GoogleGenAI;
  private session: LiveSession | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  }

  async connect(
    onStateChange: (state: InterviewState) => void,
    onTranscription: (chunk: TranscriptionChunk) => void,
    onAudio: (audio: Uint8Array) => void
  ): Promise<void> {
    onStateChange(InterviewState.CONNECTING);
    try {
      this.session = await this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            onStateChange(InterviewState.CONNECTED);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const audioData = message.serverContent.modelTurn.parts[0].inlineData.data;
              onAudio(this.base64ToUint8Array(audioData));
            }
            if (message.serverContent?.inputTranscription) {
              const { text, isFinal } = message.serverContent.inputTranscription;
              onTranscription({ text, isFinal });
            }
          },
          onerror: (error) => {
            console.error('Gemini session error:', error);
            onStateChange(InterviewState.ERROR);
          },
          onclose: () => {
            onStateChange(InterviewState.DISCONNECTED);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: 'You are an expert interviewer for a leading tech company.',
        },
      });
    } catch (error) {
      console.error('Failed to connect to Gemini:', error);
      onStateChange(InterviewState.ERROR);
    }
  }

  sendAudio(audio: Blob) {
    if (this.session) {
      this.session.sendRealtimeInput({ media: audio });
    }
  }

  sendVideo(videoFrame: Blob) {
    if (this.session) {
      this.session.sendRealtimeInput({ media: videoFrame });
    }
  }

  disconnect() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export const geminiService = new GeminiService();
