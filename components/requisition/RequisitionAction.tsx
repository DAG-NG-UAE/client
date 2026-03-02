import { Requisition } from "@/interface/requisition";
import { Edit, Visibility, PersonAdd } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Link, alpha } from "@mui/material";

export const RequisitionRowActions = ({ requisition }: { requisition: Partial<Requisition> }) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title="View Requisition" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${requisition.requisition_id}`}
          size="small"
          sx={{
            color: '#1976d2', // Professional Blue
            '&:hover': {
              bgcolor: alpha('#1976d2', 0.1),
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s'
          }}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Requisition" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${requisition.requisition_id}/edit`}
          size="small"
          sx={{
            color: '#ed6c02', // Deep Orange for better visibility than yellow
            '&:hover': {
              bgcolor: alpha('#ed6c02', 0.1),
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s'
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Invite Stakeholders" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${requisition.requisition_id}/invite`}
          size="small"
          sx={{
            color: '#2e7d32', // Forest Green to match "Approved" status
            '&:hover': {
              bgcolor: alpha('#2e7d32', 0.1),
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s'
          }}
        >
          <PersonAdd fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};