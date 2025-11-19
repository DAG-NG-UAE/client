"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FileUploadDialog from '../../components/candidate-upload/FileUploadDialog';
// import ColumnMappingSection from '../../components/candidate-upload/ColumnMappingSection';
import { transformData } from '../../utils/dataTransformer';
import TransformedTablePreviewDialog from '../../components/candidate-upload/TransformedTablePreviewDialog';
import ColumnMappingDialog from '../../components/candidate-upload/ColumnMappingDialog';
import { useSearchParams } from 'next/navigation';

interface ExtractedData {
  labels: string[];
  values: string[];
}

interface TransformedRecord {
  [key: string]: string;
}

const CandidateUploadPage = () => {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [isMappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [parsedData, setParsedData] = useState<ExtractedData[]>([]);
  const [transformedData, setTransformedData] = useState<TransformedRecord[]>([]);
  const [transformedHeaders, setTransformedHeaders] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const requisitionId = searchParams.get('requisitionId') || 'dummy_requisition_id'; // Get requisitionId from URL

  const handleOpenUploadDialog = () => {
    if (!requisitionId) {
      alert('Please select a requisition first.');
      return;
    }
    setUploadDialogOpen(true);
  };

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
      <Typography variant="h5" gutterBottom>
        Candidate Upload for Requisition: {requisitionId}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenUploadDialog} sx={{ mt: 2 }} disabled={!requisitionId}>
        Upload Candidate Profile
      </Button>

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
