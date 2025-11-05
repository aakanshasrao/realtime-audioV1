import { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { InterviewState, TranscriptionChunk } from '../types';

export const useInterview = (isMuted: boolean, isVideoOff: boolean) => {
  const [interviewState, setInterviewState] = useState<InterviewState>(InterviewState.IDLE);
  const [transcription, setTranscription] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioQueue = useRef<Uint8Array[]>([]).current;
  const isPlaying = useRef(false);
  const setupComplete = useRef(false);

  useEffect(() => {
    const setup = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        mediaRecorderRef.current = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            geminiService.sendAudio(event.data);
          }
        };

        geminiService.connect(setInterviewState, handleTranscription, handleAudio);
        mediaRecorderRef.current.start(1000);

      } catch (error) {
        console.error('Error accessing media devices.', error);
        setInterviewState(InterviewState.ERROR);
      }
    };

        setup();
    setupComplete.current = true;

    return () => {
      mediaRecorderRef.current?.stop();
      geminiService.disconnect();
      audioContextRef.current?.close();
            stream?.getTracks().forEach(track => track.stop());
      setupComplete.current = false;
    };
  }, []);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
      stream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
    }
  }, [isMuted, isVideoOff, stream]);

  const handleTranscription = (chunk: TranscriptionChunk) => {
    setTranscription((prev) => prev + ' ' + chunk.text);
  };

  const handleAudio = (audio: Uint8Array) => {
    audioQueue.push(audio);
    if (!isPlaying.current) {
      playNextAudioChunk();
    }
  };

  const playNextAudioChunk = async () => {
    if (audioQueue.length > 0) {
      isPlaying.current = true;
      const audioData = audioQueue.shift();
      if (audioData && audioContextRef.current) {
        try {
          const audioBuffer = await audioContextRef.current.decodeAudioData(audioData.buffer);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.onended = playNextAudioChunk;
          source.start();
        } catch (error) {
          console.error('Error decoding audio data', error);
          isPlaying.current = false;
          playNextAudioChunk(); // Try next chunk
        }
      } else {
        isPlaying.current = false;
      }
    } else {
      isPlaying.current = false;
    }
  };

  return { interviewState, transcription, stream };
};
