import { CandidateProfile } from "@/interface/candidate"
import { getStatusChipProps } from "@/utils/statusColorMapping"
import { getFirstAndLastInitials } from "@/utils/transform"
import { Avatar, Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material"


const CandidateModal = () => { 
    return (
        <p>
            Open the candidate modal here 
        </p>
    )
}

const CandidateTable = ({candidates}: {candidates: Partial<CandidateProfile>[]}) => { 
    const theme = useTheme();
    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>

        <Table sx={{ minWidth: 'max-content'}} aria-label="candidate table">
          <TableHead>
            <TableRow sx={{backgroundColor: theme.palette.background.default}}>
              <TableCell sx={{color:"text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 4, py: 1}}>CANDIDATE</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 4, py: 1}}>CONTACT</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 4, py: 1}}>POSITION</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 4, py: 1}}>DEPARTMENT</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 4, py: 1}}>APPLIED DATE</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 4, py: 1}}>EXPERIENCE</TableCell>
              <TableCell sx={{color:"text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 4, py: 1}}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Example Rows - Replace with dynamic data */}
            {candidates.map((candidate) => (
              <TableRow key={candidate.candidate_id} sx={{cursor: 'pointer'}}>
                <TableCell component="th" scope="row" sx={{whiteSpace: 'nowrap', px: 4}}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', fontSize: '15px' }}>{candidate.candidate_name ? getFirstAndLastInitials(candidate.candidate_name) : '---'}</Avatar>
                    <Typography variant="body2">{candidate.candidate_name ? candidate.candidate_name : '---'}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap', px: 4}}>
                  <Typography variant="body2">{candidate.email ? candidate.email : '---'}</Typography>
                  <Typography variant="body2" color="text.secondary">{candidate.mobile_number ? candidate.mobile_number : '---'}</Typography>
                </TableCell>
                <TableCell sx={{whiteSpace: 'nowrap', px: 4}}>{candidate.role_applied_for ? candidate.role_applied_for : '---'}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap', px: 4}}>{candidate.department ? candidate.department : '---'}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap', px: 4, color: 'text.secondary'}}>{candidate?.submitted_date?.split('T')[0]}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap', px: 4}}>{candidate.total_experience_years ? candidate.total_experience_years : '---'}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap', px: 4}}>{candidate.current_status && 
                    (<Chip {...getStatusChipProps(candidate.current_status)} size="small" />) 
                    || '---' 
                }</TableCell>
              </TableRow>
            ))}
            
          </TableBody>
        </Table>
      </TableContainer>
       
    )
}

export default CandidateTable