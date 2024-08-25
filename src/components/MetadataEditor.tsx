// src/components/MetadataEditor.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Metadata {
  title?: string;
  artist?: string;
  bpm?: number;
  customTags?: string[];
  // Add more fields as needed
}

interface Props {
  filename: string;
}

const MetadataEditor: React.FC<Props> = ({ filename }) => {
  const [metadata, setMetadata] = useState<Metadata>({});
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<Metadata>(`http://localhost:3000/mp3s/${filename}/metadata`)
      .then((response) => {
        setMetadata(response.data);
        setTags(response.data.customTags || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching metadata", error);
        setLoading(false);
      });
  }, [filename]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata((prevState) => ({
      ...prevState,
      [name]: name === "bpm" && value ? parseFloat(value) : value,
    }));
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedMetadata = Object.fromEntries(
      Object.entries({ ...metadata, tags: tags.join(",") }).filter(
        ([_, v]) => v !== ""
      )
    );

    axios
      .put(`http://localhost:3000/mp3s/${filename}/metadata`, updatedMetadata)
      .then(() => alert("Metadata updated successfully"))
      .catch((error) => alert(`Error updating metadata: ${error.message}`));
  };

  if (loading) return <p>Loading metadata...</p>;

  return (
    <div>
      <h3>Edit Metadata</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={metadata.title || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Artist:
          <input
            type="text"
            name="artist"
            placeholder="Artist"
            value={metadata.artist || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          BPM:
          <input
            type="text"
            name="bpm"
            placeholder="BPM"
            value={metadata.bpm || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Tags:
          <input
            type="text"
            name="tags"
            placeholder="Tags"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(", ").filter((tag) => tag !== ""))
            }
          />
        </label>
        <label>
          Custom Tags:
          <input
            type="text"
            value={metadata.customTags ? metadata.customTags.join(", ") : ""}
            readOnly
          />
        </label>
        <button type="submit">Save Metadata</button>
      </form>
    </div>
  );
};

export default MetadataEditor;
