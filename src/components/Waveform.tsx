import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaRedo, FaRunning, FaStop } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { Button, IconButton, Slider, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface Props {
  fileUrl: string;
  waveformContainerRef: React.RefObject<HTMLDivElement>;
}

const MultiSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 6,
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: theme.palette.primary.main,
    // border: "2px solid #fff",
    // boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    // "&:hover": {
    //   boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    // },
  },
  "& .MuiSlider-rail": {
    display: "none",
  },
  "& .MuiSlider-track": {
    display: "none",
  },
}));

const KnobSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 6,
  "& .MuiSlider-thumb": {
    height: 15,
    width: 15,
    backgroundColor: theme.palette.primary.main,
    margin: 2,
    // border: "2px solid #fff",
    // boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    // "&:hover": {
    //   boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    // },
  },
}));

const DEFAULT_SPEED_VALUE = 50; // Default value for the speed knob

const Waveform: React.FC<Props> = ({ fileUrl, waveformContainerRef }) => {
  const waveformRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopStartPosition, setLoopStartPosition] = useState(0);
  const [loopEndPosition, setLoopEndPosition] = useState(100);
  const [loopDuration, setLoopDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(100);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [speedValue, setSpeedValue] = useState(DEFAULT_SPEED_VALUE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sliderPositions, setSliderPositions] = useState<[number, number]>([
    loopStartPosition,
    loopEndPosition,
  ]);

  useEffect(() => {
    if (containerRef.current) {
      waveformRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#f2f2f2",
        progressColor: "#4353FF",
        barWidth: 3,
        height: 100,
      });

      waveformRef.current.load(fileUrl);

      waveformRef.current.on("ready", () => {
        setIsLoaded(true);
      });

      return () => {
        waveformRef.current?.destroy();
      };
    }
  }, [fileUrl]);

  useEffect(() => {
    const handleAudioProcess = () => {
      if (isLooping && isLoaded && waveformRef.current) {
        if (
          waveformRef.current.getCurrentTime() >=
          (loopEndPosition / 100) * waveformRef.current.getDuration()
        ) {
          waveformRef.current.seekTo(loopStartPosition / 100);
        }
      }
    };

    const handleFinish = () => {
      if (!isLooping && waveformRef.current) {
        setIsPlaying(false);
        waveformRef.current.seekTo(0);
      }
    };

    waveformRef.current?.on("audioprocess", handleAudioProcess);
    waveformRef.current?.on("finish", handleFinish);

    return () => {
      waveformRef.current?.un("audioprocess", handleAudioProcess);
      waveformRef.current?.un("finish", handleFinish);
    };
  }, [isLooping, loopStartPosition, loopEndPosition, isLoaded]);

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

  useEffect(() => {
    setLoopStartPosition(sliderPositions[0]);
    setLoopEndPosition(sliderPositions[1]);
  }, [sliderPositions]);

  const handlePlayPause = () => {
    if (waveformRef.current) {
      if (isPlaying) {
        setCurrentAudioTime(waveformRef.current.getCurrentTime());
        waveformRef.current.pause();
        setIsPlaying(false);
      } else {
        waveformRef.current.setTime(
          Math.max(
            currentAudioTime / waveformRef.current.getDuration(),
            (loopStartPosition / 100) * waveformRef.current.getDuration()
          )
        );
        // waveformRef.current.setTime(currentAudioTime);
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

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [start, end] = newValue;
      if (start >= end) return; // Prevent overlap
      setSliderPositions(newValue as [number, number]);
    }
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

  const handleLoopingClick = () => {
    if (!isLooping) {
      waveformRef.current?.setTime(loopStartPosition);
    }
    setIsLooping(!isLooping);
  };

  return (
    <div>
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
          sx={{
            position: "relative",
            width: "100%",
            height: 100,
            mb: 2,
            // boxShadow: 3,
          }}
        >
          {/* Vertical line representing loop start */}
          <Box
            sx={{
              display: `${isLooping ? "block" : "none"}`,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${loopStartPosition}%`,
              width: "2px",
              backgroundColor: "black",
              height: "100%",
              zIndex: 10,
              transform: `translateX(-1px)`, // Center the line
            }}
          />
          {/* Vertical line representing loop end */}
          <Box
            sx={{
              display: `${isLooping ? "block" : "none"}`,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${loopEndPosition}%`,
              width: "2px",
              backgroundColor: "grey",
              height: "100%",
              zIndex: 10,
              transform: `translateX(-1px)`, // Center the line
            }}
          />
          <Box
            sx={{
              display: `${isLooping ? "block" : "none"}`,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `0%`,
              width: `${sliderPositions[0]}%`,
              backgroundColor: "rgba(40, 40, 40, 0.1)", // Transparent blue
              height: "100%",
              zIndex: 5,
            }}
          />
          <Box
            sx={{
              display: `${isLooping ? "block" : "none"}`,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sliderPositions[1]}%`,
              width: `${100 - sliderPositions[1]}%`,
              backgroundColor: "rgba(40, 40, 40, 0.1)", // Transparent blue
              height: "100%",
              zIndex: 5,
            }}
          />
          {/* Dual slider for loop start/end */}
          <Slider
            value={[loopStartPosition, loopEndPosition]}
            onChange={handleSliderChange}
            step={0.1} // Add this line for more granular control
            aria-labelledby="range-slider"
            sx={{
              display: `${isLooping ? "block" : "none"}`,
              position: "absolute",
              top: 36,
              left: 0,
              width: "100%",
              zIndex: 15,
              pointerEvents: "auto",
              backgroundColor: "transparent",
              color: "transparent",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              paddingRight: 2,
              paddingLeft: 2,
            }}
          >
            <IconButton
              color={isPlaying ? "error" : "primary"}
              onClick={handlePlayPause}
              size="medium"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </IconButton>
            <IconButton color="error" onClick={handleStop} size="medium">
              <FaStop />
            </IconButton>
            <IconButton
              color={!isLooping ? "primary" : "secondary"}
              onClick={() => handleLoopingClick()}
              size="medium"
            >
              <FaRedo />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              // mb: 2,
            }}
          >
            {/* <Typography variant="caption" gutterBottom>
              Speed
            </Typography> */}
            <KnobSlider
              style={{ color: "blue" }}
              value={speedValue}
              min={0}
              max={100}
              onChange={(e, newValue) => setSpeedValue(newValue as number)}
              onDoubleClick={handleSliderDoubleClick}
              aria-label="Speed"
            />
            <FaRunning size={21} />
            {/* <Typography variant="caption">
              {Math.pow(4, Math.round(speedValue) / 50 - 1).toFixed(2)}x
            </Typography> */}
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {/*          <Button variant="contained" onClick={() => handleSave(fileUrl)}>
            Save
          </Button>
          <Button variant="contained" onClick={() => handleSave(fileUrl, true)}>
            Save Copy
          </Button>
*/}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Waveform;
