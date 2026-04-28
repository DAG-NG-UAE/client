import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Table, TableBody, TableCell, TableRow, TableHead, CircularProgress } from '@mui/material';
import { CandidateProfile } from '@/interface/candidate';
import CandidateRequirementDetail from '../CandidateRequirementDetail';
import { API_BASE_URL } from '@/api/axiosInstance';
import CandidateActivityHistory from './CandidateActivityHistory';
import { getCandidateCompetencyProfile } from '@/api/candidate';

interface Props {
    candidate: CandidateProfile;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const CandidateMainContent: React.FC<Props> = ({ candidate }) => {
    const [value, setValue] = useState(0);
    const [competencyData, setCompetencyData] = useState<Record<string, string> | null>(null);
    const [competencyLoading, setCompetencyLoading] = useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        if (newValue === 4 && !competencyData && !competencyLoading) {
            setCompetencyLoading(true);
            getCandidateCompetencyProfile(candidate.candidate_id)
                .then((data) => setCompetencyData(data))
                .catch(() => setCompetencyData(null))
                .finally(() => setCompetencyLoading(false));
        }
    };

    // Construct Resume URL
    let resumeUrl = null;
    if (candidate.cv_path) {
        resumeUrl = candidate.cv_path;
        console.log(`the resumeUrl is ${resumeUrl}`)

        // const parts = candidate.cv_path.split('uploads');
        // if (parts.length > 1) {
        //      const relPath = parts[1].replace(/\\/g, '/');
        //      resumeUrl = `${API_BASE_URL}/uploads${relPath}`;
        //      console.log(resumeUrl);
        // }
    }

    return (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, minHeight: 600 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="candidate profile tabs">
                    <Tab label="Resume" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Activity History" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Requirement Match" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Notes" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Competency Profile" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
            </Box>

            {/* RESUME TAB */}
            <CustomTabPanel value={value} index={0}>
                {resumeUrl ? (
                    <Box sx={{ height: '800px', width: '100%', bgcolor: '#eee', borderRadius: 1, overflow: 'hidden' }}>
                        <object
                            data={`${resumeUrl}#zoom=100`}
                            key={resumeUrl}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                        >
                            {/* <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography>
                                    PDF viewer failed. <a href={resumeUrl} target="_blank" rel="noreferrer">Click here to open in a new tab.</a>
                                </Typography>
                            </Box> */}
                        </object>
                    </Box>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No resume attached.</Typography>
                    </Box>
                )}
            </CustomTabPanel>

            {/* ACTIVITY HISTORY TAB */}
            <CustomTabPanel value={value} index={1}>
                <CandidateActivityHistory candidateId={candidate.candidate_id} />
            </CustomTabPanel>

            {/* REQUIREMENT MATCH TAB */}
            <CustomTabPanel value={value} index={2}>
                <CandidateRequirementDetail
                    requirements={candidate.requirement_match}
                    candidateName={candidate.candidate_name}
                // No need for "View Full Profile" button here since we are ALREADY on the full profile
                />
            </CustomTabPanel>

            {/* NOTES TAB */}
            <CustomTabPanel value={value} index={3}>
                <Typography color="text.secondary">Notes section.</Typography>
            </CustomTabPanel>

            {/* COMPETENCY PROFILE TAB */}
            <CustomTabPanel value={value} index={4}>
                {competencyLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!competencyLoading && !competencyData && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No competency profile uploaded yet.</Typography>
                    </Box>
                )}

                {!competencyLoading && competencyData && (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'action.selected' }}>
                                    <TableCell sx={{ fontWeight: 700, width: '45%', border: '1px solid', borderColor: 'divider', py: 1.5, px: 2 }}>
                                        Field
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, border: '1px solid', borderColor: 'divider', py: 1.5, px: 2 }}>
                                        Value
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(competencyData).map(([key, val], i) => (
                                    <TableRow
                                        key={key}
                                        sx={{ bgcolor: i % 2 === 0 ? 'background.paper' : 'action.hover' }}
                                    >
                                        <TableCell sx={{ border: '1px solid', borderColor: 'divider', py: 1.25, px: 2, fontWeight: 500, color: 'text.primary', whiteSpace: 'nowrap' }}>
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid', borderColor: 'divider', py: 1.25, px: 2, color: 'text.secondary' }}>
                                            {val || '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </CustomTabPanel>
        </Paper>
    );
};

export default CandidateMainContent;
