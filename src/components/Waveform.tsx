import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaRedo, FaSquare } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";

interface Props {
  fileUrl: string;
  loopStartPosition: number;
  loopEndPosition: number;
  waveformContainerRef: React.RefObject<HTMLDivElement>;
}

const Waveform: React.FC<Props> = ({
  fileUrl,
  loopStartPosition,
  loopEndPosition,
  waveformContainerRef,
}) => {
  const waveformRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(100);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(100);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [speedValue, setSpeedValue] = useState(50);

  const speedKnobRef = useRef<HTMLDivElement | null>(null);

  //TODO: Add missing features
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

      const speedKnobElement = speedKnobRef.current;

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
    if (waveformRef.current) {
      waveformRef.current.setPlaybackRate(
        Math.pow(4, Math.round(speedValue) / 50 - 1)
      );
    }
  }, [speedValue]);

  useEffect(() => {
    const speedKnobElement = speedKnobRef.current;

    const handleKnobDrag = (
      event: MouseEvent,
      knobRef: React.RefObject<HTMLDivElement>,
      value: number,
      setValue: React.Dispatch<React.SetStateAction<number>>
    ) => {
      if (!knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const deltaY = rect.top + rect.height / 2 - event.clientY;
      const newValue = Math.max(0, Math.min(100, value + deltaY * 0.2));
      setValue(newValue);
    };

    const handleMouseClickKnob =
      (
        knobRef: React.RefObject<HTMLDivElement>,
        value: number,
        setValue: React.Dispatch<React.SetStateAction<number>>
      ) =>
      (event: MouseEvent) => {
        event.preventDefault();
        const onMouseMove = (e: MouseEvent) =>
          handleKnobDrag(e, knobRef, value, setValue);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", onMouseMove);
          },
          { once: true }
        );
      };

    if (speedKnobElement) {
      speedKnobElement.addEventListener(
        "mousedown",
        handleMouseClickKnob(speedKnobRef, speedValue, setSpeedValue)
      );
    }

    return () => {
      if (speedKnobElement) {
        speedKnobElement.removeEventListener(
          "mousedown",
          handleMouseClickKnob(speedKnobRef, speedValue, setSpeedValue)
        );
      }
    };
  }, [speedValue]);

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
        setCurrentAudioTime(waveformRef.current.getCurrentTime());
        waveformRef.current.pause();
        setIsPlaying(false);
      } else {
        waveformRef.current.seekTo(
          Math.max(startPoint, loopStart) / waveformRef.current.getDuration()
        );
        waveformRef.current.setTime(currentAudioTime);
        waveformRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (waveformRef.current) {
      setCurrentAudioTime(0);
      waveformRef.current.seekTo(0);
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

  const calculateRotation = (value: number) => {
    return ((value / 100) * 180 - 90) * 1.45;
  };

  const handleDownload = (url: string) => {
    axios({
      url: url,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", url.split("/").pop() || "audio");
      document.body.appendChild(link);
      link.click();
    });
  };

  const handleSave = (url: string, copy = false) => {
    //TODO
    // if (copy) {
    //   navigator.clipboard.writeText(url);
    // } else {
    //   handleDownload(url);
    // }
  };

  return (
    <div>
      <div ref={containerRef} style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${loopStartPosition}%`,
            width: "2px",
            backgroundColor: "blue",
            height: "100%",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${loopEndPosition}%`,
            width: "2px",
            backgroundColor: "red",
            height: "100%",
            zIndex: 10,
          }}
        />
      </div>

      <div className="flex items-center">
        {isPlaying ? (
          <FaPause className="text-xl m-2" onClick={handlePlayPause} />
        ) : (
          <FaPlay className="text-xl m-2" onClick={handlePlayPause} />
        )}
        <FaSquare className="text-xl m-2" onClick={handleStop} />
        <FaRedo className="text-xl m-2" onClick={handleToggleLoop} />
        <div className="mx-2 flex flex-col items-center">
          <div className="mx-2 flex flex-col items-center">
            <div
              ref={speedKnobRef}
              className="w-10 h-10  bg-gray-300 relative rounded-full"
              style={{
                transform: `rotate(${calculateRotation(speedValue)}deg)`,
              }}
            >
              <div className="absolute top-0 left-1/2 transform  w-1 h-4 bg-gray-800 -translate-x-1/3" />
            </div>
            <span className="text-xs">
              {Math.pow(4, Math.round(speedValue) / 50 - 1).toFixed(2)}% Speed
            </span>
          </div>
        </div>
        <div>{fileUrl.split("/").pop()}</div>
        <div className="flex flex-row p-2">
          <div className="flex flex-col">
            <div className="flex m-2">
              <button
                className="bg-gray-200 hover:bg-gray-400 rounded-full p-2 m-3"
                onClick={() => handleSave(fileUrl)}
              >
                Save
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-400 rounded-full p-2 m-3"
                onClick={() => handleSave(fileUrl, true)}
              >
                Save Copy
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-400 rounded-full p-2 m-3"
                onClick={() => handleDownload(fileUrl)}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add inputs or sliders to set loop start and end */}
    </div>
  );
};

export default Waveform;
