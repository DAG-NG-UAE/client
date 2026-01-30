"use client"
import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Avatar, 
  Divider, 
  TextField, 
  Chip,
  ThemeProvider,
  CssBaseline,
  Container,
  Stack,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { getApprovalTheme } from '@/theme';
import { useSearchParams } from 'next/navigation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

// Mock Data matching the screenshot
const candidateData = {
  name: "Jane Doe",
  role: "Senior Software Architect",
  image: "/placeholder-avatar.jpg", // We don't have this, will rely on Initials or empty
  experience: "12+ Years",
  currentRole: "Tech Lead, TechCorp",
  noticePeriod: "30 Days",
  requestId: "#44219",
  proposedGross: "$245,000",
  monthlyNet: "$14,800",
  baseSalary: "$180,000",
  housingAllowance: "$45,000",
  transportation: "$12,000",
  topALimit: "10th percentile",
  performanceBonus: "Up to 20%",
  equity: "$50,000",
  joiningBonus: "$8,000",
  annualEstimate: "$40,000",
  peerMin: "$190k",
  peerMax: "$280k",
  peerProposed: "$245k"
};

const approvalSteps = [
  { label: 'HR Business Partner', status: 'approved', time: '4h ago', details: 'Verified & Screened' },
  { label: 'Engineering VP', status: 'approved', time: '3h ago', details: 'Technically Approved' },
  { label: 'CEO Approval', status: 'current', details: 'Pending your decision...' },
];

export default function SalaryProposalReview() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const theme = getApprovalTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* DESKTOP VIEW */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, minHeight: '100vh', bgcolor: 'background.default', fontFamily: 'Inter' }}>
        
        {/* Left Sidebar - Candidate Profile */}
        <Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} /> 
               {/* Using Check icon as logo placeholder based on image */}
            </Box>
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>Executive Portal</Typography>
                <Typography variant="caption" color="text.secondary">C-SUITE ACCESS</Typography>
            </Box>
          </Box>

          <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 2, display: 'block', fontSize: '0.75rem', letterSpacing: 1 }}>CANDIDATE PROFILE</Typography>
          
          <Card sx={{ mb: 3, textAlign: 'center', p: 2, bgcolor: 'background.paper' }}>
             <Avatar 
                sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }} 
                src={candidateData.image}
              >JD</Avatar>
             <Typography variant="h6">{candidateData.name}</Typography>
             <Typography variant="body2" color="text.secondary" gutterBottom>{candidateData.role}</Typography>
             <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1 }}>
                <Chip label="HIGH PRIORITY" size="small" color="primary" sx={{ borderRadius: 1, height: 20, fontSize: '0.65rem' }} />
                <Chip label="ENGINEERING" size="small" sx={{ borderRadius: 1, height: 20, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.1)' }} />
             </Box>
          </Card>

          {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Experience</Typography>
                <Typography variant="body2" fontWeight="bold">{candidateData.experience}</Typography>
             </Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Current Role</Typography>
                <Typography variant="body2" fontWeight="bold">{candidateData.currentRole}</Typography>
             </Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Notice Period</Typography>
                <Typography variant="body2" fontWeight="bold">{candidateData.noticePeriod}</Typography>
             </Box>
          </Box> */}
{/* 
          <Button 
            variant="outlined" 
            startIcon={<PictureAsPdfIcon />} 
            fullWidth 
            sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.05)', border: 'none', color: 'text.secondary', justifyContent: 'flex-start' }}
          >
            View Full CV (PDF)
          </Button> */}

        

        </Box>

        {/* Main Content Desktop */}
        <Box sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
            <Typography variant="caption" color="text.secondary">Approvals &gt; Salary Request {candidateData.requestId}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h1" gutterBottom sx={{ mt: 1 }}>Financial Summary</Typography>
                    <Typography variant="body1" color="text.secondary">Proposed Compensation Package for {candidateData.role} Role</Typography>
                </Box>
                <Chip label="AWAITING FINAL APPROVAL" color="warning" sx={{ borderRadius: 1 }} />
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Proposed Annual Gross</Typography>
                        <Typography variant="h2" color="primary.main" gutterBottom sx={{ fontWeight: 800, fontSize: '3rem' }}>{candidateData.proposedGross}</Typography>
                        <Typography variant="caption" color="text.secondary" fontStyle="italic">Competitive for region (Top {candidateData.topALimit})</Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Estimated Monthly Net</Typography>
                        <Typography variant="h2" color="white" gutterBottom sx={{ fontWeight: 800, fontSize: '3rem' }}>{candidateData.monthlyNet}</Typography>
                        <Typography variant="caption" color="text.secondary" fontStyle="italic">Excl. annual performance bonus calculations</Typography>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ mb: 4 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Package Breakdown</Typography>
                    <Typography variant="button" color="primary" sx={{ fontSize: '0.75rem', cursor: 'pointer' }}>DOWNLOAD WORKSHEET</Typography>
                </Box>
                <Grid container>
                    {/* Column 1 */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3, borderRight: '1px solid', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 2 }}>BASE & HOUSING (BHA)</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Basic Salary</Typography>
                            <Typography variant="body2" fontWeight="bold">{candidateData.baseSalary}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Housing Allowance</Typography>
                            <Typography variant="body2" fontWeight="bold">{candidateData.housingAllowance}</Typography>
                        </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="body2">Transportation</Typography>
                            <Typography variant="body2" fontWeight="bold">{candidateData.transportation}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" fontWeight="bold">Total BHA</Typography>
                            <Typography variant="body1" fontWeight="bold" color="primary.main">$237,000</Typography>
                        </Box>
                    </Grid>
                    {/* Column 3 - Non Cash Benefits */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 2 }}>NON-CASH BENEFITS</Typography>
                        <Stack spacing={2}>
                            <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 12 }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">Premium Medical</Typography>
                                    <Typography variant="caption" color="text.secondary">(Global)</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 12 }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">Executive Car Lease</Typography>
                                </Box>
                            </Box>
                             <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 12 }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">L&D Budget</Typography>
                                    <Typography variant="caption" color="text.secondary">($5k/yr)</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </Box>

        {/* Right Sidebar - Actions */}
        <Box sx={{ width: 320, borderLeft: '1px solid', borderColor: 'divider', p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Final Decision</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Please provide feedback or specific conditions before approving this request.</Typography>

            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block' }}>NOTES FOR TALENT ACQUISITION</Typography>
            <TextField 
                multiline 
                rows={4} 
                placeholder="E.g., Approved contingent on Q3 start date..." 
                fullWidth 
                variant="outlined" 
                sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.05)' }}
            />

            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 2, display: 'block' }}>APPROVAL WORKFLOW</Typography>
            <Stack spacing={3} sx={{ mb: 'auto' }}>
                {approvalSteps.map((step, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ mt: 0.5 }}>
                            {step.status === 'approved' ? (
                                <CheckCircleIcon color="success" />
                            ) : (
                                <RadioButtonUncheckedIcon color="primary" /> // Use primary for current step focus
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight="bold" color={step.status === 'current' ? 'primary' : 'text.primary'}>{step.label}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{step.details}</Typography>
                            {step.time && <Typography variant="caption" color="text.secondary">{step.time}</Typography>}
                        </Box>
                    </Box>
                ))}
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                <Button variant="contained" size="large" fullWidth sx={{ py: 1.5, fontSize: '1rem' }} startIcon={<CheckCircleIcon />}>Approve Request</Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" fullWidth sx={{ color: 'text.primary', borderColor: 'rgba(255,255,255,0.2)' }}>Re-evaluate</Button>
                    <Button variant="outlined" fullWidth color="error" sx={{ borderColor: 'rgba(211, 47, 47, 0.5)' }}>Reject</Button>
                </Box>
            </Box>
            <Typography variant="caption" align="center" color="text.secondary" sx={{ mt: 2, fontSize: '0.65rem' }}>ACTION WILL BE LOGGED IN AUDIT TRAIL</Typography>
        </Box>

      </Box>

      {/* MOBILE VIEW */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, minHeight: '100vh', bgcolor: '#101622', fontFamily: 'Inter', pb: 12 }}>
          {/* Top Card */}
          <Card sx={{ m: 2, p: 2, bgcolor: '#1e293b', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar src={candidateData.image} sx={{ width: 64, height: 64, border: '2px solid #3b82f6' }}>JD</Avatar>
                  <Box>
                      <Typography variant="h6" fontWeight="bold">{candidateData.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Senior Software Architect</Typography> {/* Hardcoded for match with image */}
                  </Box>
              </Box>

              <Box sx={{ bgcolor: '#0f172a', borderRadius: 2, p: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1 }}>ANNUAL GROSS SALARY</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
                      <Typography variant="h4" fontWeight="bold" color="white">{candidateData.proposedGross}</Typography>
                      <Typography variant="body2" color="text.secondary">/yr</Typography>
                  </Box>

                  <Typography variant="caption" color="primary.main" fontWeight="bold" sx={{ letterSpacing: 1 }}>ESTIMATED MONTHLY NET</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="h4" fontWeight="bold" color="white">{candidateData.monthlyNet}</Typography> {/* Visual match: actually image implies 16420, used data match */}
                      <Typography variant="body2" color="text.secondary">/mo</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Tax calculated for California region</Typography>
              </Box>
          </Card>

          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ ml: 2, mb: 2, letterSpacing: 1 }}>COMPENSATION BREAKDOWN</Typography>

          {/* Accordions */}
           <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Accordion sx={{ bgcolor: '#1e293b', borderRadius: '12px !important', '&:before': { display: 'none' } }} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 1 }}>
                             <AccountBalanceWalletIcon color="primary" fontSize="small" />
                          </Box>
                          <Typography fontWeight="bold">BHA Breakdown</Typography>
                      </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Basic Salary</Typography>
                          <Typography variant="body2" fontWeight="bold">{candidateData.baseSalary}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Housing Allowance</Typography>
                          <Typography variant="body2" fontWeight="bold">{candidateData.housingAllowance}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Transport Allowance</Typography>
                          <Typography variant="body2" fontWeight="bold">{candidateData.transportation}</Typography>
                      </Box>
                  </AccordionDetails>
              </Accordion>


              <Accordion sx={{ bgcolor: '#1e293b', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1, bgcolor: 'rgba(168, 85, 247, 0.1)', borderRadius: 1 }}>
                             <CardGiftcardIcon sx={{ color: '#a855f7' }} fontSize="small" />
                          </Box>
                          <Typography fontWeight="bold">Non-Cash Benefits</Typography>
                      </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Stack spacing={2}>
                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <CheckCircleIcon sx={{ fontSize: 12 }} />
                              </Box>
                              <Box>
                                  <Typography variant="body2" fontWeight="bold">Premium Medical</Typography>
                                  <Typography variant="caption" color="text.secondary">(Global)</Typography>
                              </Box>
                          </Box>
                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <CheckCircleIcon sx={{ fontSize: 12 }} />
                              </Box>
                              <Box>
                                  <Typography variant="body2" fontWeight="bold">Executive Car Lease</Typography>
                              </Box>
                          </Box>
                           <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ p: 0.5, bgcolor: 'primary.main', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <CheckCircleIcon sx={{ fontSize: 12 }} />
                              </Box>
                              <Box>
                                  <Typography variant="body2" fontWeight="bold">L&D Budget</Typography>
                                  <Typography variant="caption" color="text.secondary">($5k/yr)</Typography>
                              </Box>
                          </Box>
                      </Stack>
                  </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: '#1e293b', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                             <DescriptionIcon sx={{ color: 'text.secondary' }} fontSize="small" />
                          </Box>
                          <Typography fontWeight="bold">Interview Summary & CV</Typography>
                      </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                       <Button variant="outlined" startIcon={<PictureAsPdfIcon />} fullWidth>Download CV</Button>
                  </AccordionDetails>
              </Accordion>
          </Box>
          
          {/* Bottom Sticky Action Bar */}
          <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: '#0f172a', borderTop: '1px solid #334155', display: 'flex', gap: 2, zIndex: 100 }}>
             <Button variant="outlined" color="error" sx={{ flex: 1, borderRadius: 2, height: 48, borderColor: '#ef4444', color: '#ef4444' }} startIcon={<CloseIcon />}>Reject</Button>
             <Button variant="contained" sx={{ flex: 2, borderRadius: 2, bgcolor: '#10b981', height: 48, '&:hover': { bgcolor: '#059669' }, color: 'white', fontWeight: 'bold' }} startIcon={<CheckIcon />}>APPROVE REQUEST</Button>
          </Box>

      </Box>

    </ThemeProvider>
  );
}
