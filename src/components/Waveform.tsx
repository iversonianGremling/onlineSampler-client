import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaRedo, FaStop } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { Button, IconButton, Slider, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface Props {
  fileUrl: string;
  loopStartPosition: number;
  loopEndPosition: number;
  waveformContainerRef: React.RefObject<HTMLDivElement>;
}

const KnobSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 6,
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: theme.palette.primary.main,
    border: "2px solid #fff",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    "&:hover": {
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    },
  },
  "& .MuiSlider-rail": {
    height: 6,
  },
}));

const DEFAULT_SPEED_VALUE = 50; // Default value for the speed knob

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
  const [speedValue, setSpeedValue] = useState(DEFAULT_SPEED_VALUE);

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
    if (waveformRef.current) {
      waveformRef.current.setPlaybackRate(
        Math.pow(4, Math.round(speedValue) / 50 - 1)
      );
    }
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
    // TODO: Implement save functionality
  };

  const handleSliderDoubleClick = () => {
    setSpeedValue(DEFAULT_SPEED_VALUE);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        ref={containerRef}
        sx={{ position: "relative", width: "100%", height: 100, mb: 2 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${loopStartPosition}px`,
            width: "2px",
            backgroundColor: "blue",
            height: "100%",
            zIndex: 10,
            maxWidth: "100%", // Bound by the waveform container width
            transform: `translateX(-1px)`, // Center the line
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${loopEndPosition}px`,
            width: "2px",
            backgroundColor: "red",
            height: "100%",
            zIndex: 10,
            maxWidth: "100%", // Bound by the waveform container width
            transform: `translateX(-1px)`, // Center the line
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "20%",
          mb: 2,
        }}
      >
        <Typography variant="caption" gutterBottom>
          Speed
        </Typography>
        <KnobSlider
          value={speedValue}
          min={0}
          max={100}
          onChange={(e, newValue) => setSpeedValue(newValue as number)}
          onDoubleClick={handleSliderDoubleClick}
          aria-label="Speed"
        />
        <Typography variant="caption">
          {Math.pow(4, Math.round(speedValue) / 50 - 1).toFixed(2)}x
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton
          color={isPlaying ? "error" : "primary"}
          onClick={handlePlayPause}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </IconButton>
        <IconButton onClick={handleStop}>
          <FaStop />
        </IconButton>
        <IconButton onClick={handleToggleLoop}>
          <FaRedo />
        </IconButton>
      </Box>

      <Typography variant="body1" gutterBottom>
        {fileUrl.split("/").pop()}
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => handleSave(fileUrl)}>
          Save
        </Button>
        <Button variant="contained" onClick={() => handleSave(fileUrl, true)}>
          Save Copy
        </Button>
        <Button variant="contained" onClick={() => handleDownload(fileUrl)}>
          Download
        </Button>
      </Box>
    </Box>
  );
};

export default Waveform;
