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
  InputBase
} from '@mui/material';
import { 
  Visibility, 
  Send, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Business,
  DragIndicator
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchSingleCandidate } from '@/redux/slices/candidates';
import { fetchMasterClauses } from '@/redux/slices/offer';
import { ClauseItem } from '@/components/offers/ClauseItem';
import { Highlight } from '@/components/offers/Highlight';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import { Clauses, ExtendedClause } from '@/interface/offer';

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



function SortableClause({ id, title, content, onRemove }: { id: string, title: string, content: React.ReactNode, onRemove?: () => void }) {
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
      cursor: 'grab', 
      marginBottom: '16px',
      position: 'relative' as 'relative',
      border: isDragging ? '2px solid #2563EB' : '1px solid transparent',
      backgroundColor: isDragging ? '#F8FAFC' : 'transparent',
      borderRadius: '8px',
      zIndex: isDragging ? 1000 : 1,
      // touchAction: 'none' // Required for pointer sensor sometimes
    };
  
    return (
      <Box ref={setNodeRef} style={style} sx={{ '&:hover .remove-btn': { opacity: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {/* This is the handle for dragging */}
          <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', mr: 1 }}>
            <DragIndicator fontSize="small" sx={{ color: 'text.disabled' }} />
          </Box>
          
          <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', fontWeight: 'bold', flexGrow: 1 }}>
            {title}
          </Typography>

          <IconButton 
            className="remove-btn" 
            size="small" 
            onClick={onRemove}
            sx={{ opacity: 0, transition: '0.2s', color: 'error.main' }}
          >
            <Box sx={{ fontSize: '1.2rem' }}>×</Box>
          </IconButton>
        </Box>
        
        <Typography component="div" sx={{ lineHeight: 1.6, fontSize: '0.85rem', color: 'text.secondary', ml: 4 }}> 
            {content}
        </Typography>
      </Box>
    );
}

export default function OfferPage() {
  const theme = useTheme();
  const params = useParams();
  
  const candidateId = params.id as string;

  const {selectedCandidate} = useSelector((state:RootState) => state.candidates)
  const {masterClauses, loading} = useSelector((state:RootState) => state.offers)

  // State for form fields
  const [salary, setSalary] = useState('145,000');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [probation, setProbation] = useState('6 months');
  const [noticePeriod, setNoticePeriod] = useState(4);
  const [noticeUnit, setNoticeUnit] = useState('Weeks');
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Company Details 
  const [companyName, setCompanyName] = useState('Dubai Auto Gallery'); 
  //Employment Details template literal prefill 
  const [position, setPosition] = useState(selectedCandidate?.role_applied_for || '');
  const [location, setLocation] = useState('Ikeja-Lagos-Onsite (No Remote / Flex time)');
  const [workDays, setWorkDays] = useState('Monday-Saturday');
  const [workTime, setWorkTime] = useState('8:30 am-6:00 pm, Saturday-HalfDay 8.30 A.M to 1.30 P.M');

  // Lists
  const [selectedClauses, setSelectedClauses] = useState<ExtendedClause[]>([]);

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

  useEffect(() => {
    if (candidateId) {
        fetchSingleCandidate(candidateId);
        fetchMasterClauses()
    }
  }, [candidateId]);

  // populate default mandatories
  useEffect(() => {
    if(masterClauses && masterClauses.length > 0 && selectedClauses.length === 0) {
        const mandatory = masterClauses.filter(c => c.is_mandatory)
            .map(c => ({...c, instanceId: `mandatory-${c.master_clauses_id}`})) as ExtendedClause[];
        if(mandatory.length > 0) setSelectedClauses(mandatory);
    }
  }, [masterClauses]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active.id !== over?.id) {
      setSelectedClauses((items) => {
        const oldIndex = items.findIndex((item) => item.instanceId === active.id);
        const newIndex = items.findIndex((item) => item.instanceId === over?.id);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
      
        // Update the sort_order property for every item based on its new index
        return newArray.map((item, index) => ({
          ...item,
          sort_order: index // This keeps the DB and UI in sync
        }));
      });
    }
  };

  const handleAddClause = (clause: Partial<Clauses>) => {
      const newClause: ExtendedClause = {
          ...clause as Clauses,
          instanceId: `${clause.master_clauses_id}-${Date.now()}`,
          sort_order: selectedClauses.length // Put it at the end
      };
      setSelectedClauses(prev => [...prev, newClause]);
  }

  const handleRemoveClause = (instanceId: string) => {
      setSelectedClauses(prev => prev.filter(c => c.instanceId !== instanceId));
  };

  const interpolateContent = (text: string) => {
      if(!text) return "";
      // Replacements map
      // We assume simple placeholders like {salary} for now. 
      // Adjust keys to match your actual Master Clause content format.
      const replacements: Record<string, string | JSX.Element> = {
          '{{company_name}}': <Highlight text={companyName} />,
          '{{position}}': <Highlight text={position} />,
          '{{location}}': <Highlight text={location} />,
          '{{work_days}}': <Highlight text={workDays} />,
          '{{work_time}}': <Highlight text={workTime} />,

          '{{salary}}': <Highlight text={`$${salary}`} />,
          '{{start_date}}': <Highlight text={formatOfferDate(startDate)} />,
          '{{probation_period}}': <Highlight text={probation} />,
          '{{notice_period}}': <Highlight text={`${noticePeriod} ${noticeUnit}`} />,
          '{{candidate_name}}': selectedCandidate?.candidate_name || 'Candidate',
          '{{role}}': selectedCandidate?.role_applied_for || 'Role',
          '{{department}}': selectedCandidate?.department || 'Department',

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
    return <Box sx={{ p: 4 }}>Loading candidate...</Box>
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
          <Button variant="outlined" startIcon={<Visibility />} color="inherit" size='small'>
            Preview as Candidate
          </Button>
          <Button variant="contained" startIcon={<Send />} color="primary" size='small'>
            Send Offer
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
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">LOCATION & TERMS</Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">WORK HOURS/DAYS</Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="e.g. Monday-Friday"
                    value={workDays} 
                    onChange={(e) => setWorkDays(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                    value={workTime} 
                    onChange={(e) => setWorkTime(e.target.value)}
                  />
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
                        <MenuItem value="3 months">3 Months</MenuItem>
                        <MenuItem value="6 months">6 Months</MenuItem>
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
                        <Box sx={{ flex: 1 }}>
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
                        </Box>
                    </Box>
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

              <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {masterClauses && masterClauses.map((clause) => (
                  <Box key={clause.master_clauses_id} sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <ClauseItem 
                        title={clause.title!} 
                        description={clause.content ? (clause.content.substring(0, 60) + '...') : ''}
                        onAdd={() => handleAddClause(clause)}
                      />
                  </Box>
                ))}
              </Box>

            </Paper>
        </Box>

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
               bgcolor: '#F3F4F6',
               borderRadius: 2,
               overflow: 'auto',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'flex-start',
               p: 4,
               border: `1px solid ${theme.palette.divider}`
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
                        <Typography variant="h5" fontWeight="bold">Acme Corp.</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" display="block" color="text.secondary">123 Innovation Drive</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">San Francisco, CA 94103</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">+1 (555) 123-4567</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">hr@acmecorp.com</Typography>
                    </Box>
                </Box>
              
                <Divider sx={{ mb: 6 }} />
                
                <Typography paragraph color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                   {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography fontWeight="bold">{selectedCandidate?.candidate_name}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>42 Design Avenue</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>Brooklyn, NY 11201</Typography>
                </Box>

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
                        items={selectedClauses.map(c => c.instanceId)}
                        strategy={verticalListSortingStrategy}
                    >
                        {selectedClauses.map((clause) => (
                            <SortableClause 
                                key={clause.instanceId} 
                                id={clause.instanceId} 
                                title={clause.title} 
                                content={interpolateContent(clause.content)} 
                                onRemove={() => handleRemoveClause(clause.instanceId)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                {selectedClauses.length === 0 && (
                    <Box sx={{ p: 4, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">No clauses selected. Add clauses from the library on the left.</Typography>
                    </Box>
                )}

             </Paper>
           </Box>
        </Box>
      </Box>
    </Box>
  );
}
