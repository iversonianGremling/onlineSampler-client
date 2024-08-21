import { useState, useMemo } from "react";

import FileUpload from "../FileUpload";
import MetadataEditor from "../MetadataEditor";
import AudioPlayer from "../AudioPlayer";
import Waveform from "../Waveform";
import SearchTerm from "../SearchTerm";

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search"
          style={{ width: "50%" }}
        />
        {advancedSearchOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={advancedSearchFields.title}
              onChange={handleAdvancedSearchChange("title")}
              placeholder="Title"
            />
            <input
              type="text"
              value={advancedSearchFields.artist}
              onChange={handleAdvancedSearchChange("artist")}
              placeholder="Artist"
            />
            <input
              type="number"
              value={advancedSearchFields.bpm}
              onChange={handleAdvancedSearchChange("bpm")}
              placeholder="BPM"
            />
            <input
              type="text"
              value={advancedSearchFields.tags}
              onChange={handleAdvancedSearchChange("tags")}
              placeholder="Tags"
            />
          </div>
        )}
        <button onClick={handleAdvancedSearch}>Advanced Search</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searchTerms.map((tag, index) =>
          tag.split("/")[0] === "a" ? (
            <SearchTerm
              tag={tag}
              index={index}
              deleteFunction={handleRemoveArtist}
            />
          ) : tag.split("/")[0] === "b" ? (
            <SearchTerm
              tag={tag}
              index={index}
              deleteFunction={handleRemoveBPM}
            />
          ) : tag.split("/")[0] === "d" ? (
            <SearchTerm
              tag={tag}
              index={index}
              deleteFunction={handleRemoveDuration}
            />
          ) : tag.split("/")[0] === "t" ? (
            <SearchTerm
              tag={tag}
              index={index}
              deleteFunction={handleRemoveTag}
            />
          ) : null
        )}
      </div>

      <div
        className="overflow-x-auto"
        style={{ overflow: "auto", height: "70vh" }}
      >
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>

              <th onClick={() => handleSort("title")}>
                <button>Title </button>
                {sortColumn === "title" && sortOrder === "asc" ? (
                  <span>&#8595;</span>
                ) : sortColumn === "title" && sortOrder === "desc" ? (
                  <span>&#8593;</span>
                ) : (
                  <span>&#8597;</span>
                )}
              </th>
              <th onClick={() => handleSort("artist")}>
                <button>Artist </button>
                {sortColumn === "artist" && sortOrder === "asc" ? (
                  <span>&#8595;</span>
                ) : sortColumn === "artist" && sortOrder === "desc" ? (
                  <span>&#8593;</span>
                ) : (
                  <span>&#8597;</span>
                )}
              </th>
              <th className="w-20" onClick={() => handleSort("bpm")}>
                <button>BPM </button>
                {sortColumn === "bpm" && sortOrder === "asc" ? (
                  <span>&#8595;</span>
                ) : sortColumn === "bpm" && sortOrder === "desc" ? (
                  <span>&#8593;</span>
                ) : (
                  <span>&#8597;</span>
                )}
              </th>
              <th onClick={() => handleSort("duration")}>
                <button>Duration</button>
                {sortColumn === "duration" && sortOrder === "asc" ? (
                  <span>&#8595;</span>
                ) : sortColumn === "duration" && sortOrder === "desc" ? (
                  <span>&#8593;</span>
                ) : (
                  <span>&#8597;</span>
                )}
              </th>
              <th>Tags</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedApiResponse.map((item, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="p-2 pl-3">{item.title}</td>
                <td onClick={() => handleAddArtist(item.artist)}>
                  {item.artist}
                </td>
                <td onClick={() => handleAddBPM(item.bpm.toString())}>
                  {item.bpm}
                </td>
                <td onClick={() => handleAddDuration(item.duration.toString())}>
                  {item.duration}
                </td>
                <td className="flex items-center flex-wrap">
                  {item.tags.map((tag, index) => (
                    <span
                      onClick={() => handleAddTag(tag)}
                      key={index}
                      className="bg-gray-100 py-2 px-4 rounded-full flex items-center gap-2 text-xs hover:bg-gray-300"
                    >
                      <i className="text-gray-400" />
                      {tag}
                    </span>
                  ))}
                </td>
                <td>
                  <div className="ml-2 flex items-center">
                    <AudioPlayer fileUrl={""} />
                    {/* <AudioPlayer fileUrl={item.url} /> */}
                  </div>
                </td>
                <td>
                  <button onClick={() => editSampleMetadataById(item.id)}>
                    <i className="fas fa-pencil-alt m-2"></i>
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteSampleById(item.id)}>
                    <i className="fas fa-trash m-2"></i>
                  </button>
                </td>
                <td>
                  <button onClick={() => downloadSampleById(item.id)}>
                    <i className="fas fa-download m-2"></i>
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => editSampleById(item.id)}
                    className="text-xs"
                  >
                    Edit sample
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FileUpload />
    </div>
  );
};

export default SampleList;
