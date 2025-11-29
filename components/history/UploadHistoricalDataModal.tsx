"use client";
import React, { useState } from 'react';
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, Button, IconButton, FormControl, InputLabel, Select, MenuItem,
  LinearProgress, Checkbox, FormControlLabel, Paper, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTheme } from '@mui/material/styles';
import FileIcon from '@mui/icons-material/FileCopyRounded';
import { readHistoricalExcelFile, SheetData } from '@/utils/historicalExcelParser';

interface UploadHistoricalDataModalProps {
  open: boolean;
  onClose: () => void;
}


const UploadHistoricalDataModal = ({ open, onClose }: UploadHistoricalDataModalProps) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState('Recruitment Tracker');
  const [detectedSheets, setDetectedSheets] = useState<SheetData[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      try{ 

        console.log(`we uploaded file => ${selectedFile}`)
            const data = await readHistoricalExcelFile(event.target.files?.[0])
            setDetectedSheets(data)
            console.log(`the data is => ${JSON.stringify(data)}`)
      }catch(error){ 
        console.error("Error reading excel file:", error);
        // TODO: show the user that there was an error when reading the excel sheet
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedFile) {
      alert('Please upload an Excel file.');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSheetToggle = (sheetName: string) => {
    setSelectedSheets((prev) => 
      prev.includes(sheetName)
        ? prev.filter((name) => name !== sheetName)
        : [...prev, sheetName]
    );
  };

  const handleSelectAllSheets = () => {
    setSelectedSheets(detectedSheets.map(sheet => sheet.name));
  };

  const handleDeselectAllSheets = () => {
    setSelectedSheets([]);
  };

  const steps = ['Upload', 'Select Sheets', 'Map Columns', 'Confirm'];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Upload Excel File
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Upload Excel File
            </Typography>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input
                type="file"
                id="file-upload-input"
                hidden
                onChange={handleFileChange}
                accept=".xlsx,.xls"
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Drag and drop your Excel file here, or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported formats: .xlsx, .xls (Max 50MB)
              </Typography>
              
            </Box>
            <Box sx={{mb: 3}}>
                {selectedFile && (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#eff6ff', borderRadius:1, height: theme.spacing(10), width: '100%', p: 1}}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:theme.palette.primary.main, ml:1, height: theme.spacing(6.25), width: theme.spacing(6.25), borderRadius: 1}}>
                            <FileIcon sx={{color: theme.palette.icons?.container}}></FileIcon>
                        </Box>
                        
                    <Typography variant="body2">
                        {selectedFile.name}
                    </Typography>
                    </Box>
                )}
            </Box>
            

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="data-type-label">Data Type</InputLabel>
              <Select
                labelId="data-type-label"
                value={dataType}
                label="Data Type"
                onChange={(e) => setDataType(e.target.value as string)}
              >
                <MenuItem value="Recruitment Tracker">Recruitment Tracker</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 1: // Select Sheets to Import
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Select Sheets to Import
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We detected {detectedSheets.length} sheets in your Excel file. Select which sheets you want to import.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button onClick={handleSelectAllSheets}>Select All</Button>
              <Button disabled={selectedSheets.length < 1} onClick={handleDeselectAllSheets}>Deselect All</Button>
            </Box>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', border: `1px solid ${theme.palette.divider}`}}>
              {detectedSheets.map((sheet) => (
                <Paper 
                  key={sheet.name} 
                  sx={{
                    p: 2, mb: 1, 
                    display: 'flex', alignItems: 'center', 
                    gap: 1, 
                    border: selectedSheets.includes(sheet.name) ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                    backgroundColor: selectedSheets.includes(sheet.name) ? theme.palette.action.selected : 'inherit',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSheetToggle(sheet.name)}
                >
                  <Checkbox 
                    checked={selectedSheets.includes(sheet.name)}
                    onChange={() => handleSheetToggle(sheet.name)}
                    name={sheet.name}
                    color="primary"
                  />
                  <DescriptionIcon sx={{ color: theme.palette.success.main }} /> {/* Placeholder icon */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{sheet.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{sheet.totalRows} rows</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        );
      case 2: // Map Columns (placeholder)
        return (
          <Box>
            <Typography variant="h6">Map Columns</Typography>
            <Typography>This is where you would map columns.</Typography>
          </Box>
        );
      case 3: // Confirm (placeholder)
        return (
          <Box>
            <Typography variant="h6">Confirm</Typography>
            <Typography>This is the confirmation step.</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Upload Historical Data</Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <LinearProgress variant="determinate" value={(activeStep / (steps.length - 1)) * 100} sx={{ height: 8, backgroundColor: theme.palette.grey[200], '& .MuiLinearProgress-bar': { backgroundColor: theme.palette.primary.main } }} />
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
          {steps.map((label, index) => (
            <Typography 
              key={label} 
              variant="body2" 
              color={index <= activeStep ? 'primary' : 'text.disabled'} 
              sx={{ fontWeight: index <= activeStep ? 'bold' : 'normal' }}
            >
              {label}{index < steps.length - 1 ? ' >' : ''}
            </Typography>
          ))}
        </Box>
        {renderStepContent(activeStep)}
        
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Box>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }} variant="outlined">Back</Button>
          )}
          <Button onClick={handleNext} variant="contained" >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UploadHistoricalDataModal;
