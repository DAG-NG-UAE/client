import React, { useState } from 'react';
import { TableProps } from "@/interface/table";
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Checkbox, CircularProgress, TablePagination } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

function TableComponent<T>({
    columns,
    data,
    keyExtractor,
    onRowClick,
    actions,
    loading,
    emptyMessage = 'No Data Available at this time',
    totalCount,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    renderDetailPanel
}: TableProps<T>) {
    // Safety check for data
    const safeData = Array.isArray(data) ? data : [];
    if (!Array.isArray(data)) {
        console.error("TableComponent: data is not an array", data);
    }

    console.log(`the data is => ${JSON.stringify(safeData)}`)
    const [selected, setSelected] = useState<readonly any[]>([]);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = safeData.map((n) => keyExtractor(n));
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: any) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const isSelected = (id: any) => selected.indexOf(id) !== -1;

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Table sx={{ minWidth: 650 }} aria-label="data table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                        <TableCell padding="checkbox">
                             {/* Checkbox removed for expansion mode mainly, or can be enabled if needed */}
                        </TableCell>
                        {columns.map(col => (
                            <TableCell key={col.label} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>{col.label}</TableCell>
                        ))}
                        {actions && <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>ACTION</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + 3} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : safeData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + 3} align="center">
                                <Typography>{emptyMessage}</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        safeData.map((row, index) => {
                            const rowKey = keyExtractor(row);
                            const isItemSelected = isSelected(rowKey);
                            return (
                                <React.Fragment key={rowKey}>
                                    <TableRow
                                        hover
                                        // onClick={() => onRowClick && onRowClick(row)} 
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleClick(event, rowKey);
                                                }}
                                                inputProps={{
                                                    'aria-labelledby': `table-checkbox-${index}`,
                                                }}
                                            />
                                        </TableCell>
                                        {columns.map((col) => (
                                            <TableCell key={col.key as string}>
                                                {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                                            </TableCell>
                                        ))}
                                        {actions && (
                                            <TableCell>
                                                {actions(row)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                    {isItemSelected && renderDetailPanel && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + (actions ? 2 : 1)} sx={{ p: 0 }}>
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
                    page={page} // Material UI uses 0-indexed pages
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            )}
        </TableContainer>
    );
};

export default TableComponent;