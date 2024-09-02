import React, { useState } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridSortModel,
  GridSelectionModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

interface ApiResponseItem {
  id: number;
  title: string;
  artist: string;
  bpm: number;
  duration: number;
  tags: string[];
  fileUrl: string;
}

interface Filter {
  field: string;
  value: string | number;
}

const HoverableCell = styled("div")(({ theme }) => ({
  cursor: "pointer",
  transition: "background-color 0.3s, transform 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.02)",
  },
}));

const HoverableChip = styled(Chip)(({ theme }) => ({
  cursor: "pointer",
  transition: "background-color 0.3s, transform 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.05)",
  },
}));

const HoverableIconButton = styled(IconButton)(({ theme }) => ({
  transition: "color 0.3s, transform 0.3s",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "scale(1.1)",
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const TagsContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
  justifyContent: "center",
  padding: "9px",
});

const DataTable = () => {
  const initialData: ApiResponseItem[] = [
    {
      id: 1,
      title: "Amen Break",
      artist: "Funk Band",
      bpm: 100,
      duration: 5.5,
      tags: ["drum", "loop"],
      fileUrl: "/path/to/audio1.mp3",
    },
    {
      id: 2,
      title: "Crazy Synth",
      artist: "Aphex Twin",
      bpm: 180,
      duration: 3.5,
      tags: ["synth", "loop"],
      fileUrl: "/path/to/audio2.mp3",
    },
    // ...other items
  ];

  const [rows, setRows] = useState<ApiResponseItem[]>(initialData);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "title",
      sort: "asc",
    },
  ]);
  const [editingRow, setEditingRow] = useState<ApiResponseItem | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ApiResponseItem | null>(
    null
  );
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const applyFilters = (newFilters: Filter[]) => {
    let filteredRows = initialData;

    newFilters.forEach((filter) => {
      if (filter.field === "bpm") {
        filteredRows = filteredRows.filter(
          (row) =>
            row.bpm >= (filter.value as number) - 10 &&
            row.bpm <= (filter.value as number) + 10
        );
      } else if (filter.field === "duration") {
        const durationValue = filter.value as number;
        const minDuration = durationValue * 0.9;
        const maxDuration = durationValue * 1.1;
        filteredRows = filteredRows.filter(
          (row) => row.duration >= minDuration && row.duration <= maxDuration
        );
      } else if (filter.field === "artist") {
        filteredRows = filteredRows.filter(
          (row) => row.artist === filter.value
        );
      } else if (filter.field === "tags") {
        filteredRows = filteredRows.filter((row) =>
          row.tags.includes(filter.value as string)
        );
      }
    });

    setRows(filteredRows);
  };

  const handleArtistClick = (artist: string) => {
    const newFilters = [...filters, { field: "artist", value: artist }];
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleTagClick = (tag: string) => {
    const newFilters = [...filters, { field: "tags", value: tag }];
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleFilterDelete = (filterToDelete: Filter) => {
    const updatedFilters = filters.filter(
      (filter) => filter !== filterToDelete
    );
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const handleEditClick = (row: ApiResponseItem) => {
    setEditingRow(row);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingRow(null);
  };

  const handleSave = () => {
    if (editingRow) {
      const updatedRows = rows.map((row) =>
        row.id === editingRow.id ? editingRow : row
      );
      setRows(updatedRows);
    }
    handleCloseEditDialog();
  };

  const handleChange = (
    field: keyof ApiResponseItem,
    value: string | number
  ) => {
    if (editingRow) {
      setEditingRow({ ...editingRow, [field]: value });
    }
  };

  const handleDeleteClick = (row: ApiResponseItem) => {
    setItemToDelete(row);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCount > 0) {
      const idsToDelete = selectionModel as number[];
      const updatedRows = rows.filter((row) => !idsToDelete.includes(row.id));
      setRows(updatedRows);
      setSelectionModel([]);
      setSelectedCount(0);
    } else if (itemToDelete) {
      const updatedRows = rows.filter((row) => row.id !== itemToDelete.id);
      setRows(updatedRows);
      setItemToDelete(null);
    }
    setOpenConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleDeleteSelected = () => {
    const selectedIds = selectionModel as number[];
    setSelectedCount(selectedIds.length);
    setOpenConfirmDialog(true);
  };

  const handleDownloadSelected = () => {
    (selectionModel as number[]).forEach((id) => {
      const item = rows.find((row) => row.id === id);
      if (item) {
        window.open(item.fileUrl, "_blank");
      }
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Handle search for text and numbers
    const filteredRows = initialData.filter((row) => {
      const titleMatch = row.title.toLowerCase().includes(value);
      const artistMatch = row.artist.toLowerCase().includes(value);
      const tagsMatch = row.tags.some((tag) =>
        tag.toLowerCase().includes(value)
      );
      const bpmMatch = row.bpm.toString().includes(value);
      const durationMatch = row.duration.toString().includes(value);

      return (
        titleMatch || artistMatch || tagsMatch || bpmMatch || durationMatch
      );
    });

    setRows(filteredRows);
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 150,
      sortable: true,
      renderCell: (params) => (
        <HoverableCell
          onClick={() => window.open(params.row.fileUrl, "_blank")}
        >
          {params.value}
        </HoverableCell>
      ),
    },
    {
      field: "artist",
      headerName: "Artist",
      width: 150,
      sortable: true,
      renderCell: (params) => (
        <HoverableCell onClick={() => handleArtistClick(params.value)}>
          {params.value}
        </HoverableCell>
      ),
    },
    {
      field: "bpm",
      headerName: "BPM",
      width: 100,
      sortable: true,
      renderCell: (params) => (
        <HoverableCell onClick={() => handleCellClick(params, event)}>
          {params.value}
        </HoverableCell>
      ),
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
      sortable: true,
      renderCell: (params) => (
        <HoverableCell onClick={() => handleCellClick(params, event)}>
          {params.value}
        </HoverableCell>
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 500,
      sortable: false,
      renderCell: (params) => (
        <TagsContainer className="flex content-start">
          {(params.value as string[]).map((tag, index) => (
            <HoverableChip
              key={index}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color="primary"
              variant="outlined"
            />
          ))}
        </TagsContainer>
      ),
    },
    {
      field: "audio",
      headerName: "Audio",
      width: 400,
      renderCell: (params) => (
        <audio
          className="pt-1 rounded-full w-full"
          src={params.row.fileUrl}
          controls
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Edit">
            <HoverableIconButton onClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </HoverableIconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <HoverableIconButton onClick={() => handleDeleteClick(params.row)}>
              <DeleteIcon />
            </HoverableIconButton>
          </Tooltip>
          <Tooltip title="Download">
            <HoverableIconButton
              onClick={() => console.log(`Download ID: ${params.row.id}`)}
            >
              <DownloadIcon />
            </HoverableIconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {
    event.stopPropagation();
    if (params.field === "bpm") {
      const bpmValue = params.row.bpm;
      const newFilters = [...filters, { field: "bpm", value: bpmValue }];
      setFilters(newFilters);
      applyFilters(newFilters);
    } else if (params.field === "duration") {
      const durationValue = params.row.duration;
      const newFilters = [
        ...filters,
        { field: "duration", value: durationValue },
      ];
      setFilters(newFilters);
      applyFilters(newFilters);
    }
  };

  return (
    <Paper sx={{ height: 600, width: "100%", padding: "16px" }}>
      <SearchBar
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
      />
      <div style={{ marginBottom: "16px" }}>
        {filters.map((filter, index) => (
          <HoverableChip
            key={index}
            label={`${filter.field}: ${filter.value}`}
            onDelete={() => handleFilterDelete(filter)}
            color="secondary"
            variant="outlined"
          />
        ))}
        <Tooltip title="Delete selected">
          <HoverableIconButton onClick={handleDeleteSelected} color="error">
            <DeleteIcon />
          </HoverableIconButton>
        </Tooltip>
        <Tooltip title="Download selected">
          <HoverableIconButton onClick={handleDownloadSelected}>
            <DownloadIcon />
          </HoverableIconButton>
        </Tooltip>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection);
          setSelectedCount((newSelection as number[]).length);
        }}
        sortingOrder={["asc", "desc"]}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        onCellClick={(params, event) => handleCellClick(params, event)}
        sx={{ border: 0 }}
      />
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Metadata</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={editingRow?.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Artist"
            fullWidth
            value={editingRow?.artist || ""}
            onChange={(e) => handleChange("artist", e.target.value)}
          />
          <TextField
            margin="dense"
            label="BPM"
            fullWidth
            type="number"
            value={editingRow?.bpm || ""}
            onChange={(e) => handleChange("bpm", parseInt(e.target.value))}
          />
          <TextField
            margin="dense"
            label="Duration"
            fullWidth
            type="number"
            value={editingRow?.duration || ""}
            onChange={(e) =>
              handleChange("duration", parseFloat(e.target.value))
            }
          />
          <TextField
            margin="dense"
            label="Tags"
            fullWidth
            value={editingRow?.tags.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "tags",
                e.target.value.split(",").map((tag) => tag.trim())
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedCount > 0
              ? `Are you sure you want to delete ${selectedCount} files?`
              : "Are you sure you want to delete this item?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DataTable;
