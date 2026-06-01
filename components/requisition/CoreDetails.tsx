import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Chip, IconButton, TextField, CircularProgress, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Person, Search } from '@mui/icons-material';
import { Requisition } from '@/interface/requisition';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import { searchInterviewers } from '@/api/interview';
import { updateReportingManager } from '@/api/requisitionApi';
import { enqueueSnackbar } from 'notistack';

interface CoreDetailsProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
}

const DetailItem = ({ label, value, isStatus = false }: { label: string; value: string | undefined | number; isStatus?: boolean }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
      {label}
    </Typography>
    {isStatus && typeof value === 'string' ? (
      <Chip
        {...getStatusChipProps(value)}
        size="small"
        sx={{ borderRadius: '6px', fontWeight: 500, ...(getStatusChipProps(value).sx || {}) }}
      />
    ) : (
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    )}
  </Box>
);

const CoreDetails = ({ requisition, isEditMode }: CoreDetailsProps) => {
  const initialManager = requisition.stakeholder_names?.find(x => x.email === (requisition as any).reporting_manager);

  const [managerName, setManagerName] = useState(initialManager?.name ?? '');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    if (searchOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchOpen) return;
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchInterviewers(searchQuery);
          setSearchResults(results ?? []);
        } catch {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchOpen]);

  const handleSelect = async (member: any) => {
    if (!requisition.requisition_id) return;
    setIsSaving(true);
    try {
      await updateReportingManager(requisition.requisition_id, { email: member.mail, displayName: member.displayName });
      setManagerName(member.displayName);
      enqueueSnackbar('Reporting manager updated', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to update reporting manager', { variant: 'error' });
    } finally {
      setIsSaving(false);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Core Requisition Details
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Internal Job Title" value={requisition.position} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Department" value={requisition.department?.replace(/_/g, ' ')} />
        </Grid>

        {/* Reporting Manager — editable in edit mode */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Reporting Manager
          </Typography>

          {isEditMode ? (
            <Box ref={containerRef} sx={{ position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  {managerName || '-'}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setSearchOpen(prev => !prev)}
                  disabled={isSaving}
                  sx={{ p: 0.25 }}
                >
                  {isSaving ? <CircularProgress size={14} /> : <EditIcon sx={{ fontSize: 14 }} />}
                </IconButton>
              </Box>

              {searchOpen && (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    autoFocus
                    fullWidth
                    placeholder="Search by name..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 16 }} />,
                      endAdornment: isSearching && <CircularProgress size={14} />,
                      sx: { borderRadius: 1.5, bgcolor: 'background.paper' },
                    }}
                  />

                  {searchResults.length > 0 && (
                    <Paper
                      elevation={4}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 200,
                        mt: 0.5,
                        maxHeight: 200,
                        overflowY: 'auto',
                        borderRadius: 2,
                      }}
                    >
                      <List disablePadding>
                        {searchResults.map((member: any, idx: number) => (
                          <ListItem key={idx} disablePadding>
                            <ListItemButton onClick={() => handleSelect(member)} sx={{ py: 0.75 }}>
                              <ListItemAvatar sx={{ minWidth: 36 }}>
                                <Avatar sx={{ width: 24, height: 24 }} src={member.avatar}>
                                  <Person sx={{ fontSize: 14 }} />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={member.displayName}
                                secondary={member.jobTitle}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2" fontWeight={500}>
              {managerName || '-'}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Requester" value={requisition.requisition_raised_by} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Headcount" value={requisition.num_positions} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Budget" value={requisition.proposed_salary ? new Intl.NumberFormat().format(Number(requisition.proposed_salary)) : 'N/A'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Status" value={requisition.status} isStatus />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CoreDetails;
