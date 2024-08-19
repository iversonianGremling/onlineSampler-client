// WindowSelector.tsx
import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from "react";

interface WindowSelectorProps {
  onPositionChange: (position: number[]) => void;
  start: number;
  end: number;
}

const WindowSelector: React.FC<WindowSelectorProps> = ({
  onPositionChange,
  start,
  end,
}) => {
  const [windowWidth, setWindowWidth] = useState(300); // Initial width of the window
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const startWidth = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (windowRef.current) {
      const windowRect = windowRef.current.getBoundingClientRect();
      onPositionChange([windowRect.left, windowRect.right]);
    }
  }, []);

  useEffect(() => {}, [windowWidth]);

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
    if (windowRef.current) {
      startWidth.current = windowRef.current.offsetWidth;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const container = containerRef.current;
    const windowElement = windowRef.current;

    if (!container || !windowElement) return;

    const deltaY = e.clientY - startY.current;
    const newWidth = Math.max(0, startWidth.current + deltaY);
    const maxWidth = container.offsetWidth;
    const clampedWidth = Math.min(newWidth, maxWidth);

    const containerRect = container.getBoundingClientRect();
    const windowElementWidth = windowElement.offsetWidth;
    const newLeft = Math.max(
      containerRect.left,
      Math.min(
        containerRect.right - windowElementWidth,
        e.clientX - windowElementWidth / 2
      )
    );

    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      setWindowWidth(clampedWidth);
      windowElement.style.left = `${newLeft - containerRect.left}px`;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const onMouseMove = (e: Event) => handleMouseMove(e as MouseEvent);
    const onMouseUp = () => handleMouseUp();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-200 w-full border border-gray-400"
      style={{ height: "100%" }} // Ensure the container takes full height of its parent
    >
      <div
        ref={windowRef}
        className="absolute bg-blue-500 h-full" // Make sure it takes the full height
        style={{
          width: `${windowWidth}px`,
          transition: "none",
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          className="absolute inset-0 cursor-pointer"
          style={{ zIndex: 1 }}
        />
      </div>
    </div>
  );
};

export default WindowSelector;
