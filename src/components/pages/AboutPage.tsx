import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface AudioFile {
  file: string;
  metadata?: any;
}

const About: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<Array<AudioFile>>();
  const [selectedFile, setSelectedFile] = useState<AudioFile>();
  const [newMetadata, setNewMetadata] = useState<any>({});
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const baseURL = "http://localhost:3000";
  axios.defaults.baseURL = baseURL;

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      const response = await axios.get("/audio");
      setAudioFiles(response.data.map((file: AudioFile) => file));
    } catch (error) {
      console.error("Error fetching audio files:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append("mp3", fileToUpload);

    try {
      await axios.post("/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchAudioFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const fetchMetadata = async (filename: string) => {
    try {
      const response = await axios.get(`/audio/${filename}/metadata`);
      const updatedFiles = audioFiles
        ? audioFiles.map((file: AudioFile) =>
            file.file === filename ? { ...file, metadata: response.data } : file
          )
        : [];
      setAudioFiles(updatedFiles);
      setSelectedFile({ file: filename, metadata: response.data });
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const handleMetadataChange = (key: string, value: string) => {
    setNewMetadata({ ...newMetadata, [key]: value });
  };

  const handleMetadataUpdate = async () => {
    console.log("Updating with this metadata: ", newMetadata);
    if (!selectedFile) return;

    try {
      await axios.put(`/audio/${selectedFile.file}/metadata`, newMetadata);
      fetchMetadata(selectedFile.file);
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      await axios.delete(`/audio/${filename}`);
      fetchAudioFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleReplace = async () => {
    if (!selectedFile || !editedFile) return;

    const formData = new FormData();
    formData.append("mp3", editedFile);
    formData.append("originalFilePath", selectedFile.file);

    try {
      await axios.post("/audio/replace", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchAudioFiles();
    } catch (error) {
      console.error("Error replacing file:", error);
    }
  };

  const handlePlayPause = (filename: string) => {
    if (audioRef.current) {
      if (
        isPlaying &&
        audioRef.current.src === `${baseURL}/audio/${filename}`
      ) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = `${baseURL}/audio/${filename}`;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  console.log("Files: ", audioFiles);
  console.log(
    "Selected File: ",
    audioFiles?.map((file) => file)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Audio File Manager</h1>

        {/* Upload New File */}
        <div className="mb-4">
          <h2 className="text-xl mb-2">Upload New Audio File</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              e.target.files ? setFileToUpload(e.target.files[0]) : null
            }
            className="mb-2"
          />
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Upload
          </button>
        </div>

        {/* List of Files */}
        <div className="mb-4">
          <h2 className="text-xl mb-2">Audio Files</h2>
          <ul className="list-disc pl-5">
            {audioFiles
              ? audioFiles.map((file) => (
                  <li key={file.file} className="mb-2">
                    <span>{file.file}</span>
                    <button
                      onClick={() => fetchMetadata(file.file)}
                      className="ml-4 bg-yellow-500 text-white py-1 px-3 rounded-lg"
                    >
                      View Metadata
                    </button>
                    <button
                      onClick={() => handleDelete(file.file)}
                      className="ml-2 bg-red-500 text-white py-1 px-3 rounded-lg"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePlayPause(file.file)}
                      className="ml-2 bg-green-500 text-white py-1 px-3 rounded-lg"
                    >
                      {isPlaying && audioRef.current?.src.includes(file.file)
                        ? "Pause"
                        : "Play"}
                    </button>
                  </li>
                ))
              : null}
          </ul>
        </div>

        {/* Metadata and Edit Section */}
        {selectedFile && (
          <div className="mb-4">
            <h2 className="text-xl mb-2">Edit Metadata</h2>
            {Object.entries(selectedFile.metadata || {}).map(([key, value]) => (
              <div key={key} className="mb-2">
                <label className="block text-gray-700">
                  {key}:{" "}
                  <input
                    type="text"
                    value={newMetadata[key] || JSON.stringify(value)}
                    onChange={(e) => handleMetadataChange(key, e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                </label>
              </div>
            ))}
            <button
              onClick={handleMetadataUpdate}
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg mt-4"
            >
              Update Metadata
            </button>
          </div>
        )}

        {/* Replace File Section */}
        <div className="mb-4">
          <h2 className="text-xl mb-2">Replace Audio File</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              setEditedFile(e.target.files ? e.target.files[0] : null)
            }
            className="mb-2"
          />
          <button
            onClick={handleReplace}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Replace File
          </button>
        </div>

        <audio ref={audioRef} controls />
      </div>
    </div>
  );
};

export default About;
