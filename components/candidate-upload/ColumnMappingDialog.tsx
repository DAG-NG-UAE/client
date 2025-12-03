import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DATABASE_FIELDS } from '../../utils/constants';
import { uploadCandidates } from '../../api/candidateUploadApi';

interface TransformedRecord {
  [key: string]: string;
}

interface ColumnMappingDialogProps {
  open: boolean;
  onClose: () => void;
  transformedHeaders: string[];
  transformedData: TransformedRecord[];
  requisitionId: string; // New prop for requisition ID
}

const ColumnMappingDialog: React.FC<ColumnMappingDialogProps> = ({
  open,
  onClose,
  transformedHeaders,
  transformedData,
  requisitionId, // Destructure new prop
}) => {
  const [mapping, setMapping] = useState<{ [key: string]: string }>({});
  const [saveAsDefault, setSaveAsDefault] = useState<boolean>(false);
  const [isMappingValid, setIsMappingValid] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const firstTransformedRow = transformedData.length > 0 ? transformedData[0] : {};

  useEffect(() => {
    if (open) {
      const initialMapping: { [key: string]: string } = {};
      DATABASE_FIELDS.forEach(dbField => {
        const savedSource = mapping[dbField];
        if (savedSource && transformedHeaders.includes(savedSource)) {
          initialMapping[dbField] = savedSource;
        } else if (transformedHeaders.includes(dbField)) {
          initialMapping[dbField] = dbField;
        }
      });
      setMapping(prev => ({ ...prev, ...initialMapping }));
    }
  }, [open, transformedHeaders]);

  useEffect(() => {
    const allRequiredFieldsMapped = DATABASE_FIELDS.every(dbField => mapping[dbField]);
    setIsMappingValid(allRequiredFieldsMapped);
  }, [mapping]);

  const handleMappingChange = (dbField: string, sourceHeader: string) => {
    setMapping(prev => ({ ...prev, [dbField]: sourceHeader }));
  };

  const handleFinish = async () => {
    if (saveAsDefault) {
      localStorage.setItem('defaultColumnMapping', JSON.stringify(mapping));
    }

    const dataToImport = transformedData.map(record => {
      const newRecord: TransformedRecord = {};
      for (const dbField of DATABASE_FIELDS) {
        const sourceHeader = mapping[dbField];
        if (sourceHeader && record[sourceHeader] !== undefined) {
          newRecord[dbField] = record[sourceHeader];
        } else {
          newRecord[dbField] = ''; // Assign empty string for unmapped or missing data
        }
      }
      return newRecord;
    });

    try {
      console.log(`the data they are saving to the database is ${JSON.stringify(dataToImport)} for req ${requisitionId}`)
      const result = await uploadCandidates({ data: dataToImport, requisitionId }); // Pass requisitionId
      console.log('API Response:', result);

      setSnackbarSeverity('success');
      setSnackbarMessage('Candidate data imported successfully!');
      setSnackbarOpen(true);
      onClose(); // Close dialog on success
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage(`Error importing data: ${(error as Error).message || 'Unknown error'}`);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const mappedFieldsCount = DATABASE_FIELDS.filter(dbField => mapping[dbField]).length;
  const remainingFieldsCount = DATABASE_FIELDS.length - mappedFieldsCount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center">
          <MapIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="span">Step 3: Column Mapping</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          {remainingFieldsCount > 0 ? (
            <>
              <WarningAmberIcon color="error" />
              <Typography color="error.main">{remainingFieldsCount} required fields remaining</Typography>
            </>
          ) : (
            <>
              <CheckCircleOutlineIcon color="success" />
              <Typography color="success.main">{mappedFieldsCount} required fields mapped ✓</Typography>
            </>
          )}
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 2, mt: 3 }}>
          <Table size="small">
            <TableBody>
              {DATABASE_FIELDS.map(dbField => {
                const isMapped = !!mapping[dbField];
                const isPreviewAvailable = isMapped && firstTransformedRow[mapping[dbField]];

                return (
                  <TableRow key={dbField} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, '&:hover': { backgroundColor: '#f0f0f0' } }}>
                    {/* Column 1: What We Need */}
                    <TableCell sx={{ width: '30%', fontWeight: 'bold', color: isMapped ? 'inherit' : 'error.main' }}>
                      {dbField} <span style={{ color: 'red' }}>*</span>
                    </TableCell>

                    {/* Column 2: Your Excel Columns (Dropdown with Arrow) */}
                    <TableCell sx={{ width: '60%', ml:2, display: 'flex', alignItems: 'center', gap: 1}}>
                      <ArrowForwardIcon sx={{ color: 'grey.500' }} />
                      <FormControl fullWidth size="medium" error={!isMapped} color='info'>
                        <InputLabel>{`Map to ${dbField}`}</InputLabel>
                        <Select
                          value={mapping[dbField] || ''}
                          label={`Map to ${dbField}`}
                          onChange={(e) => handleMappingChange(dbField, e.target.value as string)}
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          {transformedHeaders.map(header => (
                            <MenuItem key={header} value={header}>
                              {header}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {isMapped ? (
                        <CheckCircleOutlineIcon color="success" sx={{ ml: 1 }} />
                      ) : (
                        <WarningAmberIcon color="error" sx={{ ml: 1 }} />
                      )}
                    </TableCell>

                    {/* Column 3: Preview */}
                    <TableCell sx={{ width: '30%', backgroundColor: '#e3f2fd', fontStyle: 'italic' }}>
                      {isPreviewAvailable ? (
                        <Typography variant="body2" color="text.secondary">
                          {firstTransformedRow[mapping[dbField]]}
                        </Typography>
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
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFinish}
          disabled={!isMappingValid}
        >
          Finish
        </Button>
      </DialogActions>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ColumnMappingDialog;
