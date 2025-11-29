"use client";
import React, { useState } from 'react';
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, Button, IconButton, FormControl, InputLabel, Select, MenuItem,
  LinearProgress, Checkbox, FormControlLabel, Paper, Tooltip,
  PaginationItem,
  Pagination,
  Chip,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTheme } from '@mui/material/styles';
import FileIcon from '@mui/icons-material/FileCopyRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { readHistoricalExcelFile, SheetData } from '@/utils/historicalExcelParser';
import { DATABASE_FIELDS_BY_DOCUMENT_TYPE, DOCUMENT_TYPES } from '@/utils/constants';
import SheetMappingPreview from '../data-management/SheetMappingPreview';

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
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>(DOCUMENT_TYPES.RECRUITMENT_TRACKER)
  const [columnMappings, setColumnMappings] = useState<{[sheetName: string]: {[dbField: string]: string | null}}>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState<{requisitions: number, candidates: number} | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      try{ 

            console.log(`we uploaded file => ${selectedFile}`)
            const data = await readHistoricalExcelFile(event.target.files?.[0])
            setDetectedSheets(data)
            console.log(`the data is => ${JSON.stringify(data)}`)

            // Initialize column mappings
            const initialMappings: {[sheetName: string]: {[dbField: string]: string | null}} = {};
            data.forEach(sheet => {
            if (sheet!.data.length > 0) {
                const headers = sheet!.data[0];
                initialMappings[sheet.name] = {};
                const currentDocumentFields = DATABASE_FIELDS_BY_DOCUMENT_TYPE[selectedDocumentType] || [];
                currentDocumentFields.forEach(dbField => {
                const matchingHeader = headers.find((header: any) => String(header) === dbField.name);
                if (matchingHeader) {
                    initialMappings[sheet.name][dbField.name] = String(matchingHeader);
                } else {
                    initialMappings[sheet.name][dbField.name] = null; // No mapping by default
                }
                });
            }
            });
            setColumnMappings(initialMappings);
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

    if (activeStep === steps.length - 1) {
        handleProcessImport();
    } else {
        setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSheetToggle = (sheetName: string) => {
    setSelectedSheets(prev => {
        const newSelectedSheets = prev.includes(sheetName)
        ? prev.filter((name) => name !== sheetName)
        : [...prev, sheetName]

         // Reset currentSheetIndex if the currently viewed sheet is deselected
       if (!newSelectedSheets.includes(selectedSheets[currentSheetIndex])) {
         setCurrentSheetIndex(0);
       }
         return newSelectedSheets
    });
  };

  const handleSelectAllSheets = () => {
    setSelectedSheets(detectedSheets.map(sheet => sheet.name));
  };

  const handleDeselectAllSheets = () => {
    setSelectedSheets([]);
  };

  const handleColumnMappingChange = (sheetName: string, excelColumn: string, dbField: string) => {
    setColumnMappings(prevMappings => ({
      ...prevMappings,
      [sheetName]: {
        ...prevMappings[sheetName],
        [dbField]: excelColumn,
      },
    }));
  };

  const isSheetFullyMapped = (sheetName: string): boolean => {
    const sheetMappings = columnMappings[sheetName];
    if (!sheetMappings) return false;
    const currentDocumentFields = DATABASE_FIELDS_BY_DOCUMENT_TYPE[selectedDocumentType] || [];
    // Check if every REQUIRED DATABASE_FIELD has a corresponding mapping from an Excel column
    return currentDocumentFields.every(dbField => {
      if (dbField.required) {
        return Object.values(sheetMappings).includes(dbField.name);
      }
      return true; // Non-required fields don't prevent full mapping
    });
  };

  const steps = ['Upload', 'Select Sheets', 'Map Columns', 'Result'];

  const currentSheetName = selectedSheets[currentSheetIndex];
  const currentSheetData = detectedSheets.find(s => s.name === currentSheetName);
  const currentDatabaseFields = DATABASE_FIELDS_BY_DOCUMENT_TYPE[selectedDocumentType] || [];

  const getPayload = () => {
    const payload: any = {
      tracking_filename: selectedFile?.name || "unknown_file.xlsx",
      sheets_to_process: [],
    };

    selectedSheets.forEach(sheetName => {
      const sheet = detectedSheets.find(s => s.name === sheetName);
      if (sheet && sheet.data.length > 1) { // Ensure there's header and at least one data row
        const headers = sheet.data[0].map(header => String(header)); // Get actual headers from Excel
        const rows = sheet.data.slice(1); // Get data rows, excluding header

        const processedRows = rows.map(row => {
          const newRow: { [key: string]: any } = {};
          currentDatabaseFields.forEach(dbField => {
            const mappedExcelColumn = columnMappings[sheetName]?.[dbField.name];
            if (mappedExcelColumn) {
              const headerIndex = headers.indexOf(mappedExcelColumn);
              if (headerIndex !== -1 && row[headerIndex] !== undefined) {
                newRow[dbField.name === "Location" ? "location" : dbField.name] = row[headerIndex]; // Apply 'location' mapping if needed
              }
            }
          });
          return newRow;
        });

        payload.sheets_to_process.push({
          sheet_name: sheetName,
          status_in_sheet: "closed", //TODO determine how to get the actual status in the sheet
          raw_data_rows: processedRows,
        });
      }
    });
    return payload;
  };

  const handleProcessImport = async () => {
    setIsProcessing(true);
    setImportError(null);
    setImportSuccess(null);

    const payload = getPayload();
    console.log("Payload for backend:", JSON.stringify(payload, null, 2));

    // Simulate API call
    try {
      // Replace with actual API call to your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      // Simulate a successful response
      setImportSuccess({ requisitions: 45, candidates: 234 });
      setActiveStep(steps.length - 1); // Move to the result step
    } catch (error) {
      console.error("Error during import:", error);
      setImportError(`Failed to import data: ${error instanceof Error ? error.message : String(error)}`);
      setActiveStep(steps.length - 1); // Move to the result step even on error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadAnotherFile = () => {
    setActiveStep(0);
    setSelectedFile(null);
    setDataType('Recruitment Tracker');
    setDetectedSheets([]);
    setSelectedSheets([]);
    setCurrentSheetIndex(0);
    setSelectedDocumentType(DOCUMENT_TYPES.RECRUITMENT_TRACKER);
    setColumnMappings({});
    setIsProcessing(false);
    setImportSuccess(null);
    setImportError(null);
  };

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
                    // onChange={() => handleSheetToggle(sheet.name)}
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
            <>
            <Typography variant="h6" gutterBottom>Preview Data and Map Fields</Typography>
              <Box sx={{ mb: 2 }}>
                {selectedSheets.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedSheets.map((sheetName) => (
                      <Chip
                        key={sheetName}
                        label={sheetName}
                        color={isSheetFullyMapped(sheetName) ? "success" : "default"}
                        icon={isSheetFullyMapped(sheetName) ? <CheckCircleOutlineIcon /> : undefined}
                        variant={currentSheetName === sheetName ? "filled" : "outlined"}
                        onClick={() => setCurrentSheetIndex(selectedSheets.indexOf(sheetName))}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography>No sheets selected for preview.</Typography>
                )}
              </Box>

            {currentSheetData && (
                <SheetMappingPreview
                sheet={currentSheetData}
                columnMappings={columnMappings[currentSheetName]}
                onMappingChange={(excelCol, dbField) => handleColumnMappingChange(currentSheetName, excelCol, dbField)}
                databaseFields={currentDatabaseFields}
    
                >
    
                </SheetMappingPreview>
            )}

            {/* Pagination */}
            {selectedSheets.length > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={selectedSheets.length}
                    page={currentSheetIndex + 1}
                    onChange={(event, value) => setCurrentSheetIndex(value - 1)}
                    renderItem={(item) => (
                      <PaginationItem
                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                        {...item}
                      />
                    )}
                  />
                </Box>
              )}
            </>
            
            
        )
        
        
      case 3: // Result Step
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {isProcessing && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress />
                <Typography variant="h6">Processing Import...</Typography>
                <Typography variant="body2" color="text.secondary">This may take a few moments.</Typography>
              </Box>
            )}

            {!isProcessing && importSuccess && (
              <>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Import Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Your historical data has been successfully imported and is now available in the system
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', width: 200, bgcolor:'#DBEAFE', color: '#2D5BFF'}}>
                    <DescriptionIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="body2" color="primary">Requisitions Imported</Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>{importSuccess.requisitions}</Typography>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', width: 200, bgcolor: '#F3E8FF', color: '#7E22CE', borderColor: theme.palette.secondary.main }}>
                    <PeopleIcon sx={{ fontSize: 40,  mb: 1 }} />
                    <Typography variant="body2" >Candidates Imported</Typography>
                    <Typography variant="h5"  sx={{ fontWeight: 'bold' }}>{importSuccess.candidates}</Typography>
                  </Paper>
                  
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, mb: 4 }}>
                    <Button variant="contained"  fullWidth color="primary" sx={{ mb: 2 }} onClick={onClose}>
                    View Imported Data <ArrowForwardIcon sx={{ ml: 1 }} />
                    </Button>
                    <Button variant="outlined" onClick={handleUploadAnotherFile}>
                    Upload Another File
                    </Button>
                </Box>
              </>
            )}

            {!isProcessing && importError && (
              <>
                <ErrorOutlineIcon sx={{ fontSize: 80, color: theme.palette.error.main, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Import Failed
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  {importError}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleUploadAnotherFile}>
                  Try Again
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Close
                </Button>
              </>
            )}
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
      
      {importSuccess && (
        <LinearProgress variant="determinate" value={(activeStep / (steps.length - 1)) * 100} sx={{ height: 8, backgroundColor: theme.palette.grey[200], '& .MuiLinearProgress-bar': { backgroundColor: theme.palette.primary.main } }} />
      )}
      
      <DialogContent dividers sx={{ p: 3 }}>
        {isProcessing && importSuccess && (
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
        )}
        
        {renderStepContent(activeStep)}
        
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Box>
          {activeStep > 0 && activeStep < steps.length - 1 && (
            <Button onClick={handleBack} sx={{ mr: 1 }} variant="outlined">Back</Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext} variant="contained" disabled={isProcessing} >
              Next
            </Button>
          )}
          {activeStep === steps.length - 1 && !importSuccess && !importError && (
            <Button onClick={handleNext} variant="contained" disabled={isProcessing}>
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Process Import'}
            </Button>
          )}
           {activeStep === steps.length - 1 && (importSuccess || importError) && (
            <Button onClick={onClose} variant="contained">
             Close
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UploadHistoricalDataModal;
