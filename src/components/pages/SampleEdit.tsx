import { FaPlay, FaStop, FaRedo } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import LoopSelector from "../LoopSelector";
import WindowSelector from "../WindowSelector";

const SampleEdit = () => {
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

  useEffect(() => {
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
  }, [speedValue, pitchValue, windowPosition, windowWidth]);

  // Calculate the rotation based on the value
  const calculateRotation = (value: number) => {
    return (value / 100) * 180 - 135; // Rotates from 225° (7:30) to 135° (5:30)
  };

  const getWindowLimits = ([start, end]: number[]) => {
    setWindowLimits([start, end]);
  };

  return (
    <div className="flex justify-left items-top h-screen w-screen">
      <div className="flex flex-col items-center">
        <div className="w-full h-full">
          <div>
            <div className="relative w-full h-8">
              <WindowSelector
                onPositionChange={getWindowLimits}
                start={windowStart}
                end={windowEnd}
              />
            </div>
            <div className="relative w-full h-8">
              <LoopSelector
                startPosition={0}
                endPosition={100}
                width={"100%"}
                height={"100%"}
              />
            </div>

            <img src="http://placehold.it/800x300" alt="placeholder"></img>
          </div>
          <div className="flex flex-row p-2">
            <button className="mx-2 hover:opacity-50 rounded-full m-2 -mt-12">
              <FaPlay className="text-lg" />
            </button>
            <button className="hover:opacity-50 rounded-full m-2 -mt-12">
              <FaStop className="text-lg" />
            </button>
            <button className="hover:opacity-50 rounded-full m-2 -mt-12">
              <FaRedo className="text-lg" />
            </button>
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
                <span className="text-xs">{Math.round(speedValue)}% Speed</span>
              </div>
            </div>
            <div className="mx-2 flex flex-col items-center">
              <div
                ref={pitchKnobRef}
                className="w-10 h-10  bg-gray-300 relative rounded-full"
                style={{
                  transform: `rotate(${calculateRotation(pitchValue)}deg)`,
                }}
              >
                <div className="absolute top-0 left-1/2 transform  w-1 h-4 bg-gray-800 -translate-x-1/3" />
              </div>
              <span className="text-xs">{Math.round(pitchValue)}% Pitch</span>
            </div>
            <div className="flex flex-col">
              <p>Sample Name</p>
              <div className="flex m-2">
                <button className="bg-gray-200 hover:bg-gray-400 rounded-full p-2 m-3">
                  Save
                </button>
                <button className="bg-gray-200 hover:bg-gray-400 rounded-full p-2 m-3">
                  Save Copy
                </button>
                <button className="bg-gray-200 hover:bg-gray-400 rounded-full p-2 m-3">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleEdit;
