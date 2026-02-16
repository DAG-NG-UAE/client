import { offerStatusDetail } from "@/utils/constants";
import { Box, Button, Typography, CircularProgress, Tooltip, IconButton } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FolderIcon from '@mui/icons-material/Folder';
import ArchiveIcon from '@mui/icons-material/Archive';
import TableComponent from "../Table/Table";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState, useCallback } from "react";
import { callCreateEmployee, fetchAllOffers } from "@/redux/slices/offer";
import { getColumnsForOfferStatus } from "@/utils/offersColumnConfig";
import { Offer } from "@/interface/offer";
import { useRouter } from "next/navigation";
import Filters from "../Filters";
import { fetchPositions } from "@/redux/slices/positions";

const OfferStatusPage = ({status}: {status: string}) => {
    const router = useRouter();
    console.log(status)
    const details = offerStatusDetail[status] || { title: 'Offers', subtitle: 'Manage all offers.' };

    const { offers, loading, meta } = useSelector((state: RootState) => state.offers);
    const { positions } = useSelector((state: RootState) => state.positions);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");

    
    // Filter out duplicate requisition_ids for the filter dropdown
    const uniquePositions = positions.filter((pos, index, self) =>
        index === self.findIndex((p) => p.requisition_id === pos.requisition_id)
    );

    const allRoles = [
      { text: 'All Roles', value: 'all' },
      ...uniquePositions.map((position) => ({
        text: position.position,
        value: position.requisition_id,
      })),
    ];

    console.log(allRoles)

    useEffect(() => { 
        setSearchQuery("");
        setSelectedRole("all");
        if(status == 'all'){
            fetchAllOffers()
        }else{
            fetchAllOffers(status)
        }
    }, [status])

    const handleRowClick = (row: Partial<Offer>) => {
      if(status == 'revision_requested'){
        router.push(`/offers/revisionDetails/${row.offer_id}`);
      }else{
        router.push(`/offers/view/${row.offer_id}`);
      }
    };

    const handleCreateEmployee = (row: Partial<Offer>) => {
      if(row.requisition_id && row.candidate_id){
        callCreateEmployee(row.requisition_id, row.candidate_id)
      }
    }

    const limit = meta?.limit || 10;
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        fetchAllOffers(status === 'all' ? undefined : status, 1, limit, query, selectedRole);
    }, [status, limit, selectedRole]);

    const renderActions = (row: Partial<Offer>) => {
      const isRejected = status === 'rejected';

      return (
        <Box display='flex' gap={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(row);
              }}
            >
              View
            </Button>
            {row.finalized_date && row.current_status !== 'hired' ? (
              
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateEmployee(row);
                  }}
                >
                  Create Employee
                </Button>
              ): !isRejected && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={true}
                >
                  Employee Created
                </Button>
              )
            }
            {isRejected && (
                <>
                    <Tooltip title="Redo Proposal">
                        <IconButton size="small" onClick={(e: React.MouseEvent) => { 
                            e.stopPropagation(); 
                            if(row.candidate_id) {
                                router.push(`/candidates/internal-salary-proposal/${row.candidate_id}`);
                            }
                        }}>
                            <RestartAltIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Move to Regretted">
                        <IconButton size="small" onClick={(e: React.MouseEvent) => { e.stopPropagation(); console.log('Move to Regretted', row); }}>
                            <FolderIcon color="error" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Keep for another opening">
                         <IconButton size="small" onClick={(e: React.MouseEvent) => { e.stopPropagation(); console.log('Keep for another opening', row); }}>
                            <ArchiveIcon color="warning" />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Box>
        
      );
    };

    const handleRefreshPositions = () => {
        fetchPositions()
    };

    const handleFilterChange = (requisitionId: string) => {
        setSelectedRole(requisitionId);
        fetchAllOffers(status === 'all' ? undefined : status, 1, limit, searchQuery, requisitionId);
    }

    const hasActions = true;

    return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          {details.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {details.subtitle}
        </Typography>


        <Filters 
            key={status}
            menuItems={allRoles} 
            textPlaceholder="Search candidate name. position " 
            isCandidate={false} 
            onSearch={handleSearch}
            refreshPosition={handleRefreshPositions}
            filterFunction={handleFilterChange}
        />
        
        {offers && (
          <Box sx={{ mt: 4 }}>
            <TableComponent
              columns={getColumnsForOfferStatus(status)}
              data={offers}
              onRowClick={handleRowClick}
              actions={hasActions ? renderActions : undefined}
              keyExtractor={(offers) => offers.offer_id}
              totalCount={meta?.total || 0}
              page={(meta?.page || 1) - 1} // MUI is 0-indexed
              rowsPerPage={meta?.limit || 10}
              onPageChange={(e, newPage) => fetchAllOffers(status === 'all' ? undefined : status, newPage + 1, meta?.limit, searchQuery, selectedRole)}
              onRowsPerPageChange={(e) => fetchAllOffers(status === 'all' ? undefined : status, 1, parseInt(e.target.value, 10), searchQuery, selectedRole)}
            >
            </TableComponent>
          </Box>
        )}
      
      </Box>
    </>
  );
}

export default OfferStatusPage