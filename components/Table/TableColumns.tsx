import { Requisition } from "@/interface/requisition";
import { TableColumn } from "@/interface/table";
import { getRelativeTime } from "@/utils/transform";

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