import React, { useState, useEffect, useRef } from "react";

const DraggableCircle: React.FC = (width) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(width);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    //Handle position
    const newPosX = e.clientX;
    //Handle window width
    e.clientY;
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-20 bg-gray-200"
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute w-1 h-20 bg-blue-500 rounded-full cursor-pointer"
        style={{ left: `${start}px`, width: windowWidth }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default DraggableCircle;
