import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import { EditDocument, MoreVert, Visibility, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { Requisition } from '@/interface/requisition';
import Link from 'next/link';




const RowActions = ({ requisition }: { requisition: Partial<Requisition> }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id={`action-button-${requisition.requisition_id}`}
        aria-controls={open ? `action-menu-${requisition.requisition_id}` : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={`action-menu-${requisition.requisition_id}`}
        MenuListProps={{
          'aria-labelledby': `action-button-${requisition.requisition_id}`,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
            elevation: 1,
            sx: {
                minWidth: 180,
                mt: 1,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1,
                    mx: 1,
                    my: 0.5,
                    typography: 'body2',
                    fontWeight: 500
                }
            }
        }}
      >
        <MenuItem onClick={handleClose} component={Link} href={`/requisition/${requisition.requisition_id}`}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Requisition</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href={`/requisition/${requisition.requisition_id}/edit`}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Requisition</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const RequisitionTable = ({requisitions}: {requisitions: Partial<Requisition>[]}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table sx={{ minWidth: 650 }} aria-label="requisition table">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.default' }}>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>POSITION</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>DEPARTMENT</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>REQUESTER</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>REQUEST DATE</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>STATUS</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>APPLICANTS</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>PUBLISH</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requisitions.map((row) => (
            <TableRow
              key={row.requisition_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="500">
                    {row.position}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>{row.requisition_raised_by}</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{row?.submitted_date?.split('T')[0]}</TableCell>
              <TableCell>
              <Chip 
                  {...getStatusChipProps(row.status)} 
                  size="small" 
                  sx={{ 
                    borderRadius: '6px', 
                    fontWeight: 500,
                    ...(getStatusChipProps(row.status).sx || {})
                  }}
                />
              </TableCell>
              <TableCell>{row.applicants}</TableCell>
              <TableCell>
                <Button 
                  variant="outlined"
                  size='small'
                  disabled={row.current_job_description_id == null}
                  sx={{
                    fontWeight: 500,
                    borderRadius: '6px',
                  }}>
                  {row.current_job_description_id == null ? 'Publish' : 'Unpublish'}
                </Button>
              </TableCell>
              <TableCell>
                <RowActions requisition={row} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequisitionTable;
