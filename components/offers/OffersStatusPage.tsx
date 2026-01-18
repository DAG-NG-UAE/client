import { offerStatusDetail } from "@/utils/constants";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import TableComponent from "../Table/Table";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { callCreateEmployee, fetchAllOffers } from "@/redux/slices/offer";
import { getColumnsForOfferStatus } from "@/utils/offersColumnConfig";
import { Offer } from "@/interface/offer";
import { useRouter } from "next/navigation";

const OfferStatusPage = ({status}: {status: string}) => {
    const router = useRouter();
    console.log(status)
    const details = offerStatusDetail[status] || { title: 'Offers', subtitle: 'Manage all offers.' };

    const {offers, loading} = useSelector((state: RootState) => state.offers)

    useEffect(() => { 
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

    const renderActions = (row: Partial<Offer>) => {
      return (
        <Box display='flex' gap={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(row);
              }}
            >
              View
            </Button>
            {row.finalized_date && (
              loading ? (
                <CircularProgress size={24} />
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateEmployee(row);
                  }}
                >
                  Create Employee
                </Button>
              )
            )}
        </Box>
        
      );
    };

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


        {offers && (
          <Box sx={{ mt: 4 }}>
            <TableComponent
              columns={getColumnsForOfferStatus(status)}
              data={offers}
              onRowClick={handleRowClick}
              actions={hasActions ? renderActions : undefined}
              keyExtractor={(offers) => offers.offer_id}
            >
            </TableComponent>
          </Box>
        )}
      
      </Box>
    </>
  );
}

export default OfferStatusPage