// src/components/FileUpload.tsx
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload: React.FC = (style) => {
  const onDrop = (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("mp3", file);
    });

    axios
      .post("http://localhost:3000/audio", formData)
      .then(() => alert("File uploaded successfully"))
      .catch((error) => alert(`Error uploading file: ${error.message}`));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        ...style,
        border: "2px dashed #cccccc",
        padding: "3rem",
        cursor: "pointer",
        margin: "20px auto",
      }}
    >
      <input {...getInputProps()} />
      <p>Drag or click to upload samples</p>
    </div>
  );
};

export default FileUpload;
