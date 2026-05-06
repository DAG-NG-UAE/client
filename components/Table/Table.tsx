import React, { useState } from 'react';
import { TableProps } from "@/interface/table";
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Checkbox, CircularProgress, TablePagination, IconButton } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function TableComponent<T>({
    columns,
    data,
    keyExtractor,
    onRowClick,
    actions,
    loading,
    emptyMessage = 'No Data Available at this time',
    error,
    onRetry,
    totalCount,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    renderDetailPanel,
    selectedIds = [],
    onToggleSelect,
}: TableProps<T>) {
    const safeData = Array.isArray(data) ? data : [];
    if (!Array.isArray(data)) {
        console.error("TableComponent: data is not an array", data);
    }

    // Expansion is local UI state — independent of selection
    const [expandedIds, setExpandedIds] = useState<Set<any>>(new Set());

    const handleToggleExpand = (id: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const hasSelection = !!onToggleSelect;
    const allVisibleSelected = safeData.length > 0 && safeData.every(row => selectedIds.includes(keyExtractor(row)));

    const handleSelectAll = () => {
        if (!onToggleSelect) return;
        safeData.forEach(row => {
            const id = keyExtractor(row);
            const alreadySelected = selectedIds.includes(id);
            if (allVisibleSelected && alreadySelected) onToggleSelect(id, row);
            if (!allVisibleSelected && !alreadySelected) onToggleSelect(id, row);
        });
    };

    const extraColCount =
        (renderDetailPanel ? 1 : 0) +
        (hasSelection ? 1 : 0) +
        (actions ? 1 : 0);

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Table sx={{ minWidth: 650 }} aria-label="data table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                        {hasSelection && (
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedIds.length > 0 && !allVisibleSelected}
                                    checked={allVisibleSelected}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                        )}
                        {renderDetailPanel && <TableCell padding="checkbox" />}
                        {columns.map(col => (
                            <TableCell key={col.label} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
                                {col.label}
                            </TableCell>
                        ))}
                        {actions && <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>ACTION</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + extraColCount} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + extraColCount} align="center">
                                <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                    <Typography color="text.secondary">Failed to load data. Please try again.</Typography>
                                    {onRetry && (
                                        <Button variant="outlined" size="small" onClick={onRetry}>Try again</Button>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : safeData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + extraColCount} align="center">
                                <Typography>{emptyMessage}</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        safeData.map((row) => {
                            const rowKey = keyExtractor(row);
                            const isChecked = selectedIds.includes(rowKey);
                            const isExpanded = expandedIds.has(rowKey);

                            return (
                                <React.Fragment key={rowKey}>
                                    <TableRow
                                        hover
                                        onClick={() => onRowClick?.(row)}
                                        tabIndex={-1}
                                        selected={isChecked}
                                        sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                    >
                                        {hasSelection && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isChecked}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onToggleSelect!(rowKey, row);
                                                    }}
                                                />
                                            </TableCell>
                                        )}
                                        {renderDetailPanel && (
                                            <TableCell padding="checkbox">
                                                <IconButton size="small" onClick={(e) => handleToggleExpand(rowKey, e)}>
                                                    {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                                </IconButton>
                                            </TableCell>
                                        )}
                                        {columns.map((col) => (
                                            <TableCell key={col.key as string}>
                                                {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                                            </TableCell>
                                        ))}
                                        {actions && (
                                            <TableCell>{actions(row)}</TableCell>
                                        )}
                                    </TableRow>
                                    {isExpanded && renderDetailPanel && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + extraColCount} sx={{ p: 0 }}>
                                                {renderDetailPanel(row)}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </TableBody>
            </Table>
            {totalCount !== undefined && onPageChange && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            )}
        </TableContainer>
    );
}

export default TableComponent;
