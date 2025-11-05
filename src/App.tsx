/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import InterviewScreen from './components/InterviewScreen';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleToggleVideo = () => {
    setIsVideoOff((prev) => !prev);
  };

  const handleEndCall = () => {
    // Logic to end the call will be implemented here
    console.log('Ending call...');
    window.location.reload(); // Simple way to reset the app state
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      <Header />
      <main className="flex-grow">
        <InterviewScreen isMuted={isMuted} isVideoOff={isVideoOff} />
      </main>
      <ControlPanel 
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onEndCall={handleEndCall}
      />
    </div>
  );
}
