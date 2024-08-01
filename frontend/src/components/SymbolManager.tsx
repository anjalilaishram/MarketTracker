import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  addSymbol,
  removeSymbol,
  setTrackedSymbols,
  setAvailableSymbols,
  setSelectedSymbol,
} from "../redux/symbolsSlice";
import {
  fetchConfig,
  fetchAvailableSymbols,
  postConfig,
  deleteConfig,
} from "../utils/api";
import {
  Autocomplete,
  TextField,
  IconButton,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const PAGE_SIZE = 21; // Number of items per page

const SymbolManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const trackedSymbols = useSelector(
    (state: RootState) => state.symbols.trackedSymbols
  );
  const availableSymbols = useSelector(
    (state: RootState) => state.symbols.availableSymbols
  );
  const selectedSymbol = useSelector(
    (state: RootState) => state.symbols.selectedSymbol
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTermTracked, setSearchTermTracked] = useState("");
  const [searchTermAvailable, setSearchTermAvailable] = useState("");
  const [searchTermManage, setSearchTermManage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchSymbols = useCallback(async () => {
    setLoading(true);
    try {
      const configSymbols = await fetchConfig();
      dispatch(
        setTrackedSymbols(configSymbols.map((item: any) => item.symbol))
      );
      const binanceSymbols = await fetchAvailableSymbols();
      dispatch(setAvailableSymbols(binanceSymbols));

      // Set default selected symbol if not set
      if (!selectedSymbol) {
        dispatch(setSelectedSymbol("BTCUSDT"));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedSymbol]);

  useEffect(() => {
    fetchSymbols();
  }, [fetchSymbols]);

  const handleAddSymbol = async (symbol: string) => {
    await postConfig({ symbol, interval: "1s" });
    dispatch(addSymbol(symbol));
  };

  const handleRemoveSymbol = async (symbol: string) => {
    await deleteConfig(symbol);
    dispatch(removeSymbol(symbol));
  };

  const handleSelectSymbol = (symbol: string) => {
    dispatch(setSelectedSymbol(symbol));
  };

  const availableSymbolsFiltered = availableSymbols
    .filter((symbol) => !trackedSymbols.includes(symbol))
    .filter((symbol) =>
      symbol.toLowerCase().includes(searchTermAvailable.toLowerCase())
    )
    .sort();

  const trackedSymbolsFiltered = trackedSymbols
    .filter((symbol) =>
      symbol.toLowerCase().includes(searchTermTracked.toLowerCase())
    )
    .sort();

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (
        !loading &&
        (currentPage + 1) * PAGE_SIZE < availableSymbolsFiltered.length
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  const loadMoreSymbols = () => {
    if (
      !loading &&
      (currentPage + 1) * PAGE_SIZE < availableSymbolsFiltered.length
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    // Reset search terms and pagination
    setSearchTermManage("");
    setCurrentPage(0);
  };

  const handleDialogSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermManage(event.target.value);
    setCurrentPage(0); // Reset page when search term changes
  };

  const filteredTrackedSymbols = trackedSymbolsFiltered.filter((symbol) =>
    symbol.toLowerCase().includes(searchTermManage.toLowerCase())
  );

  const filteredAvailableSymbols = availableSymbolsFiltered
    .filter((symbol) =>
      symbol.toLowerCase().includes(searchTermManage.toLowerCase())
    )
    .slice(0, (currentPage + 1) * PAGE_SIZE);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          padding: 2,
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          maxWidth: "600px",
          overflowY: "auto",
          maxHeight: "400px", // Adjust height as needed
          backgroundColor: "transparent", // Remove background color
        }}
        onScroll={handleScroll}
      >
        <Box sx={{ flex: 1, minWidth: "200px" }}>
          <Autocomplete
            options={trackedSymbolsFiltered}
            value={selectedSymbol}
            onChange={(event, newValue) =>
              handleSelectSymbol(newValue as string)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selected Graph"
                variant="outlined"
                size="small"
                onChange={(e) => setSearchTermTracked(e.target.value)}
                sx={{ backgroundColor: "transparent" }} // Remove background color
              />
            )}
            sx={{ zIndex: 1000 }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "250px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={openDialog}
            endIcon={<SearchIcon />}
          >
            Manage Symbols
          </Button>
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Manage Symbols</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleDialogSearch}
            value={searchTermManage}
            sx={{ marginBottom: 2, backgroundColor: "transparent" }} // Remove background color
          />
          <Box>
            <Box sx={{ marginBottom: 2 }}>
              <Divider />
              {filteredTrackedSymbols.map((symbol) => (
                <Chip
                  key={symbol}
                  label={symbol}
                  onDelete={() => handleRemoveSymbol(symbol)}
                  sx={{ margin: 0.5 }}
                />
              ))}
            </Box>
            <Divider sx={{ marginY: 2 }} />
            {filteredAvailableSymbols.map((symbol) => (
              <Chip
                key={symbol}
                label={symbol}
                onClick={() => handleAddSymbol(symbol)}
                sx={{ margin: 0.5 }}
                color="primary"
              />
            ))}
            {filteredAvailableSymbols.length <
              availableSymbolsFiltered.length && (
              <Button
                onClick={loadMoreSymbols}
                variant="outlined"
                sx={{ marginY: 2, display: "block", width: "100%" }}
              >
                Show More
              </Button>
            )}
            {loading && (
              <Box
                sx={{ display: "flex", justifyContent: "center", padding: 1 }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SymbolManager;
