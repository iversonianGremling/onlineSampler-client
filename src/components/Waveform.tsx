// src/components/Waveform.tsx
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface Props {
  fileUrl: string;
}

const Waveform: React.FC<Props> = ({ fileUrl }) => {
  const waveformRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      waveformRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#D9DCFF",
        progressColor: "#4353FF",
        barWidth: 3,
        height: 100,
        // responsive: true,
      });

      waveformRef.current.load(fileUrl);

      return () => waveformRef.current?.destroy();
    }
  }, [fileUrl]);

  return <div ref={containerRef} />;
};

export default Waveform;
