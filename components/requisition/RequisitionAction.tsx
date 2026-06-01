import { Requisition } from "@/interface/requisition";
import { Edit, Visibility, PeopleAlt, AssignmentInd, PersonAdd, GroupAdd } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Link, alpha } from "@mui/material";

const iconSx = (hoverColor: string) => ({
  color: '#64748b',
  '&:hover': {
    color: hoverColor,
    bgcolor: alpha(hoverColor, 0.08),
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s',
});

export const RequisitionRowActions = ({ requisition }: { requisition: Partial<Requisition> }) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title="View Requisition" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${encodeURIComponent(requisition.requisition_id ?? '')}`}
          size="small"
          sx={iconSx('#0369a1')}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* <Tooltip title="Edit Requisition" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${encodeURIComponent(requisition.requisition_id ?? '')}/edit`}
          size="small"
          sx={iconSx('#b45309')}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip> */}

      <Tooltip title="Manage Stakeholders" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${encodeURIComponent(requisition.requisition_id ?? '')}/invite`}
          size="small"
          sx={iconSx('#15803d')}
        >
          <PersonAdd fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="View Candidates" arrow>
        <IconButton
          component={Link}
          href={`/candidates/all?requisitionId=${encodeURIComponent(requisition.requisition_id ?? '')}`}
          size="small"
          sx={iconSx('#6d28d9')}
        >
          <PeopleAlt fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* <Tooltip title="Add Candidate Manually" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${encodeURIComponent(requisition.requisition_id ?? '')}/add-candidate`}
          size="small"
          sx={iconSx('#15803d')}
        >
          <AssignmentInd fontSize="small" />
        </IconButton>
      </Tooltip> */}

      <Tooltip title="Add Candidates" arrow>
        <IconButton
          component={Link}
          href={`/requisition/${encodeURIComponent(requisition.requisition_id ?? '')}/add-bulk-candidates`}
          size="small"
          sx={iconSx('#0891b2')}
        >
          <GroupAdd fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
