// import React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Typography,
//   Box,
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
// } from '@mui/material';
// import { getStatusChipProps } from '@/utils/statusColorMapping';
// import { EditDocument, MoreVert, Visibility, Edit } from '@mui/icons-material';
// import { useState } from 'react';
// import { Requisition } from '@/interface/requisition';
// import Link from 'next/link';
// import { getRelativeTime } from '@/utils/transform';






// const RequisitionTable = ({requisitions}: {requisitions: Partial<Requisition>[]}) => {
//   return (
//     <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
//       <Table sx={{ minWidth: 650 }} aria-label="requisition table">
//         <TableHead>
//           <TableRow sx={{ backgroundColor: 'background.default' }}>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>POSITION</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>DEPARTMENT</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>REQUESTER</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>LOCATION</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>DAYS OPEN</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>FILLED</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>STATUS</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>PUBLISH</TableCell>
//             <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>ACTION</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {requisitions.map((row) => (
//             <TableRow
//               key={row.requisition_id}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               <TableCell>
//                 <Box>
//                   <Typography variant="body2" fontWeight="500">
//                     {row.position}
//                   </Typography>
//                 </Box>
//               </TableCell>
//               <TableCell>{row.department}</TableCell>
//               <TableCell>{row.requisition_raised_by}</TableCell>
//               <TableCell>{row.locations}</TableCell>
//               <TableCell>{getRelativeTime( row.submitted_date!, 'days')}</TableCell>
//               <TableCell sx={{ color: 'text.secondary' }}>{row.num_filled}/{row.num_positions}</TableCell>
//               <TableCell>
//               <Chip 
//                   {...getStatusChipProps(row.status)} 
//                   size="small" 
//                   sx={{ 
//                     borderRadius: '6px', 
//                     fontWeight: 500,
//                     ...(getStatusChipProps(row.status).sx || {})
//                   }}
//                 />
//               </TableCell>
//               <TableCell>
//                 <Button 
//                   variant="outlined"
//                   size='small'
//                   disabled={row.current_job_description_id == null}
//                   sx={{
//                     fontWeight: 500,
//                     borderRadius: '6px',
//                   }}>
//                   {row.current_job_description_id == null ? 'Publish' : 'Unpublish'}
//                 </Button>
//               </TableCell>
//               <TableCell>
//                 <RowActions requisition={row} />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default RequisitionTable;
