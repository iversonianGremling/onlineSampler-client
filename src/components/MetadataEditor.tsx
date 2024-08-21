// src/components/MetadataEditor.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Metadata {
    title?: string;
    artist?: string;
    album?: string;
    // Add more fields as needed
}

interface Props {
    filename: string;
}

const MetadataEditor: React.FC<Props> = ({ filename }) => {
    const [metadata, setMetadata] = useState<Metadata>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get<Metadata>(`http://localhost:3000/mp3s/${filename}/metadata`)
            .then(response => {
                setMetadata(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching metadata", error);
                setLoading(false);
            });
    }, [filename]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMetadata(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        axios.put(`http://localhost:3000/mp3s/${filename}/metadata`, metadata)
            .then(() => alert('Metadata updated successfully'))
            .catch(error => alert(`Error updating metadata: ${error.message}`));
    };

    if (loading) return <p>Loading metadata...</p>;

    return (
        <div>
            <h3>Edit Metadata</h3>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={metadata.title || ''}
                onChange={handleChange}
            />
            <input
                type="text"
                name="artist"
                placeholder="Artist"
                value={metadata.artist || ''}
                onChange={handleChange}
            />
            <input
                type="text"
                name="album"
                placeholder="Album"
                value={metadata.album || ''}
                onChange={handleChange}
            />
            <button onClick={handleSave}>Save Metadata</button>
        </div>
    );
};

export default MetadataEditor;
