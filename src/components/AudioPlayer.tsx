// src/components/AudioPlayer.tsx
import React, { useRef } from "react";

interface Props {
  fileUrl: string;
}

const AudioPlayer: React.FC<Props> = ({ fileUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div>
      <audio controls ref={audioRef}>
        <source src={fileUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
