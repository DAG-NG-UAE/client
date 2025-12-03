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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const RequisitionFilters = () => {
  const [status, setStatus] = React.useState('all');

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ mb: 4 }}
      alignItems="center"
    >
      <TextField
        placeholder="Search by position, department, or requester..."
        fullWidth
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
            value={status}
            onChange={handleStatusChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Status' }}
            sx={{ backgroundColor: 'background.paper' }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            borderColor: 'divider',
            color: 'text.primary',
            backgroundColor: 'background.paper',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: 'divider',
            },
          }}
        >
          Filters
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon />}
          sx={{
            borderColor: 'divider',
            color: 'text.primary',
            backgroundColor: 'background.paper',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: 'divider',
            },
          }}
        >
          Export
        </Button>
      </Stack>
    </Stack>
  );
};

export default RequisitionFilters;
