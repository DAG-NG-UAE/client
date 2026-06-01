import React from 'react';
import {
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  IconButton,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface MenuItems {
  text: string;
  value: string;
}

interface FilterProps {
  menuItems: MenuItems[];
  textPlaceholder?: string;
  isCandidate?: boolean;
  allYears?: MenuItems[];
  statusMenuItems?: MenuItems[];
  defaultFilterValue?: string;
  refreshPosition?: () => void;
  filterFunction?: (value: string) => void;
  onStatusChange?: (status: string) => void;
  onYearChange?: (year: string) => void;
  onSearch?: (query: string) => void;
}

const Filters = ({
  menuItems,
  textPlaceholder,
  isCandidate,
  allYears,
  statusMenuItems,
  defaultFilterValue = 'all',
  refreshPosition,
  filterFunction,
  onStatusChange,
  onYearChange,
  onSearch,
}: FilterProps) => {
  const [year, setYear] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const { loading } = useSelector((state: RootState) => state.positions);

  // Sync position dropdown when URL-driven default changes
  const selectedOption = menuItems.find(i => i.value === defaultFilterValue) ?? null;

  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isFirstRun.current) { isFirstRun.current = false; return; }
      onSearch?.(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value);
    onYearChange?.(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
    onStatusChange?.(event.target.value);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ mb: 4 }}
      alignItems="center"
      flexWrap="wrap"
    >
      {/* Search */}
      <TextField
        placeholder={textPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: 220,
          maxWidth: 320,
          flexGrow: 1,
          '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
        }}
      />

      {isCandidate ? (
        <>
          {/* Searchable position/role dropdown */}
          <Autocomplete
            options={menuItems}
            getOptionLabel={(option) => option.text}
            value={selectedOption}
            onChange={(_e, newValue) => filterFunction?.(newValue?.value ?? 'all')}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            size="small"
            sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
            renderInput={(params) => <TextField {...params} placeholder="Filter by role..." />}
          />

          {/* Status dropdown */}
          {statusMenuItems && statusMenuItems.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={status}
                onChange={handleStatusChange}
                displayEmpty
                sx={{ backgroundColor: 'background.paper' }}
                MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
              >
                {statusMenuItems.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Year dropdown */}
          {allYears && allYears.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                value={year}
                onChange={handleYearChange}
                displayEmpty
                sx={{ backgroundColor: 'background.paper' }}
              >
                {allYears.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Manual refresh for positions */}
          {refreshPosition && (
            <IconButton onClick={refreshPosition} disabled={loading} color="primary" aria-label="refresh positions">
              <AutorenewIcon />
            </IconButton>
          )}
        </>
      ) : (
        /* Requisition / generic — plain status Select */
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            defaultValue="all"
            onChange={(e) => filterFunction?.(e.target.value)}
            displayEmpty
            sx={{ backgroundColor: 'background.paper' }}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
};

export default Filters;
