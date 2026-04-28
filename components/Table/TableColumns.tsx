import { CandidateProfile } from "@/interface/candidate";
import { Requisition } from "@/interface/requisition";
import { TableColumn } from "@/interface/table";
import { getStatusChipProps } from "@/utils/statusColorMapping";
import { formatOfferDate, getRelativeTime } from "@/utils/transform";
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
        label: 'Department', 
        render: (row) => row.department?.replace(/_/g, ' ')
    },
    { 
        key: 'locations', 
        label: 'Locations'
    }, 
    { 
        key: 'submitted_date',
        label: 'Submitted', 
        render: (row) => getRelativeTime(row.created_at!)
    }
]

export const RequisitionColumns: TableColumn<Partial<Requisition>>[]  = [
    { 
        key: 'position', label: 'Position'
    }, 
    { 
        key: 'department', 
        label: 'Department', 
        render: (row) => row.department?.replace(/_/g, ' ')
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
        key: 'expected_start_date', 
        label: 'Expected Start Date',
        render: (row) => formatOfferDate(row.expected_start_date!)
    },
    { 
        key: 'Days open', 
        label: 'Days Open', 
        render: (row) => getRelativeTime(row.created_at!)
    }, 
    {
        key: 'filled', 
        label: 'Filled', 
        render: (row) => <>{row.num_filled!}/{row.num_positions!}</>
    }, 
    {
        key: 'status', 
        label: 'Status',
        render: (row) => (
            <Chip 
                {...getStatusChipProps(row.status)} 
                size="small" 
                sx={{ 
                borderRadius: '6px', 
                fontWeight: 500,
                ...(getStatusChipProps(row.status).sx || {})
                }}
            />
        )
    }, 
    { 
        key: 'publish', 
        label: 'Publish',
        render: (row) => {
            if (row.sanity_job_list_key && (row.status == 'approved' || row.status == 'closed')) {
                return <Chip 
                {...getStatusChipProps('published')} 
                size="small" 
                sx={{ 
                borderRadius: '6px', 
                fontWeight: 500,
                ...(getStatusChipProps('published').sx || {})
                }}
            />
            } else if (row.current_job_description_id && row.status !== 'approved') {
                return <Chip 
                {...getStatusChipProps('not_published')} 
                size="small" 
                sx={{ 
                borderRadius: '6px', 
                fontWeight: 500,
                ...(getStatusChipProps('not_published').sx || {})
                }}
            />
            } else {
                return <Chip 
                    {...getStatusChipProps('no_publication')} 
                    size="small" 
                    sx={{ 
                    borderRadius: '6px', 
                    fontWeight: 500,
                    ...(getStatusChipProps('no_publication').sx || {})
                    }}
            />
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