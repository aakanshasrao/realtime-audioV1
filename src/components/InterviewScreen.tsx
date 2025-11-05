import React, { useEffect, useRef } from 'react';
import { useInterview } from '../hooks/useInterview';
import { InterviewState } from '../types';

interface InterviewScreenProps {
  isMuted: boolean;
  isVideoOff: boolean;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ isMuted, isVideoOff }) => {
  const { interviewState, transcription, stream } = useInterview(isMuted, isVideoOff);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {InterviewState[interviewState]}
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Transcription</h2>
          <div className="h-40 bg-gray-900 rounded-md p-4 overflow-y-auto text-gray-300">
            <p>{transcription || 'Welcome to your interview with Talent AI.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;
