"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    Button,
    Stack,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    alpha,
    Breadcrumbs,
    Link,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { useSelector } from '@/redux/store';
import { fetchAdminPreferences } from '@/redux/slices/preferences';
import dayjs from 'dayjs';

const LibraryLandingPage = () => {
    const theme = useTheme();
    const router = useRouter();
    const [search, setSearch] = useState('');

    // Redux State
    const { preferences, meta, loading } = useSelector((state) => state.preferences);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAdminPreferences(page + 1, rowsPerPage, search);
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [page, rowsPerPage, search]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
            {/* Top Navigation / Breadcrumbs */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                        <Link underline="hover" color="inherit" href="/dashboard">Settings</Link>
                        <Typography color="text.primary" sx={{ fontSize: '0.8rem' }}>Preference Library</Typography>
                    </Breadcrumbs>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        Preference Library
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton sx={{ bgcolor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <NotificationsIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/library/preferences')}
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: '#155dfc',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#0F4DBA' }
                        }}
                    >
                        Add New Preference Master
                    </Button>
                </Stack>
            </Box>

            {/* Filters & Search */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
                <TextField
                    placeholder="Search categories, skills, or scales..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#fff',
                            '& fieldset': { borderColor: theme.palette.divider }
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="disabled" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    sx={{ bgcolor: '#fff', color: theme.palette.text.primary, borderColor: theme.palette.divider, textTransform: 'none', px: 3 }}
                >
                    Filter
                </Button>
            </Stack>

            {/* Categories Table */}
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.text.primary, 0.01) }}>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.text.secondary }}>Label</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.text.secondary }}>Key</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.text.secondary }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.text.secondary }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.text.secondary }}>Last Updated</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.text.secondary }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : preferences.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">No preferences found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            preferences.map((row: import('@/interface/preference').Preference) => (
                                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                                        <Chip label={row.pref_key} size="small" variant="outlined" sx={{ borderRadius: 1, fontSize: '0.7rem' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.field_type}
                                            size="small"
                                            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: theme.palette.primary.main, fontWeight: 600, borderRadius: 1.5 }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>{row.category}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{dayjs(row.updated_at).format('MMM D, YYYY')}</Typography>
                                        <Typography variant="caption" color="text.secondary">{row.updated_by}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                            <IconButton size="small" onClick={() => router.push(`/library/preferences?prefKey=${row.pref_key}`)}><VisibilityIcon fontSize="small" sx={{ color: theme.palette.text.disabled }} /></IconButton>
                                            <IconButton size="small"><EditIcon fontSize="small" sx={{ color: theme.palette.text.disabled }} /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={meta?.total || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                />
            </TableContainer>
        </Box>
    );
};

export default LibraryLandingPage;
