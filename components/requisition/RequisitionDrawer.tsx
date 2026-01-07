"use client";
import React, { useEffect, useState } from 'react';
import { Drawer, Box, Typography, Button, IconButton, Select, MenuItem, FormControl, InputLabel, Divider, Stack, Chip, useTheme, CircularProgress, Card, CardContent, Grid, Paper, SelectChangeEvent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CurrencyExchangeOutlined from '@mui/icons-material/CurrencyExchangeOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { RecruiterSelection, Requisition, RequisitionPosition } from '@/interface/requisition';
import { User } from "@/interface/user";
import { AppRole } from '@/utils/constants';
import { formatRoleName } from '@/utils/transform';
import { useSelector } from 'react-redux';
import {  RootState } from '@/redux/store';
import { fetchRequisitionById, handleApproveRequisition } from '@/redux/slices/requisition';
import { fetchRecruiters } from '@/redux/slices/user';
import { holdRequisition } from '@/api/requisitionApi';
import { enqueueSnackbar } from '@/components/NotistackProvider';


interface RequisitionDrawerProps {
  open: boolean;
  onClose: () => void;
  requisition: Partial<Requisition> | null;
}

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                {icon}
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
            </Stack>
            <Stack direction="column" spacing={1.5}>
                {children}
            </Stack>
        </CardContent>
    </Card>
);

const DetailItem  = ({ label, value }: { label: string; value: React.ReactNode | string | number | undefined }) => (
    <Box>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>{value || 'N/A'}</Typography>
    </Box>
);

const RequisitionDrawer = ({ open, onClose, requisition }: RequisitionDrawerProps) => {
    const theme = useTheme();
    const {recruiters} = useSelector((state: RootState) => state.users)
    const allRecruiters = recruiters;
    
    const [selectedRecruiters, setSelectedRecruiters] = useState<RecruiterSelection[]>([]);

    useEffect(() => {
        if (requisition?.requisition_id && !requisition.stakeholder_names) {
            fetchRequisitionById(requisition.requisition_id);
        }
        fetchRecruiters(AppRole.Recruiter)
    }, [ requisition]);

    const handleApprove = () => {
        if(selectedRecruiters.length === 0){ 
            enqueueSnackbar('Recruiters are needed to approve a requisition', { variant: 'error' });
            return;
        }
        console.log('Approved:', requisition?.requisition_id, selectedRecruiters);
        if(requisition?.requisition_id){ 
            handleApproveRequisition({ recruiters: selectedRecruiters, requisitionId: requisition?.requisition_id});
        }
        onClose();
    };

    const handleHold = () => {
        if(requisition?.requisition_id){ 
            holdRequisition(requisition?.requisition_id)
        }
        onClose();
    };

    const handleAssignRecruiter = (recruiters: RecruiterSelection[]) => {
        console.log(`Assigning ${JSON.stringify(recruiters)} to requisition ${requisition?.requisition_id}`);
    };

    const handleRecruiterChange = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event;
        const selectedIds = typeof value === 'string' ? value.split(',') : value;
        const selectedRecruiterObjects = selectedIds.map(id => {
            const recruiter = allRecruiters.find(r => r.user_id === id);
            return { userId: id, roleId: recruiter?.role_id || "" }; // Assuming role_name exists on recruiter
        });
        setSelectedRecruiters(selectedRecruiterObjects);
        console.log(`selected recruiters => ${JSON.stringify(selectedRecruiterObjects)}`);
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" color='text.secondary' sx={{ fontWeight: 600 }}>{requisition.position}</Typography>
                        <IconButton onClick={onClose} size="large">
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 4 }} />

                    <Section title="Requester Information" icon={<PersonOutlineIcon color="primary" fontSize="small"/>}>
                        <DetailItem label="Requested By" value={requisition.requisition_raised_by} />
                        <DetailItem label="Department" value={requisition.department} /> {/* Mock data for now */}
                        
                    </Section>

                    <Section title="Position Details & Timeline" icon={<BusinessCenterOutlinedIcon color="primary" fontSize="small"/>}>
                        <DetailItem label="Date Submitted" value={new Date(requisition.submitted_date || '').toLocaleDateString()} />
                        <DetailItem label="Expected Start Date" value={requisition.expected_start_date ? new Date(requisition.expected_start_date).toLocaleDateString() : 'N/A'} />
                        <DetailItem label="Number of Positions" value={requisition.num_positions} />
                    </Section>

                    <Section title="Proposed Salary" icon={<CurrencyExchangeOutlined color="primary" fontSize="small"/>}>
                        <DetailItem label="Budget" value={requisition.proposed_salary ? new Intl.NumberFormat().format(Number(requisition.proposed_salary)) : 'N/A'} />
                    </Section>

                    <Section title="Hiring By Location" icon={<LocationOnOutlinedIcon color="primary" fontSize="small"/>}>
                        {((requisition.positions_list || requisition.requisition_positions)?.length === 0) && <Typography variant="body2" color="text.secondary">N/A</Typography>}
                        {(requisition.positions_list || requisition.requisition_positions)?.map((pos: any) => (
                            <Stack key={pos.position_slot_id || pos.loc} direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mb: 1.5 }}>
                                <Typography variant="body2" color="text.primary">
                                    {pos.loc || pos.location}
                                </Typography>

                                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                                    {pos.qty || pos.slot_number} position(s)
                                </Typography>
                                
                            </Stack>
                        ))}
                      </Section>

                    <Section title="Reason for Recruitment" icon={<AssignmentIndOutlinedIcon color="primary" fontSize="small"/>}>
                        <Typography variant="body2">{requisition.recruitment_reason || 'N/A'}</Typography> {/* Mock data for now */}
                    </Section>

                    <Section title="Stakeholders" icon={<PeopleOutlineIcon color="primary" fontSize="small"/>}>
                        {requisition.stakeholder_names ?
                            requisition.stakeholder_names.map((s: any) => <DetailItem key={s.id} label={s.name} value={formatRoleName(s.role)} />)
                            : <Box><CircularProgress size={20}/></Box>
                        }
                    </Section>
                </Box>

                <Paper sx={{ p: 3, mt: 'auto', borderTop: `1px solid ${theme.palette.divider}`, borderRadius: '0px !important' }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="recruiter-select-label">Assign Recruiter</InputLabel>
                        <Select
                            labelId="recruiter-select-label"
                            label="Assign Recruiter"
                            multiple
                            value={selectedRecruiters.map(r => r.userId)}
                            onChange={handleRecruiterChange}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const recruiter = allRecruiters.find(r => r.user_id === value);
                                        return <Chip key={value} label={recruiter?.full_name || value} />;
                                    })}
                                </Box>
                            )}
                            sx={{ backgroundColor: theme.palette.background.paper }}
                        >
                            {allRecruiters?.map(r => <MenuItem key={r.user_id} value={r.user_id}>{r.full_name} - {r.email}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" fullWidth color="primary" onClick={() => handleApprove()}>Approve Requisition</Button>
                        <Button variant="contained" fullWidth color="error" onClick={() => handleHold()}>On Hold</Button>
                    </Stack>
                </Paper>
            </>
        );
    };


  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 550 }, display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default } }}>
      {renderContent()}
    </Drawer>
  );
};

export default RequisitionDrawer;