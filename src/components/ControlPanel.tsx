import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface ControlPanelProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isMuted, isVideoOff, onToggleMute, onToggleVideo, onEndCall }) => {
  return (
    <div className="bg-gray-900 p-4 flex justify-center items-center gap-4 fixed bottom-0 left-0 right-0">
      <button 
        onClick={onToggleMute}
        className={`p-3 rounded-full text-white transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      <button 
        onClick={onToggleVideo}
        className={`p-3 rounded-full text-white transition-colors ${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
      </button>
      <button 
        onClick={onEndCall}
        className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors">
        <PhoneOff size={24} />
      </button>
    </div>
  );
};

export default ControlPanel;
