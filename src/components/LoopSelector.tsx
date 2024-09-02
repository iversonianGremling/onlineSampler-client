import React, { useState, useRef, useEffect } from "react";

interface AboutProps {
  initialStartPosition: number;
  initialEndPosition: number;
  setStartPosition: React.Dispatch<React.SetStateAction<number>>;
  setEndPosition: React.Dispatch<React.SetStateAction<number>>;
  width: string;
  height: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

const LoopSelector: React.FC<AboutProps> = ({
  initialStartPosition,
  initialEndPosition,
  setStartPosition,
  setEndPosition,
  height,
  width,
  containerRef,
}) => {
  const elementWidth = 10; // Width of the inner element
  const elementHeight = 20; // Height of the inner element

  const [startLoopPosition, setStartLoopPosition] =
    useState<number>(initialStartPosition);
  const [endLoopPosition, setEndLoopPosition] = useState<number>(0); // Initialized later based on container width

  const isDragging1 = useRef<boolean>(false);
  const isDragging2 = useRef<boolean>(false);

  // Set the initial position for endLoopPosition based on container width
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setEndLoopPosition(containerWidth - elementWidth); // Set the second div at the end of the container
    }
  }, []);

  // Update startLoopPosition when initialStartPosition prop changes
  useEffect(() => {
    setStartLoopPosition(initialStartPosition);
    setStartPosition(initialStartPosition);
  }, [initialStartPosition]);

  // Update endLoopPosition when initialEndPosition prop changes
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setEndLoopPosition(
        initialEndPosition <= containerWidth - elementWidth
          ? initialEndPosition
          : containerWidth - elementWidth
      );
      setEndPosition(
        initialEndPosition <= containerWidth - elementWidth
          ? initialEndPosition
          : containerWidth - elementWidth
      );
    }
  }, [initialEndPosition]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - containerRect.left;

      // Calculate distances to the start and end divs
      const distanceToStart = Math.abs(clickPosition - startLoopPosition);
      const distanceToEnd = Math.abs(clickPosition - endLoopPosition);

      // Determine which div is closer and start dragging it
      if (distanceToStart <= distanceToEnd) {
        isDragging1.current = true;
        moveStartDiv(clickPosition);
      } else {
        isDragging2.current = true;
        moveEndDiv(clickPosition);
      }
    }
  };

  const handleMouseUp = () => {
    isDragging1.current = false;
    isDragging2.current = false;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      if (isDragging1.current) {
        moveStartDiv(event.clientX - containerRect.left);
      }

      if (isDragging2.current) {
        moveEndDiv(event.clientX - containerRect.left);
      }
    }
  };

  const moveStartDiv = (position: number) => {
    let newPosition = position;

    if (newPosition > endLoopPosition - elementWidth) {
      newPosition = endLoopPosition - elementWidth;
    }

    if (newPosition < 0) newPosition = 0;

    setStartLoopPosition(newPosition);
    setStartPosition(newPosition);
  };

  const moveEndDiv = (position: number) => {
    let newPosition = position;

    if (newPosition < startLoopPosition + elementWidth) {
      newPosition = startLoopPosition + elementWidth;
    }

    const containerWidth = containerRef.current!.getBoundingClientRect().width;
    if (newPosition > containerWidth - elementWidth) {
      newPosition = containerWidth - elementWidth;
    }

    setEndLoopPosition(newPosition);
    setEndPosition(newPosition);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [endLoopPosition, startLoopPosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-32 bg-gray-200"
      style={{
        width: `${width}`,
        height: `${height}`,
        overflow: "hidden",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Start Div */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: `${elementHeight / 2}px solid transparent`,
          borderBottom: `${elementHeight / 2}px solid transparent`,
          borderLeft: `${elementWidth}px solid blue`,
          left: `${startLoopPosition}px`,
          cursor: "pointer",
        }}
      />

      {/* End Div */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: `${elementHeight / 2}px solid transparent`,
          borderBottom: `${elementHeight / 2}px solid transparent`,
          borderRight: `${elementWidth}px solid red`,
          left: `${endLoopPosition}px`,
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default LoopSelector;
