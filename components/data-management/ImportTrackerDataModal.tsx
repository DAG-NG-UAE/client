"use client"
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel, Box, Typography, Input, FormControlLabel, Checkbox, Pagination, PaginationItem, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { readHistoricalExcelFile, SheetData } from '../../utils/historicalExcelParser';
import { DOCUMENT_TYPES, DATABASE_FIELDS_BY_DOCUMENT_TYPE } from '../../utils/constants';
import SheetMappingPreview from './SheetMappingPreview'; // Import the new component
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { uploadTrackerData } from '@/api/trackerUpload';

interface ImportTrackerDataModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = ['Upload File', 'Select Sheets', 'Preview & Map', 'Confirm Import'];

const ImportTrackerDataModal: React.FC<ImportTrackerDataModalProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<{[sheetName: string]: {[dbField: string]: string | null}}>({});
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>(DOCUMENT_TYPES.RECRUITMENT_TRACKER); // Default to Recruitment Tracker
  const [importResults, setImportResults] = useState<any>(null); // To store results from backend
  const [importError, setImportError] = useState<string | null>(null); // To store any import errors

  const handleNext = async () => {
    if (activeStep === 0 && !selectedFile) {
      alert('Please upload an Excel file first.');
      return;
    }
    if (activeStep === 0 && !selectedDocumentType) {
      alert('Please select a document type.');
      return;
    }
    if (activeStep === 1 && selectedSheets.length === 0) {
      alert('Please select at least one sheet.');
      return;
    }
    if (activeStep === 2) {
      const payload = getPayload();
      // console.log("Payload to send:", JSON.stringify(payload)); // For debugging, will be replaced with API call
      // TODO: Send payload to backend
    }
    if (activeStep === 3) {
      console.log('you got to phase 3 which is finish');
      const payload = getPayload();
      console.log("Sending payload to backend:", JSON.stringify(payload));
      try {
        setImportError(null); // Clear previous errors
        const results = await uploadTrackerData(payload);
        console.log("API response received:", results);
        setImportResults(results);
        setActiveStep((prevActiveStep) => prevActiveStep + 1); // Advance to results step
      } catch (error: any) {
        console.error("API error during upload:", error);
        setImportError(error.message || 'An unexpected error occurred during import.');
        setImportResults(null); // Clear previous results on error
        setActiveStep((prevActiveStep) => prevActiveStep + 1); // Still advance to results step to show error
      }
      return; // Prevent immediate next step, as we wait for API response
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(`active step is ${activeStep}`);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedFile(null);
    setSheetData([]);
    setSelectedSheets([]);
    setColumnMappings({});
    setCurrentSheetIndex(0);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        const data = await readHistoricalExcelFile(file);
        setSheetData(data);
        setSelectedSheets(data.map(sheet => sheet.name)); // Select all sheets by default

        // Initialize column mappings
        const initialMappings: {[sheetName: string]: {[dbField: string]: string | null}} = {};
        data.forEach(sheet => {
          if (sheet.data.length > 0) {
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

        console.log("Sheet Data:", data); // For debugging
      } catch (error) {
        console.error("Error reading excel file:", error);
        // TODO: Display error message to user
      }
    }
  };

  const handleSheetCheckboxChange = (sheetName: string) => {
    setSelectedSheets(prevSelectedSheets => {
      const newSelectedSheets = prevSelectedSheets.includes(sheetName)
        ? prevSelectedSheets.filter(name => name !== sheetName)
        : [...prevSelectedSheets, sheetName];
      
      // Reset currentSheetIndex if the currently viewed sheet is deselected
      if (!newSelectedSheets.includes(selectedSheets[currentSheetIndex])) {
        setCurrentSheetIndex(0);
      }
      return newSelectedSheets;
    });
  };

  const handleColumnMappingChange = (sheetName: string, excelColumn: string, dbField: string) => {
    setColumnMappings(prevMappings => ({
      ...prevMappings,
      [sheetName]: {
        ...prevMappings[sheetName],
        [dbField]: excelColumn, // Map dbField to excelColumn
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

  const currentSheetName = selectedSheets[currentSheetIndex];
  const currentSheetData = sheetData.find(s => s.name === currentSheetName);
  const currentDatabaseFields = DATABASE_FIELDS_BY_DOCUMENT_TYPE[selectedDocumentType] || [];

  const getPayload = () => {
    const payload: any = {
      tracking_filename: selectedFile?.name || "unknown_file.xlsx",
      sheets_to_process: [],
    };

    selectedSheets.forEach(sheetName => {
      const sheet = sheetData.find(s => s.name === sheetName);
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
          status_in_sheet: "closed", // Placeholder for now, will need to determine how to get this
          raw_data_rows: processedRows,
        });
      }
    });
    return payload;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Tracker Data</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Upload your Excel file.</Typography>
              <Input type="file" inputProps={{ accept: ".xlsx, .xls" }} onChange={handleFileChange} />
              {selectedFile && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Selected file: {selectedFile.name}
                </Typography>
              )}
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="document-type-select-label">Document Type</InputLabel>
                <Select
                  labelId="document-type-select-label"
                  value={selectedDocumentType}
                  label="Document Type"
                  onChange={(e) => setSelectedDocumentType(e.target.value as string)}
                >
                  {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Select the sheets to import.</Typography>
              {sheetData.length > 0 ? (
                sheetData.map((sheet) => (
                  <FormControlLabel
                    key={sheet.name}
                    control={
                      <Checkbox
                        checked={selectedSheets.includes(sheet.name)}
                        onChange={() => handleSheetCheckboxChange(sheet.name)}
                      />
                    }
                    label={sheet.name}
                  />
                ))
              ) : (
                <Typography>No sheets found or file not uploaded.</Typography>
              )}
            </Box>
          )}
          {activeStep === 2 && (
            <Box>
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
                  columnMappings={columnMappings[currentSheetName] || {}}
                  onMappingChange={(excelCol, dbField) => handleColumnMappingChange(currentSheetName, excelCol, dbField)}
                  databaseFields={currentDatabaseFields}
                />
              )}
              
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
            </Box>
          )}
          {activeStep === 3 && ( // Confirm Import step
            <Box>
              <Typography variant="h6" gutterBottom>Confirm Import</Typography>
              <Typography variant="body1">Click 'Finish' to finalize the import process.</Typography>
            </Box>
          )}
          {activeStep === 4 && ( // This is the new final step after API call
            <Box>
              <Typography variant="h6" gutterBottom>Import Results</Typography>
              {importError && (
                <Typography color="error" sx={{ mt: 2 }}>Error: {importError}</Typography>
              )}
              {importResults && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">Import completed successfully!</Typography>
                  <Typography variant="body1">Requisitions created: {importResults.requisitionsCreated || 0}</Typography>
                  <Typography variant="body1">Candidate profiles generated: {importResults.candidateProfilesGenerated || 0}</Typography>
                  {/* Add more details from importResults as needed */}
                </Box>
              )}
              {!importError && !importResults && (
                <Typography variant="body1">Importing data...</Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportTrackerDataModal;
