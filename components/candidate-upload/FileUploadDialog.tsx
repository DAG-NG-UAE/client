import React, { ChangeEvent, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, List, ListItem, ListItemText, Alert, CircularProgress, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { readExcelFile } from '../../utils/excelParser';

interface ExtractedData {
  labels: string[];
  values: string[];
}

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFilesSelected: (files: FileList | null) => void;
  selectedFiles: FileList | null;
  onDataParsed: (data: ExtractedData[]) => void;
  onNext: () => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onFilesSelected,
  selectedFiles,
  onDataParsed,
  onNext,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length < 1 || files.length > 5) {
        setError('Please select between 1 and 5 files.');
        onFilesSelected(null);
        onDataParsed([]);
      } else {
        setError(null);
        onFilesSelected(files);
        setLoading(true);
        try {
          const parsedDataPromises = Array.from(files).map(file => readExcelFile(file));
          const allParsedData = await Promise.all(parsedDataPromises);
          onDataParsed(allParsedData);
        } catch (parseError) {
          setError('Error parsing files. Please ensure they are valid Excel/CSV formats.');
          onDataParsed([]);
        } finally {
          setLoading(false);
        }
      }
    } else {
      onFilesSelected(null);
      onDataParsed([]);
    }
  };

  const isNextButtonEnabled = selectedFiles && selectedFiles.length > 0 && !error && !loading;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center">
          <CloudUploadIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="span">Step 1: File Upload</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please select 1 to 5 Excel (.xlsx, .xls, .csv) files to upload.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="contained" component="label" disabled={loading} color="primary">
            Select Files
            <input type="file" hidden multiple accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
          </Button>
          {loading && <CircularProgress size={24} />}
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {selectedFiles && selectedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Selected Files:</Typography>
            <List>
              {Array.from(selectedFiles).map((file, index) => (
                <ListItem key={index}>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onNext} disabled={!isNextButtonEnabled} sx={{ color: isNextButtonEnabled ? 'primary.main' : 'grey.500' }}>
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;
