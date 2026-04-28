"use client";

import React, { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { DirectionsCar, LocalShipping, TwoWheeler, Flight, DirectionsBus, Commute, ArrowForward, SentimentVeryDissatisfied } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { getCareerDetail } from '@/api/requisitionApi';
import { Requisition, RequisitionPreference } from '@/interface/requisition';
import ApplicationDrawer from '@/components/public/ApplicationDrawer';

// Background Component with scattered vehicle icons - Designed for Hero Overlay
const HeroVehiclePattern = () => {
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', opacity: 0.1, pointerEvents: 'none' }}>
      <DirectionsCar sx={{ position: 'absolute', top: '10%', left: '5%', fontSize: 120, color: 'white', transform: 'rotate(-15deg)' }} />
      <LocalShipping sx={{ position: 'absolute', top: '50%', right: '10%', fontSize: 150, color: 'white', transform: 'rotate(10deg)' }} />
      <TwoWheeler sx={{ position: 'absolute', bottom: '-10%', left: '20%', fontSize: 100, color: 'white', transform: 'rotate(25deg)' }} />
      <Flight sx={{ position: 'absolute', top: '20%', right: '25%', fontSize: 110, color: 'white', transform: 'rotate(-5deg)' }} />
      <DirectionsBus sx={{ position: 'absolute', bottom: '20%', right: '35%', fontSize: 130, color: 'white', transform: 'rotate(-10deg)' }} />
    </Box>
  );
};

export default function ApplyPage(props: { params: Promise<{ id: string }> }) {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { id } = use(props.params);
  const [careerDetails, setCareerDetails] = useState<Partial<Requisition>>({});
  const [requisitionPreference, setRequisitionPreference] = useState<RequisitionPreference>([])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchJobDetails = async (slug: string) => { 
    try { 
      const result = await getCareerDetail(slug);
      if (!result || Object.keys(result).length === 0) {
        setNotFound(true);
      } else {
        setCareerDetails(result.requisition);
        setRequisitionPreference(result.preference)
      }
    } catch (error) { 
      console.log("Error fetching career details");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchJobDetails(id);
  }, [id]);

  console.log(`the career details are => ${JSON.stringify(careerDetails)}`)
  if (!loading && (notFound || !careerDetails?.position)) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          p: 4
        }}>
          <HeroVehiclePattern />
          <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Box 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
              }}
            >
              <SentimentVeryDissatisfied sx={{ fontSize: 60, color: 'white' }} />
            </Box>
            
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Job No Longer Available
            </Typography>
            
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 6, fontWeight: 400 }}>
              The position you are looking for has been filled or removed. 
            </Typography>

            <Button 
              variant="contained" 
              size="large" 
              href="https://dagindustries.com/about-us/careers" 
              sx={{ 
                px: 5, 
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 50,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Browse Open Positions
            </Button>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Hero Header Section */}
      <Box sx={{ 
        position: 'relative',
        bgcolor: 'primary.main',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        pt: { xs: 6, md: 8 }, 
        pb: { xs: 10, md: 14 }, // Reduced padding
        px: 4,
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <HeroVehiclePattern />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.9, fontWeight: 600 }}>
              JOIN OUR TEAM
            </Typography>
            <Typography variant="h2" fontWeight="800" sx={{ 
              fontSize: { xs: '1.5rem', md: '2rem' },
              textShadow: '0px 4px 20px rgba(0,0,0,0.1)' 
            }}>
              {careerDetails?.position || searchParams.get('position') || 'Loading Position...'}
            </Typography>
            
            <Stack direction="row" spacing={2} divider={<Box sx={{ width: 4, height: 4, bgcolor: 'white', borderRadius: '50%', alignSelf: 'center' }} />} sx={{ opacity: 0.9 }}>
               <Typography variant="h6">
                 {((careerDetails?.department)?.replace(/_/g, ' ') || searchParams.get('department'))?.replace(/_/g, ' ')}
               </Typography>
               {(careerDetails?.requisition_positions?.length || searchParams.get('location')) && (
                 <Typography variant="h6">
                   {careerDetails?.requisition_positions 
                     ? careerDetails?.requisition_positions.map(p => p.location).join(', ') 
                     : searchParams.get('location')?.split(',').join(', ')}
                 </Typography>
               )}
            </Stack>

            <Button 
              variant="contained" 
              size="large" 
              onClick={() => setIsDrawerOpen(true)}
              endIcon={<ArrowForward />}
              sx={{ 
                mt: 4, 
                px: 5, 
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 50,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Apply for this Position
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Overlapping Content Section */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, mt: -10, mb: 10 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 4, 
            bgcolor: 'background.paper',
            boxShadow: '0px 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 4, 
            pb: 2, 
            borderBottom: '1px solid', 
            borderColor: 'divider' 
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Job Description
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Read carefully before applying
            </Typography>
          </Box>
          
          <Box sx={{ 
            '& .prose': { maxWidth: 'none', color: 'text.secondary' },
            '& p': { mb: 3, lineHeight: 1.8, fontSize: '1.05rem' },
            '& h1, & h2, & h3': { mt: 5, mb: 2, fontWeight: 700, color: 'text.primary' },
            '& ul, & ol': { pl: 3, mb: 3 },
            '& li': { mb: 1, pl: 1 },
            '& strong': { color: 'text.primary' }
           }}>
            <ReactMarkdown>
              {careerDetails?.content || ''}
            </ReactMarkdown>
          </Box>

          <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
             <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
               Ready to make an impact?
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
               Join us and help shape the future of logistics.
             </Typography>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => setIsDrawerOpen(true)}
                sx={{ px: 8, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
              >
                Apply Now
              </Button>
          </Box>
        </Paper>
      </Container>

      {/* Application Drawer */}
      <ApplicationDrawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        requisitionId={id}
        careerDetails={careerDetails}
        requisitionPreference={requisitionPreference}
      />
    </Box>
  );
}
