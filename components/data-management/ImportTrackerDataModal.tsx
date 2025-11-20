"use client"
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel, Box, Typography, Input, FormControlLabel, Checkbox, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { readHistoricalExcelFile, SheetData } from '../../utils/historicalExcelParser';
import { DATABASE_FIELDS } from '../../utils/constants';

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
  const [columnMappings, setColumnMappings] = useState<{[sheetName: string]: {[excelColumn: string]: string}}>({});

  const handleNext = () => {
    if (activeStep === 0 && !selectedFile) {
      alert('Please upload an Excel file first.');
      return;
    }
    if (activeStep === 1 && selectedSheets.length === 0) {
      alert('Please select at least one sheet.');
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
        const initialMappings: {[sheetName: string]: {[excelColumn: string]: string}} = {};
        data.forEach(sheet => {
          if (sheet.data.length > 0) {
            const headers = sheet.data[0];
            initialMappings[sheet.name] = {};
            headers.forEach((header: any) => {
              const headerStr = String(header);
              // Attempt to auto-map based on exact match with DATABASE_FIELDS
              if (DATABASE_FIELDS.includes(headerStr)) {
                initialMappings[sheet.name][headerStr] = headerStr;
              } else {
                initialMappings[sheet.name][headerStr] = ''; // No mapping by default
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
    setSelectedSheets(prevSelectedSheets =>
      prevSelectedSheets.includes(sheetName)
        ? prevSelectedSheets.filter(name => name !== sheetName)
        : [...prevSelectedSheets, sheetName]
    );
  };

  const handleColumnMappingChange = (sheetName: string, excelColumn: string, dbField: string) => {
    setColumnMappings(prevMappings => ({
      ...prevMappings,
      [sheetName]: {
        ...prevMappings[sheetName],
        [excelColumn]: dbField,
      },
    }));
  };

  const getSheetPreview = (sheetName: string) => {
    const sheet = sheetData.find(s => s.name === sheetName);
    if (!sheet || sheet.data.length === 0) return <Typography>No data to preview.</Typography>;

    const headers = sheet.data[0];
    const rows = sheet.data.slice(1, 6); // Display first 5 rows of data

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small" aria-label={`${sheetName} preview table`}>
          <TableHead>
            <TableRow>
              {headers.map((header: any, index: number) => (
                <TableCell key={index}>{String(header)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any[], rowIndex: number) => (
              <TableRow key={rowIndex}>
                {row.map((cell: any, cellIndex: number) => (
                  <TableCell key={cellIndex}>{String(cell)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Map Columns to Database Fields:</Typography>
          {headers.map((header: any, index: number) => {
            const excelColumnName = String(header);
            const currentMapping = columnMappings[sheetName]?.[excelColumnName] || '';
            return (
              <FormControl fullWidth sx={{ mt: 1 }} key={index}>
                <InputLabel>{excelColumnName}</InputLabel>
                <Select
                  value={currentMapping}
                  label={excelColumnName}
                  onChange={(e) => handleColumnMappingChange(sheetName, excelColumnName, e.target.value as string)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {DATABASE_FIELDS.map((field) => (
                    <MenuItem key={field} value={field}>
                      {field}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}
        </Box>
      </TableContainer>
    );
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
              {selectedSheets.length > 0 ? (
                selectedSheets.map((sheetName) => (
                  <Box key={sheetName} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Sheet: {sheetName}</Typography>
                    {getSheetPreview(sheetName)}
                  </Box>
                ))
              ) : (
                <Typography>No sheets selected for preview.</Typography>
              )}
            </Box>
          )}
          {activeStep === 3 && <Typography>Step 4: Confirm import.</Typography>}
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
