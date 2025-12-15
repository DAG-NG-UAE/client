import { CandidateProfile } from "@/interface/candidate";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from "@mui/material";
import { useState } from "react";
import CandidateModal from "./CandidateModal";
import { columnConfig } from "@/utils/candidateColumnConfig"; // Import the column configuration

const CandidateTable = ({ candidates, status }: { candidates: Partial<CandidateProfile>[], status: string }) => {
    const theme = useTheme();
    const [selectedCandidate, setSelectedCandidate] = useState<Partial<CandidateProfile> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (candidate: Partial<CandidateProfile>) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCandidate(null);
    };

    // 1. Get the correct column configuration for the current status
    console.log('In the candidate table, the status is ', status)
    const columns = columnConfig[status] || columnConfig.default;

    // if (candidates.length === 0) {
    //     return (
    //         <Paper sx={{ textAlign: 'center', padding: 4, mt: 4, border: '1px solid', borderColor: 'divider' }} elevation={0}>
    //             No candidates found for this status.
    //         </Paper>
    //     );
    // }

    return (
        <>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table sx={{ minWidth: 'max-content' }} aria-label="candidate table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                            {/* Static Checkbox column */}
                            <TableCell padding="checkbox">
                                <input type="checkbox" />
                            </TableCell>
                            {/* 2. Create the table headers dynamically */}
                            {columns.map((column) => (
                                <TableCell key={column.id} sx={{ color: "text.secondary", fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', px: 2, py: 1 }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 3. Create the table rows and cells dynamically */}
                        {candidates.map((candidate) => (
                            <TableRow
                                key={candidate.candidate_id}
                                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                onClick={() => handleRowClick(candidate)}
                            >
                                <TableCell padding="checkbox">
                                    <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={column.id} sx={{ whiteSpace: 'nowrap', px: 2 }}>
                                        {
                                            // A. Use renderCell if it exists
                                            column.renderCell
                                                ? column.renderCell(candidate)
                                                // B. Otherwise, access data directly using the id
                                                : (candidate as any)[column.id] || '---'
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CandidateModal open={isModalOpen} onClose={handleCloseModal} candidate={selectedCandidate} />
        </>
    );
};

export default CandidateTable;