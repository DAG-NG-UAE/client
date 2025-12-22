import { Requisition } from "@/interface/requisition";
import { Edit, MoreVert, Visibility } from "@mui/icons-material";
import { IconButton, Link, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export const RequisitionRowActions = ({ requisition }: { requisition: Partial<Requisition> }) => {
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