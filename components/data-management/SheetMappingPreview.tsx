import React from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { SheetData } from '../../utils/historicalExcelParser';

interface DatabaseField {
  name: string;
  required: boolean;
}

interface SheetMappingPreviewProps {
  sheet: SheetData;
  columnMappings: {[dbField: string]: string | null};
  onMappingChange: (excelColumn: string, dbField: string) => void;
  databaseFields: DatabaseField[];
}

const SheetMappingPreview: React.FC<SheetMappingPreviewProps> = ({ sheet, columnMappings, onMappingChange, databaseFields }) => {
  const theme = useTheme();
  if (!sheet || sheet.data.length === 0) return <Typography>No data to preview.</Typography>;

  const headers = sheet.data[0];
  const firstRowData = sheet.data.length > 1 ? sheet.data[1] : []; // Get data for preview

  const isSheetFullyMapped = databaseFields.every(dbField => {
    if (dbField.required) {
      return Object.values(columnMappings).some(mappedHeader => mappedHeader === dbField.name);
    }
    return true;
  });

  const requisitionFields = databaseFields.filter(field =>
    ['Date of Request Received', 'Role', 'Department', 'Region', 'Hiring Manager', 'Expected Start Date', 'Status'].includes(field.name)
  );

  const candidateProfileFields = databaseFields.filter(field =>
    !['Date of Request Received', 'Role', 'Department', 'Region', 'Hiring Manager', 'Status'].includes(field.name)
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        {isSheetFullyMapped ? (
          <><CheckCircleOutlineIcon sx={{color: theme.palette.success.main}} /><Typography sx={{color: theme.palette.success.main}}>Sheet fully mapped ✓</Typography></>
        ) : (
          <><WarningAmberIcon sx={{color: theme.palette.error.main}} /><Typography sx={{color: theme.palette.error.main}}>Sheet not fully mapped (Required fields missing)</Typography></>
        )}
      </Box>
      
      <Accordion defaultExpanded sx={{ mt: 3, boxShadow: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Requisition Fields</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ width: '30%', fontWeight: 'bold', color: 'primary.contrastText' }}>Database Field</TableCell>
                  <TableCell sx={{ width: '40%', fontWeight: 'bold', color: 'primary.contrastText' }}>Your Excel Column</TableCell>
                  <TableCell sx={{ width: '30%', fontWeight: 'bold', color: 'primary.contrastText' }}>Preview Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisitionFields.map((dbField) => {
                  const mappedExcelColumn = columnMappings[dbField.name];
                  const previewValue = mappedExcelColumn ? firstRowData[headers.indexOf(mappedExcelColumn)] : '';

                  return (
                    <TableRow key={dbField.name} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, '&:hover': { backgroundColor: '#f0f0f0' } }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {dbField.name} {dbField.required && <Typography component="span" color="error.main" variant="caption">(Required)</Typography>}
                      </TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArrowForwardIcon sx={{ color: 'grey.500' }} />
                        <FormControl fullWidth size="small">
                          <InputLabel>{`Map to ${dbField.name}`}</InputLabel>
                          <Select
                            value={mappedExcelColumn || ''}
                            label={`Map to ${dbField.name}`}
                            onChange={(e) => onMappingChange(e.target.value as string, dbField.name)}
                          >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {headers.map((header: any, index: number) => (
                              <MenuItem key={index} value={String(header)}>{String(header)}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ fontStyle: 'italic', backgroundColor: '#e3f2fd' }}>
                        {previewValue ? (
                          <Typography variant="body2" color="text.secondary">{String(previewValue)}</Typography>
                        ) : (
                          <Box display="flex" alignItems="center" gap={0.5} color="error.main">
                            <WarningAmberIcon fontSize="small" />
                            <Typography variant="body2">No preview or unmapped</Typography>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{ mt: 3, boxShadow: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Candidate Profile Fields</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ width: '30%', fontWeight: 'bold', color: 'primary.contrastText' }}>Database Field</TableCell>
                  <TableCell sx={{ width: '40%', fontWeight: 'bold', color: 'primary.contrastText' }}>Your Excel Column</TableCell>
                  <TableCell sx={{ width: '30%', fontWeight: 'bold', color: 'primary.contrastText' }}>Preview Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidateProfileFields.map((dbField) => {
                  const mappedExcelColumn = columnMappings[dbField.name];
                  const previewValue = mappedExcelColumn ? firstRowData[headers.indexOf(mappedExcelColumn)] : '';

                  return (
                    <TableRow key={dbField.name} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, '&:hover': { backgroundColor: '#f0f0f0' } }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {dbField.name} {dbField.required && <Typography component="span" color="error.main" variant="caption">(Required)</Typography>}
                      </TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArrowForwardIcon sx={{ color: 'grey.500' }} />
                        <FormControl fullWidth size="small">
                          <InputLabel>{`Map to ${dbField.name}`}</InputLabel>
                          <Select
                            value={mappedExcelColumn || ''}
                            label={`Map to ${dbField.name}`}
                            onChange={(e) => onMappingChange(e.target.value as string, dbField.name)}
                          >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {headers.map((header: any, index: number) => (
                              <MenuItem key={index} value={String(header)}>{String(header)}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ fontStyle: 'italic', backgroundColor: '#e3f2fd' }}>
                        {previewValue ? (
                          <Typography variant="body2" color="text.secondary">{String(previewValue)}</Typography>
                        ) : (
                          <Box display="flex" alignItems="center" gap={0.5} color="error.main">
                            <WarningAmberIcon fontSize="small" />
                            <Typography variant="body2">No preview or unmapped</Typography>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SheetMappingPreview;
