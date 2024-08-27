import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface Props {
  fileUrl: string;
}

const Waveform: React.FC<Props> = ({ fileUrl }) => {
  const waveformRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(100);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(100);

  //TODO: Add missing features
  // https://wavesurfer.xyz/example/zoom/
  useEffect(() => {
    if (containerRef.current) {
      waveformRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#D9DCFF",
        progressColor: "#4353FF",
        barWidth: 3,
        height: 100,
      });

      waveformRef.current.load(fileUrl);

      const handleAudioProcess = () => {
        if (isLooping && waveformRef.current) {
          if (
            waveformRef.current.getCurrentTime() >=
            (loopEnd / 100) * waveformRef.current.getDuration() - 0.01
          ) {
            waveformRef.current.seekTo(
              loopStart / waveformRef.current.getDuration()
            );
          }
        } else if (waveformRef.current) {
          if (
            waveformRef.current.getCurrentTime() >=
            (endPoint / 100) * waveformRef.current.getDuration()
          ) {
            waveformRef.current.pause();
            setIsPlaying(false);
          }
        }
      };

      waveformRef.current.on("audioprocess", handleAudioProcess);

      return () => {
        waveformRef.current?.un("audioprocess", handleAudioProcess);
        waveformRef.current?.destroy();
      };
    }
  }, [fileUrl, isLooping, loopStart, loopEnd, endPoint]);

  useEffect(() => {
    if (waveformRef.current && containerRef.current) {
      const duration = waveformRef.current.getDuration();
      const start = (startPoint / 100) * duration;
      const end = (endPoint / 100) * duration;
      const pixelsPerSecond = containerRef.current.offsetWidth / duration;
      const minPx = start * pixelsPerSecond;

      containerRef.current.scrollLeft = minPx;
    }
  }, [startPoint, endPoint]);

  const handlePlayPause = () => {
    if (waveformRef.current) {
      if (isPlaying) {
        waveformRef.current.pause();
      } else {
        waveformRef.current.seekTo(
          Math.max(startPoint, loopStart) / waveformRef.current.getDuration()
        );
        waveformRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (waveformRef.current) {
      waveformRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handleSetLoopStart = (start: number) => {
    setLoopStart(start);
  };

  const handleSetLoopEnd = (end: number) => {
    setLoopEnd(end);
  };

  const handleToggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const handleSetPlaybackRate = (rate: number) => {
    if (waveformRef.current) {
      waveformRef.current.setPlaybackRate(rate);
    }
    setPlaybackRate(rate);
  };

  const handleSetStartPoint = (start: number) => {
    setStartPoint(Math.min(start, loopStart));
  };

  const handleSetEndPoint = (end: number) => {
    setEndPoint(Math.max(end, loopEnd));
  };

  return (
    <div>
      <div ref={containerRef} />
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleToggleLoop}>Toggle Loop</button>
      <button onClick={() => handleSetPlaybackRate(playbackRate * 2)}>
        Double Speed
      </button>
      {/* Add inputs or sliders to set loop start and end */}
    </div>
  );
};

export default Waveform;
