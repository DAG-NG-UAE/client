import { CandidateProfile } from "@/interface/candidate";
import { Requisition } from "@/interface/requisition";
import { TableColumn } from "@/interface/table";
import { getStatusChipProps } from "@/utils/statusColorMapping";
import { getRelativeTime } from "@/utils/transform";
import { Button, Chip, Tooltip } from "@mui/material";

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

export const CandidateColumns: TableColumn<Partial<CandidateProfile>>[] = [ 
    { 
        key: 'candidate_name', label: 'Name'
    }, 
    { 
        key: 'email', 
        label: 'Email' 
    },
    { 
        key: 'mobile_number', 
        label: 'Phone' 
    },
    { 
        key: 'role_applied_for', 
        label: 'Position'
    },
    { 
        key: 'current_status', 
        label: 'Status',
        render: (row) => (
            <Chip 
                {...getStatusChipProps(row.current_status)} 
                size="small" 
                sx={{ 
                borderRadius: '6px', 
                fontWeight: 500,
                ...(getStatusChipProps(row.current_status).sx || {})
                }}
            />
        )
    },
    { 
        key: 'submitted_date', 
        label: 'Applied',
        render: (row) => getRelativeTime(row.submitted_date!)
    },
    { 
        key: 'source', 
        label: 'Source'
    },
    // { 
    //     key: 'applied_date', 
    //     label: 'Last Update'
    // },
]