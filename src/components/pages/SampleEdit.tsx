import { FaPlay, FaStop, FaRedo, FaPause } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import Waveform from "../Waveform";
import LoopSelector from "../LoopSelector";
import WindowSelector from "../WindowSelector";
import axios from "axios";

interface SampleEditProps {
  filename: string;
}

const SampleEdit = ({ filename }: SampleEditProps) => {
  const [speedValue, setSpeedValue] = useState<number>(50);
  const [pitchValue, setPitchValue] = useState<number>(50);
  const [windowPosition, setWindowPosition] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(100);
  const [windowLimits, setWindowLimits] = useState<number[]>([0, 100]);
  const [windowStart, setWindowStart] = useState<number>(0);
  const [windowEnd, setWindowEnd] = useState<number>(100);
  const speedKnobRef = useRef<HTMLDivElement | null>(null);
  const pitchKnobRef = useRef<HTMLDivElement | null>(null);
  const sampleSliceRef = useRef<HTMLDivElement | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const loopSelectorContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const [currentAudioTime, setCurrentAudioTime] = useState<number>(0);
  const [loopStart, setLoopStart] = useState<number>(0);
  const [loopEnd, setLoopEnd] = useState<number>(100);
  filename = "Loopazon.mp3";

  const loopSelectorRef = useRef<HTMLDivElement>(null);

  const baseURL = "http://localhost:3000";
  axios.defaults.baseURL = baseURL;

  useEffect(() => {
    fetchAudioFile();
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

    const handleWindowDrag = (
      event: MouseEvent,
      sliceRef: React.RefObject<HTMLDivElement>
    ) => {
      if (!sliceRef.current) return;

      const rect = sliceRef.current.getBoundingClientRect();
      const deltaX = event.clientX - rect.left;
      const deltaY = rect.top + rect.height / 2 - event.clientY;

      setWindowWidth((prevWidth) => Math.max(0, prevWidth - deltaY * 0.2));
      setWindowPosition((prevPosition) => prevPosition + deltaX * 0.2);
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

    const handleMouseClickSlice =
      (sliceRef: React.RefObject<HTMLDivElement>) => (event: MouseEvent) => {
        event.preventDefault();
        const onMouseMove = (e: MouseEvent) => handleWindowDrag(e, sliceRef);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", onMouseMove);
          },
          { once: true }
        );
      };

    const speedKnobElement = speedKnobRef.current;
    const pitchKnobElement = pitchKnobRef.current;
    const sampleSliceElement = sampleSliceRef.current;

    if (speedKnobElement) {
      speedKnobElement.addEventListener(
        "mousedown",
        handleMouseClickKnob(speedKnobRef, speedValue, setSpeedValue)
      );
    }
    if (pitchKnobElement) {
      pitchKnobElement.addEventListener(
        "mousedown",
        handleMouseClickKnob(pitchKnobRef, pitchValue, setPitchValue)
      );
    }
    if (sampleSliceElement) {
      sampleSliceElement.addEventListener(
        "mousedown",
        handleMouseClickSlice(sampleSliceRef)
      );
    }

    return () => {
      if (speedKnobElement) {
        speedKnobElement.removeEventListener(
          "mousedown",
          handleMouseClickKnob(speedKnobRef, speedValue, setSpeedValue)
        );
      }
      if (pitchKnobElement) {
        pitchKnobElement.removeEventListener(
          "mousedown",
          handleMouseClickKnob(pitchKnobRef, pitchValue, setPitchValue)
        );
      }
      if (sampleSliceElement) {
        sampleSliceElement.removeEventListener(
          "mousedown",
          handleMouseClickSlice(sampleSliceRef)
        );
      }
    };
  }, [speedValue, pitchValue, windowPosition, windowWidth, audioFile]);

  const fetchAudioFile = async () => {
    try {
      const response = await axios.get(`${baseURL}/audio/${filename}`);
      setAudioFile(response.data.file);
    } catch (error) {
      console.error("Error fetching file: ", error);
    }
  };

  const handlePlayPause = (filename: string) => {
    console.log("Trying to play/pause");
    if (audioRef.current) {
      if (
        isPlaying &&
        audioRef.current.src === `${baseURL}/audio/${filename}`
      ) {
        setCurrentAudioTime(audioRef.current.currentTime);
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = `${baseURL}/audio/${filename}`;
        audioRef.current.currentTime = currentAudioTime;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      console.log("No audio ref");
    }
  };

  // Calculate the rotation based on the value
  const calculateRotation = (value: number) => {
    return ((value / 100) * 180 - 90) * 1.45; // Rotates from 225° (7:30) to 135° (5:30)
  };

  const getWindowLimits = ([start, end]: number[]) => {
    setWindowLimits([start, end]);
  };

  return (
    <div className="flex justify-center items-top h-screen w-screen">
      <div
        className="flex flex-col items-center "
        style={{ width: "80%", height: "80%" }}
      >
        <div className="w-full h-5">
          <div className="flex flex-col w-6/12">
            <div className="relative w-full h-5" ref={loopSelectorContainerRef}>
              <LoopSelector
                containerRef={loopSelectorRef}
                initialStartPosition={loopStart}
                initialEndPosition={loopEnd}
                setStartPosition={setLoopStart}
                setEndPosition={setLoopEnd}
                width={"100%"}
                height={"100%"}
              />
            </div>

            <div className="relative w-full ">
              {
                <Waveform
                  waveformContainerRef={waveformRef}
                  fileUrl={`${baseURL}/audio/${filename}`}
                  loopStartPosition={loopStart}
                  loopEndPosition={loopEnd + 9 - 0.5}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleEdit;
