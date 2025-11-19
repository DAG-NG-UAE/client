import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';

interface TransformedRecord {
  [key: string]: string;
}

interface TransformedTablePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  transformedData: TransformedRecord[];
  onProceed: () => void;
}

const TransformedTablePreviewDialog: React.FC<TransformedTablePreviewDialogProps> = ({
  open,
  onClose,
  transformedData,
  onProceed,
}) => {
  const transformedHeaders = transformedData.length > 0 ? Object.keys(transformedData[0]) : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center">
          <TableChartIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="span">Step 2: Transformed Data Preview</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {transformedData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small" aria-label="transformed data preview table">
              <TableHead>
                <TableRow>
                  {transformedHeaders.map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transformedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {transformedHeaders.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No transformed data to preview.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onProceed} variant="contained" color="primary">
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransformedTablePreviewDialog;
