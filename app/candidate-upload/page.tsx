"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Avatar, Chip, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Link from 'next/link';
import FileUploadDialog from '../../components/candidate-upload/FileUploadDialog';
// import ColumnMappingSection from '../../components/candidate-upload/ColumnMappingSection';
import { transformData } from '../../utils/dataTransformer';
import TransformedTablePreviewDialog from '../../components/candidate-upload/TransformedTablePreviewDialog';
import ColumnMappingDialog from '../../components/candidate-upload/ColumnMappingDialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCandidatesForRequisition } from '@/api/candidate';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import { getFirstAndLastInitials } from '@/utils/transform';
import { CandidateProfile } from '@/interface/candidate';

interface ExtractedData {
  labels: string[];
  values: string[];
}

interface TransformedRecord {
  [key: string]: string;
}



const CandidateUploadPage = () => {
  const theme = useTheme()
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [isMappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [parsedData, setParsedData] = useState<ExtractedData[]>([]);
  const [transformedData, setTransformedData] = useState<TransformedRecord[]>([]);
  const [transformedHeaders, setTransformedHeaders] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([])
  
  const searchParams = useSearchParams();
  const requisitionId = searchParams.get('requisitionId') || 'dummy_requisition_id'; // Get requisitionId from URL
  const role = searchParams.get('role') || 'Role Name';
  const department = searchParams.get('department') || 'Department';

  const router = useRouter()
  const handleOpenUploadDialog = () => {
    if (!requisitionId) {
      alert('Please select a requisition first.');
      return;
    }
    setUploadDialogOpen(true);
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidates = await getCandidatesForRequisition(requisitionId);
        console.log('Fetched candidates:', candidates);
        setCandidates(candidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    fetchCandidates();
  }, [requisitionId]);

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  const handleFilesSelected = (files: FileList | null) => {
    setSelectedFiles(files);
  };

  const handleDataParsed = (data: ExtractedData[]) => {
    setParsedData(data);
    if (data.length > 0) {
      const transformed = transformData(data);
      setTransformedData(transformed);
      if (transformed.length > 0) {
        setTransformedHeaders(Object.keys(transformed[0]));
      }
    } else {
      setTransformedData([]);
      setTransformedHeaders([]);
    }
  };

  const handleNextFromUpload = () => {
    handleCloseUploadDialog();
    setPreviewDialogOpen(true);
  };

  const handleProceedFromPreview = () => {
    setPreviewDialogOpen(false);
    setMappingDialogOpen(true);
  };

  return (
    <Box sx={{ p: 4 }}>
        <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />} sx={{ mb: 2, color: theme.palette.text.secondary, textTransform: 'none' }}>
          Back to Requisitions
        </Button>
  

      <Typography variant="h4" gutterBottom>
        Candidate Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Manage candidates for this requisition
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e3f2fd' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{role}</Typography>
            <Typography variant="body2" color="text.secondary">{department}</Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary">Candidates Linked</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{candidates.length}</Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" >Candidates</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenUploadDialog}
          startIcon={<CloudUploadIcon />}
          disabled={!requisitionId}
        >
          Upload Candidates
        </Button>
      </Box>

      {/* Placeholder for Candidate Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="candidate table">
          <TableHead>
            <TableRow>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>CANDIDATE NAME</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>CONTACT</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>APPLIED DATE</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>EXPERIENCE</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>SOURCE</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight:'bold'}}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Example Rows - Replace with dynamic data */}
            {candidates.map((candidate) => (
              <TableRow key={candidate.candidate_id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', fontSize: '15px' }}>{getFirstAndLastInitials(candidate.candidate_name)}</Avatar>
                    <Typography variant="body1">{candidate.candidate_name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{candidate.email ? candidate.email : '---'}</Typography>
                  <Typography variant="body2" color="text.secondary">{candidate.mobile_number ? candidate.mobile_number : '---'}</Typography>
                </TableCell>
                <TableCell>Oct 15, 2023</TableCell>
                <TableCell>{candidate.total_experience_years? candidate.total_experience_years : '---'}</TableCell>
                <TableCell>{candidate.source ? candidate.source : '---'}</TableCell>
                <TableCell>{candidate.current_status && 
                    (<Chip 
                      {...getStatusChipProps(candidate.current_status)} 
                      size="small" 
                      sx={{ 
                        borderRadius: '6px', 
                        fontWeight: 500,
                        ...(getStatusChipProps(candidate.current_status).sx || {})
                      }}
                    />) 
                    || '---' 
                }</TableCell>
              </TableRow>
            ))}
            
          </TableBody>
        </Table>
      </TableContainer>

      <FileUploadDialog
        open={isUploadDialogOpen}
        onClose={handleCloseUploadDialog}
        onFilesSelected={handleFilesSelected}
        onDataParsed={handleDataParsed}
        selectedFiles={selectedFiles}
        onNext={handleNextFromUpload}
      />

      <TransformedTablePreviewDialog
        open={isPreviewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        transformedData={transformedData}
        onProceed={handleProceedFromPreview}
      />

      <ColumnMappingDialog
        open={isMappingDialogOpen}
        onClose={() => setMappingDialogOpen(false)}
        transformedHeaders={transformedHeaders}
        transformedData={transformedData}
        requisitionId={requisitionId}
      />
    </Box>
  );
};

export default CandidateUploadPage;
