import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import { CandidateProfile } from '@/interface/candidate';
import CandidateRequirementDetail from '../CandidateRequirementDetail';
import { API_BASE_URL } from '@/api/axiosInstance';
import CandidateActivityHistory from './CandidateActivityHistory';

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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
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
        </Paper>
    );
};

export default CandidateMainContent;
