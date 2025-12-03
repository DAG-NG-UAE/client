"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Select, MenuItem, InputLabel, FormControl, 
         Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Pagination, 
         CircularProgress,
         Alert} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { HistoricalRecord } from '../../utils/constants';
import UploadHistoricalDataModal from '../../components/history/UploadHistoricalDataModal';
import { getHistoricalRequisitions } from '@/api/historicalRequisitions';

const HistoricalData = () => {
  const theme = useTheme();
  const router = useRouter();
  const [yearFilter, setYearFilter] = useState('All Years');
  const [quarterFilter, setQuarterFilter] = useState('All Quarters');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const rowsPerPage = 5; // As per the image

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalRequisitions, setHistoricalRequisitions] = useState<HistoricalRecord[]>([]);

    useEffect(() => {
      const fetchHistoricalRequisitions = async () => {
        try {
          setLoading(true);
          setError(null);
          let data: any[];
          data = await getHistoricalRequisitions();
  
          setHistoricalRequisitions(data);
        } catch (err) {
          setError('Failed to fetch historical requisitions.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistoricalRequisitions();
    }, []);
    
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
  const filteredData = historicalRequisitions;
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
      </Box>

      {isLoading && <CircularProgress sx={{ display: 'block', my: 4 }} />}
      {error && <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>}
      {!isLoading && !error && historicalRequisitions.length === 0 && (
        <Typography sx={{ my: 4 }}>No requisitions found.</Typography>
      )}

      {!isLoading && !error && historicalRequisitions.length > 0 && (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[1] }}>
            <Table sx={{ minWidth: 650 }} aria-label="historical data table">
              <TableHead>
                <TableRow sx={{backgroundColor:'#f9fafb'}}>
                  <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>UPLOAD DATE</TableCell>
                  <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>FILE NAME</TableCell>
                  <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>REQUISITIONS</TableCell>
                  <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>CANDIDATES</TableCell>
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
                      {row.upload_date}
                    </TableCell>
                    <TableCell>{row.file_name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.requisition_count} 
                        size="small" 
                        sx={{ backgroundColor: '#DBEAFE', color: '#2D5BFF', borderRadius: '16px', fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.candidate_count} 
                        size="small" 
                        sx={{ backgroundColor: '#F3E8FF', color: '#7E22CE', borderRadius: '16px', fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="text" 
                        size="small" 
                        startIcon={<VisibilityIcon />} 
                        sx={{ color: theme.palette.primary.main, textTransform: 'none' }}
                        onClick={() => {
                          const queryParams = new URLSearchParams({
                            fileName: row.file_name,
                            reqCount: row.requisition_count.toString(),
                            candCount: row.candidate_count.toString(),
                            dataSpan: 'Q4 2024', 
                          }).toString();
                          router.push(`/history/${row.historical_id}?${queryParams}`);
                        }}
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
        </>
        
      )}
      {isModalOpen && <UploadHistoricalDataModal open={isModalOpen} onClose={handleCloseModal} />}
    </Box>
  );
};

export default HistoricalData;