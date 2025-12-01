"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import StatsCards from '@/components/history/StatsCards';
import RequisitionCard from '@/components/history/RequisitionCard';
import { getHistoricalRequisitionsById } from '@/api/historicalRequisitions';

// Define types for the details view
interface RequisitionDetail {
  requisition_id: string;
  id: string;
  position: string;
  department: string;
  candidate_count: number;
  status: 'Open' | 'Closed' | 'Pending';
}

interface HistoricalBatchDetails {
  id: string;
  file_name: string;
  upload_date: string;
  total_requisitions: number;
  total_candidates: number;
  data_span: string; // e.g., "Q4 2024"
  data: RequisitionDetail[]
}

const HistoricalDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { id } = params;

  const [data, setData] = useState<HistoricalBatchDetails | null>(() => {
    const fileName = searchParams.get('fileName');
    const reqCount = searchParams.get('reqCount');
    const candCount = searchParams.get('candCount');
    const dataSpan = searchParams.get('dataSpan');

    if (fileName && reqCount && candCount) {
      return {
        id: id as string,
        file_name: fileName,
        upload_date: '', 
        total_requisitions: parseInt(reqCount),
        total_candidates: parseInt(candCount),
        data_span: dataSpan || '',
        data: [] 
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await getHistoricalRequisitionsById(id as string);
        
        setData(prev => {
          if (!prev) return result;
          return {
            ...prev,
            ...result,
            // Preserve stats from URL params if missing in API response
            file_name: result.file_name || prev.file_name,
            total_requisitions: result.total_requisitions ?? prev.total_requisitions,
            total_candidates: result.total_candidates ?? prev.total_candidates,
            data_span: result.data_span || prev.data_span,
            // Ensure data array is updated
            data: result.data || prev.data || []
          };
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'Data not found'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
          Back to History
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1600, margin: '0 auto' }}>
      {/* Header */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.back()} 
        sx={{ mb: 2, color: theme.palette.text.secondary, textTransform: 'none' }}
      >
        Back to Historical Data
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        Historical Data Details
      </Typography>
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
        {data.file_name}
      </Typography>

      {/* Stats Cards */}
      <StatsCards 
        dataSpan={data.data_span}
        totalRequisitions={data.total_requisitions}
        totalCandidates={data.total_candidates}
      />

      {/* Requisitions Grid */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Requisitions
      </Typography>

      <Grid container spacing={3}>
        {loading && data?.data.length === 0 ? (
           <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
             <CircularProgress />
           </Box>
        ) : (
            <Box
                sx={{
                display: 'flex',
                flexWrap: 'wrap', // Allows cards to move to the next row when space runs out
                gap: theme.spacing(1), // Spacing between the cards (2 units)
            }}>
                {data?.data.map((req) => (
                    <RequisitionCard
                        key={req.requisition_id}
                        id={req.id}
                        role={req.position}
                        department={req.department}
                        candidateCount={req.candidate_count}
                        status={req.status}
                        showUploadButton={true}
                    />
                ))}
            </Box>
        )}
      </Grid>
    </Box>
  );
};

export default HistoricalDetailsPage;
