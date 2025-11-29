"use client";
import React, { useState } from 'react';
import { Box, Typography, Button, Select, MenuItem, InputLabel, FormControl, 
         Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Pagination } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { SAMPLE_HISTORICAL_DATA, HistoricalRecord } from '../../utils/constants';
import UploadHistoricalDataModal from '../../components/history/UploadHistoricalDataModal';

const HistoricalData = () => {
  const theme = useTheme();
  const [yearFilter, setYearFilter] = useState('All Years');
  const [quarterFilter, setQuarterFilter] = useState('All Quarters');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const rowsPerPage = 5; // As per the image

  const handleYearChange = (event: any) => {
    setYearFilter(event.target.value);
  };

  const handleQuarterChange = (event: any) => {
    setQuarterFilter(event.target.value);
  };

  const handleTypeChange = (event: any) => {
    setTypeFilter(event.target.value);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getChipPropsForType = (type: HistoricalRecord['type']) => {
    switch (type) {
      case 'Closed Positions':
        return { label: type, sx: { backgroundColor: theme.palette.grey[300], color: theme.palette.text.primary, fontWeight: 'normal' } };
      case 'Open Positions':
        return { label: type, sx: { backgroundColor: '#D6FFE0', color: '#157D3E', fontWeight: 'normal' } }; // Light green background, dark green text
      case 'On Hold':
        return { label: type, sx: { backgroundColor: '#FFF6D7', color: '#8D6C00', fontWeight: 'normal' } }; // Light yellow background, dark yellow text
      default:
        return { label: type, sx: { backgroundColor: theme.palette.grey[200], color: theme.palette.text.primary } };
    }
  };

  const getChipPropsForStatus = (status: HistoricalRecord['status']) => {
    switch (status) {
      case 'Complete':
        return { label: status, sx: { backgroundColor: '#D6FFE0', color: '#157D3E', fontWeight: 'normal' } }; // Light green background, dark green text
      case 'Failed':
        return { label: status, sx: { backgroundColor: '#FFD6D6', color: '#D4183D', fontWeight: 'normal' } }; // Light red background, dark red text
      default:
        return { label: status, sx: { backgroundColor: theme.palette.grey[200], color: theme.palette.text.primary } };
    }
  };

  // Filtered data (for now, just use sample data)
  const filteredData = SAMPLE_HISTORICAL_DATA;
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Historical Data
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Upload and manage historical recruitment data from Excel files
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<UploadFileIcon />} 
          sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }} // Use theme colors
          onClick={handleOpenModal} // Add onClick to open modal
        >
          Upload Excel Files
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>All Years</InputLabel>
          <Select value={yearFilter} label="All Years" onChange={handleYearChange}>
            <MenuItem value="All Years">All Years</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>All Quarters</InputLabel>
          <Select value={quarterFilter} label="All Quarters" onChange={handleQuarterChange}>
            <MenuItem value="All Quarters">All Quarters</MenuItem>
            <MenuItem value="Q1">Q1</MenuItem>
            <MenuItem value="Q2">Q2</MenuItem>
            <MenuItem value="Q3">Q3</MenuItem>
            <MenuItem value="Q4">Q4</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>All Types</InputLabel>
          <Select value={typeFilter} label="All Types" onChange={handleTypeChange}>
            <MenuItem value="All Types">All Types</MenuItem>
            <MenuItem value="Closed Positions">Closed Positions</MenuItem>
            <MenuItem value="Open Positions">Open Positions</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[1] }}>
        <Table sx={{ minWidth: 650 }} aria-label="historical data table">
          <TableHead>
            <TableRow sx={{backgroundColor:'#f9fafb'}}>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>UPLOAD DATE</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>FILE NAME</TableCell>
              {/* <TableCell>TYPE</TableCell> */}
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>YEAR</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>QUARTER</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>REQUISITIONS</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>CANDIDATES</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>STATUS</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.uploadDate}
                </TableCell>
                <TableCell>{row.fileName}</TableCell>
                {/* <TableCell><Chip {...getChipPropsForType(row.type)} size="small" /></TableCell> */}
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.quarter}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.requisitions} 
                    size="small" 
                    sx={{ backgroundColor: '#DBEAFE', color: '#2D5BFF', borderRadius: '16px', fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.candidates} 
                    size="small" 
                    sx={{ backgroundColor: '#F3E8FF', color: '#7E22CE', borderRadius: '16px', fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell><Chip {...getChipPropsForStatus(row.status)} size="small" /></TableCell>
                <TableCell>
                  <Button 
                    variant="text" 
                    size="small" 
                    startIcon={<VisibilityIcon />} 
                    sx={{ color: theme.palette.primary.main, textTransform: 'none' }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} uploads
        </Typography>
        <Pagination 
          count={Math.ceil(filteredData.length / rowsPerPage)} 
          page={page} 
          onChange={handleChangePage} 
          color="primary" 
          siblingCount={0}
          boundaryCount={1}
        />
      </Box>
      {isModalOpen && <UploadHistoricalDataModal open={isModalOpen} onClose={handleCloseModal} />}
    </Box>
  );
};

export default HistoricalData;