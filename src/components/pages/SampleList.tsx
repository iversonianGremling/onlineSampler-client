import { useState, useMemo } from "react";

import FileUpload from "../FileUpload";
import MetadataEditor from "../MetadataEditor";
import AudioPlayer from "../AudioPlayer";
import Waveform from "../Waveform";
import SearchTerm from "../SearchTerm";
import { Table } from "@mui/material";
import DataTable from "../DataTable";

interface ApiResponseItem {
  id: number;
  title: string;
  artist: string;
  bpm: number;
  duration: number;
  tags: string[];
  //TODO: Menu to organize by folders
}

const SampleList = () => {
  const [apiResponse, setApiResponse] = useState<ApiResponseItem[]>([
    {
      id: 1,
      title: "Amen Break",
      artist: "Funk Band",
      bpm: 100,
      duration: 5.5,
      tags: ["drum", "loop"],
    },
    {
      id: 2,
      title: "Crazy Synth",
      artist: "Aphex Twin",
      bpm: 180,
      duration: 3.5,
      tags: ["synth", "loop"],
    },
    {
      id: 3,
      title: "Funky Bass",
      artist: "Parliament",
      bpm: 120,
      duration: 4.2,
      tags: ["bass", "funk"],
    },
    {
      id: 4,
      title: "Epic Strings",
      artist: "Hans Zimmer",
      bpm: 90,
      duration: 6.1,
      tags: ["strings", "cinematic"],
    },
    {
      id: 5,
      title: "Jazzy Drums",
      artist: "Miles Davis",
      bpm: 110,
      duration: 4.8,
      tags: ["drums", "jazz"],
    },
    {
      id: 6,
      title: "Dark Ambient",
      artist: "Tim Hecker",
      bpm: 60,
      duration: 7.3,
      tags: ["ambient", "dark"],
    },
    {
      id: 7,
      title: "Upbeat Horns",
      artist: "Earth, Wind & Fire",
      bpm: 130,
      duration: 3.9,
      tags: ["horns", "funk"],
    },
    {
      id: 8,
      title: "Melodic Piano",
      artist: "Ludovico Einaudi",
      bpm: 100,
      duration: 5.1,
      tags: ["piano", "melodic"],
    },
    {
      id: 9,
      title: "Heavy Guitar",
      artist: "Metallica",
      bpm: 140,
      duration: 4.5,
      tags: ["guitar", "metal"],
    },
    {
      id: 10,
      title: "Atmospheric Pad",
      artist: "Tycho",
      bpm: 80,
      duration: 6.5,
      tags: ["pad", "atmospheric"],
    },
  ]);

  // Exclude 'tags' from being a sortable column
  const [sortColumn, setSortColumn] = useState<
    keyof Omit<ApiResponseItem, "tags"> | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedSearchFields, setAdvancedSearchFields] = useState({
    title: "",
    artist: "",
    bpm: "",
    tags: "",
  });
  const [searchTerms, setSearchTerms] = useState<string[]>(["drum", "synth"]);
  const [playingElementId, setPlayingElementId] = useState(0);

  const handleSort = (column: keyof Omit<ApiResponseItem, "tags">) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedApiResponse = useMemo(() => {
    if (!sortColumn || !sortOrder) return apiResponse;

    const sortedData = [...apiResponse];

    if (sortColumn === "bpm") {
      sortedData.sort((a, b) =>
        sortOrder === "asc" ? a.bpm - b.bpm : b.bpm - a.bpm
      );
    } else if (sortColumn === "duration") {
      sortedData.sort((a, b) => {
        const durationA = a.duration; // assuming duration is a number
        const durationB = b.duration; // assuming duration is a number

        if (sortOrder === "asc") {
          return durationA - durationB;
        } else {
          return durationB - durationA;
        }
      });
    } else {
      sortedData.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0; // If they aren't strings, don't change the order
      });
    }

    return sortedData;
  }, [apiResponse, sortColumn, sortOrder]);

  const handleAdvancedSearch = () => {
    setAdvancedSearchOpen(!advancedSearchOpen);
  };

  const handleAdvancedSearchChange = (
    field: keyof typeof advancedSearchFields
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setAdvancedSearchFields({
        ...advancedSearchFields,
        [field]: event.target.value,
      });
    };
  };

  const editSampleById = (id: number) => {};
  const editSampleMetadataById = (id: number) => {};

  const downloadSampleById = (id: number) => {};

  const deleteSampleById = (id: number) => {};

  const handleAddArtist = (artist: string) => {
    setSearchTerms([...searchTerms, "a/" + artist]);
  };

  const handleRemoveArtist = (artist: string) => {
    setSearchTerms(searchTerms.filter((a) => a !== artist));
    console.log(artist);
  };

  const handleAddBPM = (bpm: string) => {
    setSearchTerms([...searchTerms, "b/" + bpm]);
  };

  const handleRemoveBPM = (bpm: string) => {
    setSearchTerms(searchTerms.filter((b) => b !== bpm));
  };

  const handleAddDuration = (duration: string) => {
    setSearchTerms([...searchTerms, "d/" + duration]);
  };

  const handleRemoveDuration = (duration: string) => {
    setSearchTerms(searchTerms.filter((d) => d !== duration));
  };

  const handleAddTag = (tag: string) => {
    setSearchTerms([...searchTerms, "t/" + tag]);
  };
  const handleRemoveTag = (tag: string) => {
    setSearchTerms(searchTerms.filter((t) => t !== tag));
  };

  return (
    <div>
      <DataTable />
    </div>
  );
};

export default SampleList;
