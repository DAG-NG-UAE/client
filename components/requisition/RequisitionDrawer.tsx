"use client";
import React, { useEffect } from 'react';
import { Drawer, Box, Typography, Button, IconButton, Select, MenuItem, FormControl, InputLabel, Divider, Stack, Chip, useTheme, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { Requisition, RequisitionPosition } from '@/interface/requisition';
import { useAppDispatch } from '@/store/hooks';
import { fetchRequisitionById } from '@/store/features/requisitionSlice';

interface RequisitionDrawerProps {
  open: boolean;
  onClose: () => void;
  requisition: Partial<Requisition> | null;
}

const recruiters = ['John Smith', 'Sarah Chen', 'David Lee']; // Mock data

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1rem' }}>{title}</Typography>
        </Stack>
        <Box sx={{ pl: 4.5 }}>
            {children}
        </Box>
    </Box>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{value || 'N/A'}</Typography>
    </Box>
);

const RequisitionDrawer: React.FC<RequisitionDrawerProps> = ({ open, onClose, requisition }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (requisition?.requisition_id && !requisition.stakeholder_names) {
            dispatch(fetchRequisitionById(requisition.requisition_id));
        }
    }, [dispatch, requisition]);

    console.log(`the requisition in the drawer is => ${JSON.stringify(requisition)}`)

    const handleApprove = () => {
        console.log('Approved:', requisition?.requisition_id);
        onClose();
    };

    const handleHold = () => {
        console.log('On Hold:', requisition?.requisition_id);
        onClose();
    };

    const handleAssignRecruiter = (recruiter: string) => {
        console.log(`Assigning ${recruiter} to requisition ${requisition?.requisition_id}`);
    };

    const renderContent = () => {
        if (!requisition) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            );
        }

        return (
            <>
                <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">{requisition.position}</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Section title="Requester Information" icon={<PersonOutlineIcon color="primary"/>}>
                    {requisition.requisition_raised_by}
                        <DetailItem label="Requested By" value={requisition.requisition_raised_by} />
                        <DetailItem label="Designation" value={"Hiring Manager"} />
                        <DetailItem label="Head of Department" value={"Jane Doe"} />
                    </Section>

                    <Section title="Position Details & Timeline" icon={<BusinessCenterOutlinedIcon color="primary"/>}>
                        <DetailItem label="Date Submitted" value={new Date(requisition.submitted_date || '').toLocaleDateString()} />
                        <DetailItem label="Expected Start Date" value={requisition.expected_start_date ? new Date(requisition.expected_start_date).toLocaleDateString() : 'N/A'} />
                        <DetailItem label="Number of Positions" value={requisition.num_positions} />
                    </Section>

                    <Section title="Proposed Salary" icon={<AttachMoneyOutlinedIcon color="primary"/>}>
                        <DetailItem label="Budget" value={requisition.proposed_salary} />
                    </Section>

                    <Section title="Hiring By Location" icon={<LocationOnOutlinedIcon color="primary"/>}>
                        {requisition.positions_list?.map((pos: any, index: number) => (
                            <DetailItem key={index} label={pos.loc} value={`${pos.qty} position(s)`} />
                        )) || (requisition.requisition_positions && requisition.requisition_positions.map((pos: RequisitionPosition) => (
                            <DetailItem key={pos.position_slot_id} label={pos.location} value={`${pos.slot_number} position(s)`} />
                        )))}
                    </Section>

                    <Section title="Reason for Recruitment" icon={<AssignmentIndOutlinedIcon color="primary"/>}>
                        <Typography variant="body2">{"To backfill the position of a departing employee and support the growing needs of the engineering team for the new 'Phoenix' project."}</Typography>
                    </Section>

                    <Section title="Stakeholders" icon={<PeopleOutlineIcon color="primary"/>}>
                        {requisition.stakeholder_names ?
                            requisition.stakeholder_names.map((s: any) => <DetailItem key={s.id} label={s.name} value="Stakeholder" />)
                            : <CircularProgress size={20}/>
                        }
                    </Section>
                </Box>

                <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="recruiter-select-label">Assign Recruiter</InputLabel>
                        <Select
                            labelId="recruiter-select-label"
                            label="Assign Recruiter"
                            defaultValue=""
                            onChange={(e) => handleAssignRecruiter(e.target.value)}
                            sx={{ backgroundColor: theme.palette.background.paper }}
                        >
                            {recruiters.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" fullWidth color="success" onClick={handleApprove}>Approve Requisition</Button>
                        <Button variant="outlined" fullWidth color="warning" onClick={handleHold}>On Hold</Button>
                    </Stack>
                </Box>
            </>
        );
    };


  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { backgroundColor: 'background.paper', width: 480, display: 'flex', flexDirection: 'column' } }}>
      {renderContent()}
    </Drawer>
  );
};

export default RequisitionDrawer;
