import { Requisition } from "@/interface/requisition";
import { TableColumn } from "@/interface/table";
import { getRelativeTime } from "@/utils/transform";
import { Button, Tooltip } from "@mui/material";

// Table colmun for Pending Requisitions 
export const PendingRequisitionColumns: TableColumn<Partial<Requisition>>[] = [
    { 
        key: 'position', label: 'Position'
    }, 
    { 
        key: 'requisition_raised_by', 
        label: 'Requested By' 
    },
    { 
        key: 'department', 
        label: 'Department' 
    },
    { 
        key: 'locations', 
        label: 'Locations'
    }, 
    { 
        key: 'submitted_date',
        label: 'Submitted', 
        render: (row) => getRelativeTime(row.submitted_date!)
    }
]

export const RequisitionColumns: TableColumn<Partial<Requisition>>[]  = [
    { 
        key: 'position', label: 'Position'
    }, 
    { 
        key: 'department', 
        label: 'Department' 
    },
    { 
        key: 'requisition_raised_by', 
        label: 'Requester' 
    },
    { 
        key: 'locations', 
        label: 'Locations'
    }, 
    { 
        key: 'Days open', 
        label: 'Days Open', 
        render: (row) => getRelativeTime(row.submitted_date!)
    }, 
    {
        key: 'filled', 
        label: 'Filled', 
        render: (row) => <>{row.num_filled!}/{row.num_positions!}</>
    }, 
    {
        key: 'status', 
        label: 'Status'
    }, 
    { 
        key: 'publish', 
        label: 'Publish',
        render: (row) => {
            if (row.sanity_job_list_key) {
                return <Button size="small" sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}>Unpublish</Button>;
            } else if (row.current_job_description_id) {
                return <Button size="small" sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}>Publish</Button>;
            } else {
                return (
                    <Tooltip title="Please include job description">
                        <span>
                            <Button size="small" sx={{ backgroundColor: 'grey', color: 'white', '&:hover': { backgroundColor: 'darkgrey' } }} disabled>
                                Publish
                            </Button>
                        </span>
                    </Tooltip>
                );
            }
        }
    }
] 