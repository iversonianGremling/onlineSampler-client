import { useState, useMemo } from "react";

interface ApiResponseItem {
  title: string;
  artist: string;
  bpm: number;
  duration: number;
  tags: string[]; //TODO: Tags should be represented by buttons of different colors. You should be able to perform a search of several tags and
  //Put them together and should have a visual representation of it right below the search bar, same for artists, name...etc
  //TODO: Add a 'delete' button
  //TODO: Add a 'edit' button
  //TODO: Add a select checkbox to delete/download in pack
  //TODO: Put the play button at the left of the waveform
}

const SampleList = () => {
  const [apiResponse, setApiResponse] = useState<ApiResponseItem[]>([
    {
      title: "Amen Break",
      artist: "Funk Band",
      bpm: 100,
      duration: 5.5,
      tags: ["drum", "loop"],
    },
    {
      title: "Crazy Synth",
      artist: "Aphex Twin",
      bpm: 180,
      duration: 3.5,
      tags: ["synth", "loop"],
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
        <button onClick={handleAdvancedSearch}>Advanced Search</button>
      </div>
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
      <div style={{ height: "300px", overflow: "auto" }}>
        <table>
          <thead>
            <tr>
              <th></th>
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
              <th onClick={() => handleSort("bpm")}>
                <button>BPM </button>
                {sortColumn === "bpm" && sortOrder === "asc" ? (
                  <span>&#8595;</span>
                ) : sortColumn === "bpm" && sortOrder === "desc" ? (
                  <span>&#8593;</span>
                ) : (
                  <span>&#8597;</span>
                )}
              </th>
              <th>Duration</th>
              <th>Tags</th>
              <th>Waveform</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {sortedApiResponse.map((item, index) => (
              <tr key={index}>
                <td>
                  <button className="ml-4">
                    <span>&#9654;</span>
                  </button>
                </td>
                <td>{item.title}</td>
                <td>{item.artist}</td>
                <td>{item.bpm}</td>
                <td>{item.duration}</td>
                <td>{item.tags.join(",")}</td>
                <td></td>
                <td>
                  <button className="text-xs">Download Icon</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SampleList;
