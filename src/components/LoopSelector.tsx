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
  const elementWidth = 10;
  const elementHeight = 20;

  const [startLoopPosition, setStartLoopPosition] =
    useState<number>(initialStartPosition);
  const [endLoopPosition, setEndLoopPosition] =
    useState<number>(initialEndPosition);

  const isDragging1 = useRef<boolean>(false);
  const isDragging2 = useRef<boolean>(false);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setEndLoopPosition(
        Math.min(initialEndPosition, containerWidth - elementWidth)
      );
      setEndPosition(
        Math.min(initialEndPosition, containerWidth - elementWidth)
      );
    }
  }, [initialEndPosition, containerRef]);

  useEffect(() => {
    setStartLoopPosition(initialStartPosition);
    setStartPosition(initialStartPosition);
  }, [initialStartPosition]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - containerRect.left;

      const distanceToStart = Math.abs(clickPosition - startLoopPosition);
      const distanceToEnd = Math.abs(clickPosition - endLoopPosition);

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

    newPosition = Math.max(0, newPosition);

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
      style={{
        width: `${width}`,
        height: `${height}`,
        position: "relative",
        backgroundColor: "rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: `${elementHeight / 2}px solid transparent`,
          borderBottom: `${elementHeight / 2}px solid transparent`,
          borderLeft: `${elementWidth}px solid blue`,
          left: `${startLoopPosition}px`,
          cursor: "pointer",
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: `${elementHeight / 2}px solid transparent`,
          borderBottom: `${elementHeight / 2}px solid transparent`,
          borderRight: `${elementWidth}px solid red`,
          left: `${endLoopPosition}px`,
          cursor: "pointer",
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default LoopSelector;
