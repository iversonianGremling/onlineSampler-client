// SampleEdit.tsx
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Waveform from "../Waveform";
import LoopSelector from "../LoopSelector";
import { Box, IconButton, Typography } from "@mui/material";
import { FaPlay, FaStop, FaRedo, FaPause } from "react-icons/fa";

interface SampleEditProps {
  filename: string;
}

const SampleEdit = ({ filename }: SampleEditProps) => {
  const [loopStart, setLoopStart] = useState<number>(0);
  const [loopEnd, setLoopEnd] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const baseURL = "http://localhost:3000";

  axios.defaults.baseURL = baseURL;

  useEffect(() => {
    fetchAudioFile();
  }, []);

  const fetchAudioFile = async () => {
    try {
      const response = await axios.get(`${baseURL}/audio/${filename}`);
      response.data.file;
      // Handle file load logic
    } catch (error) {
      console.error("Error fetching file: ", error);
    }
  };

  const handlePlayPause = () => {
    // Play/Pause logic
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "left", maxWidth: "80%" }}
      >
        {filename.toUpperCase()}
      </Typography>

      <Box
        sx={{
          position: "relative", // Ensures that LoopSelector can be positioned absolutely
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          height: "80%",
        }}
        ref={containerRef}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <Waveform
            waveformContainerRef={containerRef}
            fileUrl={`${baseURL}/audio/${filename}`}
            loopStartPosition={loopStart}
            loopEndPosition={loopEnd}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SampleEdit;
