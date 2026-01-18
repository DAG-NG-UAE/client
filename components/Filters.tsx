import React from 'react';
import {
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  FormControl,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew'; // Import RefreshIcon
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
  allDepartments?: MenuItems[];
  allYears?: MenuItems[];
  refreshPosition?:() => void;
  filterFunction?: (status:string) => void; // Fixed type to match usage
  onYearChange?: (year: string) => void;
  onSearch?: (query: string) => void;
}

const Filters = ({menuItems, textPlaceholder, isCandidate, allDepartments, allYears, refreshPosition, filterFunction, onYearChange, onSearch}: FilterProps) => {
  const [role, setRole] = React.useState('all');
  const [year, setYear] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const {positions, loading} = useSelector((state: RootState) => state.positions)
 
  // Debounce search
  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }
       if (onSearch) {
         onSearch(searchTerm);
       }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    filterFunction && filterFunction(event.target.value as string)
    setRole(event.target.value as string);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    onYearChange && onYearChange(event.target.value as string)
    setYear(event.target.value as string);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ mb: 4 }}
      alignItems="center"
    >
      <TextField
        placeholder={textPlaceholder}
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          },
        }}
      />
      <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={role}
            onChange={handleRoleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Status' }}
            sx={{ backgroundColor: 'background.paper' }}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.text} value={item.value}>
                {item.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton 
          onClick={refreshPosition} 
          disabled={loading} 
          color="primary"
          aria-label="refresh positions"
        >
          <AutorenewIcon />
        </IconButton>
        
        {/* all years for the candidate */}
        {isCandidate && (
          <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={year}
            onChange={handleYearChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Status' }}
            sx={{ backgroundColor: 'background.paper' }}
          >
            {allYears?.map((item) => (
              <MenuItem key={item.text} value={item.value}>
                {item.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        )}
        
      </Stack>
    </Stack>
  );
};

export default Filters;
