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
  const [apiResponse, setApiResponse] = useState<ApiResponseItem[]>([]);

  // Exclude 'tags' from being a sortable column
  const [sortColumn, setSortColumn] = useState<
    keyof Omit<ApiResponseItem, "tags"> | null
  >(null);

  return (
    <div>
      <DataTable />
    </div>
  );
};

export default SampleList;
