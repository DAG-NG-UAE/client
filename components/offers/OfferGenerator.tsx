"use client";

import React, { JSX, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  Button, 
  IconButton, 
  Avatar, 
  Chip,
  Divider,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton
} from '@mui/material';
import { 
  Visibility, 
  Send, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Business,
  DragIndicator,
  ExpandMore
} from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchSingleCandidate } from '@/redux/slices/candidates';
import { fetchMasterClauses, addSelectedClause, removeSelectedClause, setSelectedClauses, fetchOfferById, clearOfferState } from '@/redux/slices/offer';
import { ClauseItem } from '@/components/offers/ClauseItem';
import { Highlight } from '@/components/offers/Highlight';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import { Clauses, ExtendedClause } from '@/interface/offer';
import { GenerateSalaryTable } from './GenerateSalaryTable';

// DnD Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatOfferDate } from '@/utils/transform';
import { generateOffer, updateOffer } from '@/api/offer';
import { enqueueSnackbar } from 'notistack';
import { getAllSignatures } from '@/api/signature';
import { Signature } from '@/interface/signature';

function SortableClause({ id, title, content, onRemove, isPreviewMode }: { id: string, title: string, content: React.ReactNode, onRemove?: () => void, isPreviewMode?: boolean }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: isPreviewMode ? 'default' : 'grab', 
      marginBottom: '16px',
      position: 'relative' as 'relative',
      border: isDragging ? '2px solid #2563EB' : '1px solid transparent',
      backgroundColor: isDragging ? '#F8FAFC' : 'transparent',
      borderRadius: '8px',
      zIndex: isDragging ? 1000 : 1,
      // touchAction: 'none' // Required for pointer sensor sometimes
    };
  
    return (
      <Box ref={setNodeRef} style={style} sx={{ ...(isPreviewMode ? {} : {'&:hover .remove-btn': { opacity: 1 }}) }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {/* This is the handle for dragging */}
          {!isPreviewMode && (
          <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', mr: 1 }}>
            <DragIndicator fontSize="small" sx={{ color: 'text.disabled' }} />
          </Box>
          )}
          
          <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', fontWeight: 'bold', flexGrow: 1 }}>
            {title}
          </Typography>

          {!isPreviewMode && (
          <IconButton 
            className="remove-btn" 
            size="small" 
            onClick={onRemove}
            sx={{ opacity: 0, transition: '0.2s', color: 'error.main' }}
          >
            <Box sx={{ fontSize: '1.2rem' }}>×</Box>
          </IconButton>
          )}
        </Box>
        
        <Typography component="div" sx={{ lineHeight: 1.6, fontSize: '0.85rem', color: 'text.secondary', ml: isPreviewMode ? 0 : 4 }}> 
            {content}
        </Typography>
      </Box>
    );
}

interface OfferGeneratorProps {
    candidateId?: string;
    existingOfferId?: string;
}

export default function OfferGenerator({ candidateId, existingOfferId }: OfferGeneratorProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const {selectedCandidate} = useSelector((state:RootState) => state.candidates)
  const {masterClauses, selectedClauses, currentOffer} = useSelector((state:RootState) => state.offers)


  
  // Signatures
  const [signatories, setSignatories] = useState<Signature[]>([]);

  // State for form fields
  const [salary, setSalary] = useState('145,000');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [probation, setProbation] = useState('6');
  const [noticePeriod, setNoticePeriod] = useState(4);
  const [noticeUnit, setNoticeUnit] = useState('Days');

  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Company Details 
  const [companyName, setCompanyName] = useState('Dubai Auto Gallery'); 
  // Employment Details template literal prefill 
  const [position, setPosition] = useState(selectedCandidate?.role_applied_for || '');
  const [location, setLocation] = useState('Ikeja-Lagos-Onsite');
  const [isRemote, setIsRemote] = useState(false);
  
  // Work Days & Hours
  const [weekdayStart, setWeekdayStart] = useState('Monday');
  const [weekdayEnd, setWeekdayEnd] = useState('Friday');
  const [weekdayStartTime, setWeekdayStartTime] = useState('08:00');
  const [weekdayEndTime, setWeekdayEndTime] = useState('17:00');
  
  const [weekendIncluded, setWeekendIncluded] = useState(false);
  const [weekendDays, setWeekendDays] = useState<string[]>(['Saturday']); // Default Sat
  const [weekendStartTime, setWeekendStartTime] = useState('09:00');
  const [weekendEndTime, setWeekendEndTime] = useState('14:00');

  const [leaveDays, setLeaveDays] = useState('20');
  const [line_manager, setLineManager] = useState('');
  
  // Salary Breakdown State (Monthly values)
  const [breakdownBasic, setBreakdownBasic] = useState('73850');
  const [breakdownHousing, setBreakdownHousing] = useState('31650');
  const [breakdownTransport, setBreakdownTransport] = useState('21100');
  const [breakdownAllowance, setBreakdownAllowance] = useState('84400');
  
  // Special Provision State
  const [openProvisionDialog, setOpenProvisionDialog] = useState(false);
  const [provisionText, setProvisionText] = useState('');
  
  const handleAddProvision = () => {
    if(!provisionText.trim()) return;
    const clauseId = masterClauses.find((clause) => clause.title === 'Special Provision');

    if(!clauseId) { 
        setOpenProvisionDialog(false)
        return 
    };
    const newClause: ExtendedClause = {
        master_clause_id: clauseId?.master_clause_id!,
        title: 'Special Provision',
        content: provisionText,
        is_mandatory: false,
        instanceId: `special-${Date.now()}`,
        sort_order: selectedClauses?.length || 0,
        custom_content: provisionText
    };
    
    dispatch(addSelectedClause(newClause));
    setProvisionText('');
    setOpenProvisionDialog(false);
}

  // Authorized Personnels to sign
  const [selectedSignatory, setSelectedSignatory] = useState<Signature | null>(null);

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initial Data Fetch
  useEffect(() => {
     fetchMasterClauses();

     const loadSignatures = async () => {
         try {
             const data = await getAllSignatures();
             setSignatories(data);
             if (data.length > 0) {
                 setSelectedSignatory(data[0]);
             }
         } catch (e) {
             console.error("Failed to load signatures", e);
         }
     };
     loadSignatures();

     if (candidateId) {
         fetchSingleCandidate(candidateId);
     }

     if (existingOfferId) {
         fetchOfferById(existingOfferId);
     }
  }, [candidateId, existingOfferId]);
//   console.log(`this is the current offer for the candidate ${JSON.stringify(currentOffer)}`)

  // If we didn't have candidateId initially, but we have an offer now, fetch the candidate from the offer
  useEffect(() => {
      if (!candidateId && currentOffer && currentOffer.candidate_id) {
          fetchSingleCandidate(currentOffer.candidate_id);
      }
  }, [currentOffer, candidateId]);

  // Populate form with existing offer details if available
  useEffect(() => {
    if (existingOfferId && currentOffer && currentOffer.offer_id === existingOfferId) {
        console.log('we can start setting the salary net erc ')
        if(currentOffer.salary_net) setSalary(currentOffer.salary_net.toString());
        if(currentOffer.commencement_date) setStartDate(currentOffer.commencement_date);
        if(currentOffer.position) setPosition(currentOffer.position);
        if(currentOffer.location) setLocation(currentOffer.location);
        if(currentOffer.company_name) setCompanyName(currentOffer.company_name);
        
        // Populate clauses
        if(currentOffer.clauses && currentOffer.clauses.length > 0) {
            console.log('in here, there is the clauses as well so let us set the mapped clauses')
            // console.log(currentOffer.clauses);
            const mappedClauses = currentOffer.clauses.map((c, i) => ({
                ...c,
                instanceId: `${c.master_clause_id}-rev-${i}`,
                sort_order: i
            })) as ExtendedClause[];
            dispatch(setSelectedClauses(mappedClauses));
        }

        // Note: Other fields might need to be populated if the API returns them or if they are stored in the offer json
        // For now, these are the main ones available in the Offer interface
    }
  }, [existingOfferId, currentOffer, dispatch]);

  console.log(`the selected clauses are ${JSON.stringify(selectedClauses)}`)
  console.log('-----------------------------------------------------')
  console.log(`the master clauses are ${JSON.stringify(masterClauses)}`)

  // populate default mandatories ONLY if not editing an existing offer (or if existing offer has no clauses?)
  // If we are editing, we trust the effect above to set clauses.
  // If we assume new offer always starts with 0 selected clauses, then this logic holds.
  useEffect(() => {
    if(!existingOfferId && masterClauses && masterClauses?.length > 0 && selectedClauses?.length === 0) {
        const mandatory = masterClauses.filter(c => c.is_mandatory)
            .map(c => ({...c, instanceId: `mandatory-${c.master_clause_id}`, sort_order: 0})) as ExtendedClause[];
        if(mandatory.length > 0) dispatch(setSelectedClauses(mandatory));
    }
  }, [masterClauses, existingOfferId, selectedClauses, dispatch]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active.id !== over?.id) {
        const items = selectedClauses;
        const oldIndex = items.findIndex((item) => item.instanceId === active.id);
        const newIndex = items.findIndex((item) => item.instanceId === over?.id);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
      
        // Update the sort_order property for every item based on its new index
        const updated = newArray.map((item, index) => ({
          ...item,
          sort_order: index // This keeps the DB and UI in sync
        }));
        
        dispatch(setSelectedClauses(updated));
    }
  };

  const handleToggleClause = (clause: Partial<Clauses>) => {
      const existing = selectedClauses?.find(c => c.master_clause_id === clause.master_clause_id);
      if (existing) {
          dispatch(removeSelectedClause(existing.instanceId));
      } else {
          const newClause: ExtendedClause = {
              ...clause as Clauses,
              instanceId: `${clause.master_clause_id}-${Date.now()}`,
              sort_order: selectedClauses?.length || 0
          };
          dispatch(addSelectedClause(newClause));
      }
  }

  const handleRemoveClause = (instanceId: string) => {
      dispatch(removeSelectedClause(instanceId));
  };

  const handleSendOffer = async() => {
      const effectiveCandidateId = candidateId || currentOffer?.candidate_id;
      if (!effectiveCandidateId) {
          alert("Candidate ID missing");
          return;
      }

      // 2. Prepare Clauses Mapping
      const clausesPayload = selectedClauses?.map((clause, index) => ({
          master_clause_id: clause.master_clause_id,
          // instance_id: clause.instanceId,
          sort_order: index, // Explicitly taking the index as sort_order
          custom_content: clause.custom_content || null
      })) || [];
      const payload = {
        candidate_id: effectiveCandidateId,
        requisition_id: selectedCandidate?.requisition_id,
        position: position,
        location: location,
        remote: isRemote ? "Remote" : "No Remote / Flex Time",
        commencement_date: startDate,
        company_name: companyName,
        weekday_work_start: weekdayStart,
        weekday_work_end: weekdayEnd, 
        weekday_working_hour_start: weekdayStartTime, 
        weekday_working_hour_end: weekdayEndTime,
        weekend_included: weekendIncluded,
        weekend_working_hour_start: weekendIncluded ? weekendStartTime : "", 
        weekend_working_hour_end: weekendIncluded ? weekendEndTime : "",
        probation_period: probation,
        notice_period: noticePeriod,
        notice_unit: noticeUnit,
        leave_days: leaveDays,
        reporting_to: line_manager,
        // signatory_id: selectedSignatory?.signatory_id, 
        clause_order: clausesPayload, 
        monthly_basic: breakdownBasic || null,
        monthly_housing: breakdownHousing || null,
        monthly_transport: breakdownTransport || null,
        other_allowance: breakdownAllowance || null,
        status: existingOfferId ? 'pending' : undefined
      }

      console.log(`payload: ${JSON.stringify(payload)}`)

      if(existingOfferId){ 
        await updateOffer(payload, existingOfferId);
        dispatch(clearOfferState())
        enqueueSnackbar("Offer updated successfully", { variant: "success" });
        
      }else{ 
        const response = await generateOffer(payload);
        if(response.offer_id && response.token){ 
          enqueueSnackbar(`offer generated. Offer token is ${response.token}`, { variant: "success" });
        }
      }
  }

  const interpolateContent = (text: string) => {
      if(!text) return "";
      // Replacements map
      // We assume simple placeholders like {salary} for now. 
      // Adjust keys to match your actual Master Clause content format.
      const replacements: Record<string, string | JSX.Element> = {
          '{{company_name}}': <Highlight text={companyName} />,
          '{{position}}': <Highlight text={position} />,
          '{{location}}': <Highlight text={`${location} (${isRemote ? 'Remote' : 'No Remote / Flex Time'})`} />,
          '{{work_days}}': <Highlight text={`${weekdayStart} to ${weekdayEnd}${weekendIncluded && weekendDays.length > 0 ? (' & ' + weekendDays.join(', ')) : ''}`} />,
          '{{work_time}}': <Highlight text={`${weekdayStartTime} - ${weekdayEndTime}${weekendIncluded ? ` (${weekendDays.length > 0 ? 'Weekends: ' + weekendDays.join(', ') : ''}: ${weekendStartTime} - ${weekendEndTime})` : ''}`} />,
          '{{leave_days}}': <Highlight text={leaveDays} />,

          '{{salary_net}}': <Highlight text={`N${salary}`} />,
          '{{start_date}}': <Highlight text={formatOfferDate(startDate)} />,
          '{{probation_period}}': <Highlight text={probation} />,
          '{{notice_period}}': <Highlight text={`${noticePeriod} ${noticeUnit}`} />,
          '{{candidate_name}}': selectedCandidate?.candidate_name || 'Candidate',
          '{{role}}': selectedCandidate?.role_applied_for || 'Role',
          '{{department}}': selectedCandidate?.department || 'Department',

          '{{line_manager}}': <Highlight text={line_manager} />,
          '{{salary_breakdown_table}}': <GenerateSalaryTable 
                                            basic={parseFloat(breakdownBasic) || 0}
                                            housing={parseFloat(breakdownHousing) || 0}
                                            transport={parseFloat(breakdownTransport) || 0}
                                            allowance={parseFloat(breakdownAllowance) || 0}
                                        />,

      };

      const regex = /({{[a-zA-Z_]+}})/g;
      const parts = text.split(regex);

      return parts.map((part, i) => {
          if (replacements[part]) {
              return <React.Fragment key={i}>{replacements[part]}</React.Fragment>;
          }
          return part;
      });
  }

  if(!selectedCandidate){ 
    return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Top Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={selectedCandidate?.candidate_name} 
            alt={selectedCandidate?.candidate_name}
            sx={{ width: 48, height: 48 }}
          >
            {selectedCandidate?.candidate_name?.charAt(0)}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {selectedCandidate?.candidate_name}
              </Typography>
              <Chip 
                {...getStatusChipProps(selectedCandidate.current_status)}  
                size="small" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '0.7rem',
                  height: 20,
                  ...(getStatusChipProps(selectedCandidate.current_status).sx || {})
                }} 
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {selectedCandidate?.role_applied_for} · {selectedCandidate?.department}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1}}>
          <Button variant="outlined" color="inherit" size='small'>
            Save Draft
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Visibility />} 
            color={isPreviewMode ? "secondary" : "inherit"} 
            size='small'
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? "Exit Preview" : "Preview as Candidate"}
          </Button>
          <Button variant="contained" startIcon={<Send />} color="primary" size='small' onClick={handleSendOffer}>
            Finalize & Send Offer
          </Button>
        </Box>
      </Paper>

      {/* Main Content Split - FLEX LAYOUT */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 2, 
        flexGrow: 1,
        minHeight: 0 // Crucial for scrolling inside flex items
      }}>
        {/* Left Sidebar - Controls */}

        {!isPreviewMode && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          width: { xs: '100%', md: '360px', lg: '400px' },
          flexShrink: 0,
          overflowY: 'auto',
          pr: 0.5 // small padding for scrollbar
        }}>
            
            {/* Essential Details Card */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ color: theme.palette.primary.main }}>📝</Box> Essential Details
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">COMPANY NAME</Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    sx={{ mb: 2 }}
                  />
                </Box>

                {/* Location, work days, work time  */}
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">LOCATION & REMOTE</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField 
                        fullWidth 
                        size="small" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} size="small" />}
                        label={<Typography variant="caption">Remote</Typography>}
                        sx={{ mr: 0 }}
                    />
                  </Box>

                  <Typography variant="caption" fontWeight="bold" color="text.secondary">REPORTING TO</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField 
                        fullWidth 
                        size="small" 
                        value={line_manager} 
                        onChange={(e) => setLineManager(e.target.value)} 
                    />
                  </Box>
                  
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">WORK DAYS</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                     <TextField 
                        select 
                        fullWidth 
                        size="small"
                        value={weekdayStart}
                        onChange={(e) => setWeekdayStart(e.target.value)}
                     >
                         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                     </TextField>
                     <TextField 
                        select 
                        fullWidth 
                        size="small"
                        value={weekdayEnd}
                        onChange={(e) => setWeekdayEnd(e.target.value)}
                     >
                         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                     </TextField>
                  </Box>

                  <FormControlLabel
                        control={<Checkbox checked={weekendIncluded} onChange={(e) => setWeekendIncluded(e.target.checked)} size="small" />}
                        label={<Typography variant="caption">Include Weekend?</Typography>}
                        sx={{ mb: 1 }}
                    />

                  {weekendIncluded && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 1, ml: 1 }}>
                        {['Saturday', 'Sunday'].map(day => (
                            <FormControlLabel
                                key={day}
                                control={
                                    <Checkbox 
                                        checked={weekendDays.includes(day)} 
                                        onChange={(e) => {
                                            if(e.target.checked) setWeekendDays(prev => [...prev, day]);
                                            else setWeekendDays(prev => prev.filter(d => d !== day));
                                        }} 
                                        size="small" 
                                        sx={{ p: 0.5 }}
                                    />
                                }
                                label={<Typography variant="caption">{day}</Typography>}
                            />
                        ))}
                    </Box>
                  )}
                  
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">WORK TIMES</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField 
                            type="time"
                            size="small"
                            fullWidth
                            value={weekdayStartTime}
                            onChange={(e) => setWeekdayStartTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                         <TextField 
                            type="time"
                            size="small"
                            fullWidth
                            value={weekdayEndTime}
                            onChange={(e) => setWeekdayEndTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                  </Box>

                  {weekendIncluded && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: '#f0f9ff', borderRadius: 1 }}>
                          <Typography variant="caption" color="primary" fontWeight="bold">WEEKEND HOURS</Typography>
                           <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <TextField 
                                    type="time"
                                    size="small"
                                    fullWidth
                                    value={weekendStartTime}
                                    onChange={(e) => setWeekendStartTime(e.target.value)}
                                    // InputLabelProps={{ shrink: true }}
                                />
                                <TextField 
                                    type="time"
                                    size="small"
                                    fullWidth
                                    value={weekendEndTime}
                                    onChange={(e) => setWeekendEndTime(e.target.value)}
                                    // InputLabelProps={{ shrink: true }}
                                />
                        </Box>
                      </Box>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">SALARY COMPONENTS (MONTHLY)</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">BASIC</Typography>
                      <TextField
                            
                            size="small"
                            type="number"
                            value={breakdownBasic}
                            onChange={(e) => setBreakdownBasic(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start">N</InputAdornment> }}
                       />
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">HOUSING</Typography>
                      <TextField
                            size="small"
                            type="number"
                            value={breakdownHousing}
                            onChange={(e) => setBreakdownHousing(e.target.value)}
                             InputProps={{ startAdornment: <InputAdornment position="start">N</InputAdornment> }}
                       />
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">TRANSPORT</Typography>
                      <TextField
                            size="small"
                            type="number"
                            value={breakdownTransport}
                            onChange={(e) => setBreakdownTransport(e.target.value)}
                             InputProps={{ startAdornment: <InputAdornment position="start">N</InputAdornment> }}
                       />
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">OTHER ALLOWANCES</Typography>
                      <TextField
                            size="small"
                            type="number"
                            value={breakdownAllowance}
                            onChange={(e) => setBreakdownAllowance(e.target.value)}
                             InputProps={{ startAdornment: <InputAdornment position="start">N</InputAdornment> }}
                       />
                    </Box>
                </Box>
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    MONTHLY NET SALARY
                  </Typography>
                  <TextField 
                    fullWidth 
                    value={salary} 
                    onChange={(e) => setSalary(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">N</InputAdornment>,
                    }}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    LEAVE DAYS
                  </Typography>
                  <TextField 
                    fullWidth 
                    value={leaveDays} 
                    onChange={(e) => setLeaveDays(e.target.value)}
                    size="small"
                  />
                </Box>

                {/* Split Row: Start Date & Probation */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      START DATE
                    </Typography>
                    <TextField 
                      fullWidth 
                      type="date"
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      PROBATION
                    </Typography>
                    <TextField 
                      select 
                      fullWidth 
                      value={probation} 
                      onChange={(e) => setProbation(e.target.value)}
                      size="small"
                    >
                        <MenuItem value="3">3 Months</MenuItem>
                        <MenuItem value="6">6 Months</MenuItem>
                    </TextField>
                  </Box>
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      NOTICE PERIOD
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ width: '35%' }}>
                             <TextField 
                                fullWidth 
                                type="number"
                                value={noticePeriod} 
                                onChange={(e) => setNoticePeriod(Number(e.target.value))}
                                size="small"
                              />
                        </Box>
                        {/* <Box sx={{ flex: 1 }}>
                             <TextField 
                                select 
                                fullWidth 
                                value={noticeUnit} 
                                onChange={(e) => setNoticeUnit(e.target.value)}
                                size="small"
                              >
                                  <MenuItem value="Weeks">Weeks</MenuItem>
                                  <MenuItem value="Months">Months</MenuItem>
                              </TextField>
                        </Box> */}
                    </Box>
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      AUTHORIZED SIGNATORY
                    </Typography>

                    <TextField
                      select
                      value={selectedSignatory?.signature_id || ''}
                      onChange={(e) => {
                          const sig = signatories.find(s => s.signature_id === e.target.value);
                          setSelectedSignatory(sig || null);
                      }}
                      fullWidth
                      size="small"
                    >
                    {signatories.map((sig) => (
                      <MenuItem key={sig.signature_id} value={sig.signature_id}>
                        {sig.user_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                

              </Box>
            </Paper>

            {/* Clause Library Card */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: theme.palette.primary.main }}>📄</Box> Clause Library
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                      View All
                  </Typography>
               </Box>

               <Paper 
                component="form" 
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2, bgcolor: theme.palette.background.default, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}
              >
                <IconButton sx={{ p: '10px' }} aria-label="search">
                  <Search fontSize='small' />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
                  placeholder="Search clauses..."
                  inputProps={{ 'aria-label': 'search clauses' }}
                />
              </Paper>
              
              <Button 
                variant="outlined" 
                sx={{ 
                    mb: 2, 
                    borderStyle: 'dashed', 
                    borderWidth: '1px', 
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                        borderStyle: 'dashed',
                        bgcolor: 'primary.lighter'
                    }
                }}
                fullWidth
                size="small"
                onClick={() => setOpenProvisionDialog(true)}
              >
                  + Add Special Provision
              </Button>

              <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {(() => {
                    const groupedClauses = masterClauses?.reduce((acc, clause) => {
                        const groupName = clause.company_name || 'General';
                        if (!acc[groupName]) {
                            acc[groupName] = [];
                        }
                        acc[groupName].push(clause);
                        return acc;
                    }, {} as Record<string, Partial<Clauses>[]>) || {};

                    return Object.entries(groupedClauses).map(([groupName, clauses]) => (
                        <Accordion key={groupName} disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', '&:not(:last-child)': { borderBottom: 0 }, '&:before': { display: 'none' } }} defaultExpanded={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls={`panel-${groupName}-content`}
                                id={`panel-${groupName}-header`}
                                sx={{ bgcolor: 'background.neutral' }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">{groupName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 1 }}>
                                {clauses.map((clause) => {
                                    const isSelected = selectedClauses?.some(c => c.master_clause_id === clause.master_clause_id);
                                    return (
                                        <Box key={clause.master_clause_id} sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                            <ClauseItem 
                                                title={clause.title!} 
                                                description={clause.content ? (clause.content.substring(0, 60) + '...') : ''}
                                                onAdd={() => handleToggleClause(clause)}
                                                isSelected={isSelected}
                                            />
                                        </Box>
                                    );
                                })}
                            </AccordionDetails>
                        </Accordion>
                    ));
                })()}
              </Box>

            </Paper>
        </Box>
        )}

        {/* Right Panel - Live Preview */}
        <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minWidth: 0 
        }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexShrink: 0 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Live Preview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handleZoomOut} size="small"><ZoomOut fontSize="small" /></IconButton>
                  <Typography variant="caption" fontWeight="bold">{zoomLevel}%</Typography>
                  <IconButton onClick={handleZoomIn} size="small"><ZoomIn fontSize="small" /></IconButton>
              </Box>
           </Box>
           
           <Box sx={{ 
               flexGrow: 1, 
               bgcolor: isPreviewMode ? '#1e293b' : '#F3F4F6', // Dark background in preview mode
               borderRadius: 2,
               overflow: 'auto',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'flex-start',
               p: 4,
               border: `1px solid ${theme.palette.divider}`,
               transition: 'background-color 0.3s ease'
           }}>
             <Paper 
              elevation={3} 
              sx={{ 
                  p: 8, 
                  width: '210mm', 
                  minHeight: '297mm',
                  bgcolor: 'white', 
                  transform: `scale(${zoomLevel / 100})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease-in-out',
                  mb: 4 
              }}
             >
                {/* Letter Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, bgcolor: '#2563EB', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Business sx={{ color: 'white' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold">{companyName}</Typography>
                    </Box>
                    {/* <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" display="block" color="text.secondary">123 Innovation Drive</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">San Francisco, CA 94103</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">+1 (555) 123-4567</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">hr@acmecorp.com</Typography>
                    </Box> */}
                </Box>
              
                <Divider sx={{ mb: 6 }} />
                
                <Typography paragraph color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                   {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>

                {/* <Box sx={{ mb: 4 }}>
                    <Typography fontWeight="bold">{selectedCandidate?.candidate_name}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>42 Design Avenue</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>Brooklyn, NY 11201</Typography>
                </Box> */}

                <Typography paragraph sx={{ mb: 2, fontSize: '0.85rem' }}>
                    Dear {selectedCandidate?.candidate_name?.split(' ')[0]},
                </Typography>

                {/* <Typography paragraph sx={{ mb: 4, lineHeight: 1.8, fontSize: '0.85rem' }}>
                    We are pleased to offer you the position of <strong>{selectedCandidate?.role_applied_for}</strong> at Acme Corp. We are impressed with your skills and experience and believe you will be a fantastic addition to our {selectedCandidate?.department}.
                </Typography> */}

                {/* DnD Context for Clauses */}
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext 
                        items={selectedClauses?.map(c => c.instanceId) || []}
                        strategy={verticalListSortingStrategy}
                    >
                        {selectedClauses?.map((clause) => (
                            <SortableClause 
                                key={clause.instanceId} 
                                id={clause.instanceId} 
                                title={clause.title} 
                                content={interpolateContent(clause.content)} 
                                onRemove={() => handleRemoveClause(clause.instanceId)}
                                isPreviewMode={isPreviewMode}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                {selectedClauses?.length === 0 && (
                    <Box sx={{ p: 4, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">No clauses selected. Add clauses from the library on the left.</Typography>
                    </Box>
                )}

                <Box sx={{ mt: 6 }}>
                  <Typography variant="body1">Yours Sincerely,</Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
                    For: {companyName.toUpperCase()}
                  </Typography>
                  
                  {/* The Signature Image */}
                 <Box sx={{ position: 'relative', width: 'fit-content' }}>
                    {/* The Signature Image */}
                    <img 
                      src={selectedSignatory ? `http://localhost:5000/${selectedSignatory.signature_path.replace(/\\/g, '/').replace(/^\/+/, '')}` : ''} 
                      style={{ 
                        height: '70px', 
                        display: 'block',
                        filter: 'contrast(1.1)' // Makes it pop
                      }} 
                      alt="signature"
                    />

                    {/* The Overlapping Watermark */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: '10px', 
                        left: '20px', 
                        width: '80px', 
                        height: '80px',
                        opacity: 0.2, // Keep it faint but visible
                        pointerEvents: 'none', // Can't right-click the watermark instead of sig
                        backgroundImage: 'url(/Company-Seal.png)',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 2,
                        transform: 'rotate(-15deg)'
                      }} 
                    />
                  </Box>

                  <Box sx={{ mt: selectedSignatory?.signature_path ? 0 : 4 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedSignatory?.user_name || "____________________"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Authorized Signatory
                    </Typography>
                  </Box>
                </Box>

             </Paper>
           </Box>
        </Box>
      </Box>
      <Dialog open={openProvisionDialog} onClose={() => setOpenProvisionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Special Provision</DialogTitle>
        <DialogContent>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Special provisions are added as custom clauses to the end of the offer letter. They can be moved like any other clause.
            </Typography>
            <TextField
                autoFocus
                margin="dense"
                id="provision"
                label="Provision Content"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={provisionText}
                onChange={(e) => setProvisionText(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenProvisionDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProvision} variant="contained" disabled={!provisionText.trim()}>Add Provision</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
