import React, { useState, useRef, useEffect } from "react";

interface AboutProps {
  startPosition: number;
  endPosition: number;
  width: string;
  height: string;
}

const LoopSelector: React.FC<AboutProps> = ({
  startPosition,
  endPosition,
  height,
  width,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const elementWidth = 50; // Width of the inner element
  const elementHeight = 130; // Height of the inner element

  const [position1, setPosition1] = useState<number>(startPosition);
  const [position2, setPosition2] = useState<number>(0); // Initialized later based on container width

  const isDragging1 = useRef<boolean>(false);
  const isDragging2 = useRef<boolean>(false);

  // Set the initial position for position2 based on container width
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setPosition2(containerWidth - elementWidth); // Set the second div at the end of the container
    }
  }, []);

  // Update position1 when startPosition prop changes
  useEffect(() => {
    setPosition1(startPosition);
  }, [startPosition]);

  // Update position2 when endPosition prop changes
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setPosition2(
        endPosition <= containerWidth - elementWidth
          ? endPosition
          : containerWidth - elementWidth
      );
    }
  }, [endPosition]);

  const handleMouseDown = (index: number) => {
    if (index === 1) {
      isDragging1.current = true;
    } else {
      isDragging2.current = true;
    }
  };

  const handleMouseUp = () => {
    isDragging1.current = false;
    isDragging2.current = false;
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      if (isDragging1.current) {
        let newPosition1 = event.clientX - containerRect.left;

        // Prevent the first div from passing through the second div
        if (newPosition1 > position2 - elementWidth) {
          newPosition1 = position2 - elementWidth;
        }

        if (newPosition1 < 0) newPosition1 = 0;

        setPosition1(newPosition1);
      }

      if (isDragging2.current) {
        let newPosition2 = event.clientX - containerRect.left;

        // Prevent the second div from being passed through by the first div
        if (newPosition2 < position1 + elementWidth) {
          newPosition2 = position1 + elementWidth;
        }

        if (newPosition2 > containerRect.width - elementWidth) {
          newPosition2 = containerRect.width - elementWidth;
        }

        setPosition2(newPosition2);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-32 bg-gray-200"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: `${width}`,
        height: `${height}`,
        overflow: "hidden",
      }}
    >
      {/* First Div */}
      <div
        className="absolute top-1/2 -translate-y-1/2 bg-blue-500"
        style={{
          width: `${elementWidth}px`,
          height: `${elementHeight}px`,
          left: `${position1}px`,
          cursor: "pointer",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleMouseDown(1);
        }}
      ></div>

      {/* Second Div */}
      <div
        className="absolute top-1/2 -translate-y-1/2 bg-red-500"
        style={{
          width: `${elementWidth}px`,
          height: `${elementHeight}px`,
          left: `${position2}px`,
          cursor: "pointer",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleMouseDown(2);
        }}
      ></div>
    </div>
  );
};

export default LoopSelector;
