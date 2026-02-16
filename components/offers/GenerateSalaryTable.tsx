import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

interface SalaryBreakdownProps {
    basic: number;
    housing: number;
    transport: number;
    allowance: number;
}

export const GenerateSalaryTable: React.FC<SalaryBreakdownProps> = ({ 
    basic, 
    housing, 
    transport, 
    allowance 
}) => {
    // Annual Calculations
    const annualBasic = basic * 12;
    const annualHousing = housing * 12;
    const annualTransport = transport * 12;
    const annualAllowance = allowance * 12;
    const leaveAllowance = annualBasic * 0.10; // 10% of Annual Basic

    // Totals
    const totalMonthly = basic + housing + transport + allowance;
    const totalAnnual = annualBasic + annualHousing + annualTransport + annualAllowance + leaveAllowance;

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    };

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2, mb: 2, maxWidth: '100%', boxShadow: 'none' }}>
            <Table size="small" aria-label="salary breakdown table">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Particulars</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Gross Per Annum (N)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Gross Salary Per Month (N)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Basic</TableCell>
                        <TableCell align="right">{formatCurrency(annualBasic)}</TableCell>
                        <TableCell align="right">{formatCurrency(basic)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Housing</TableCell>
                        <TableCell align="right">{formatCurrency(annualHousing)}</TableCell>
                        <TableCell align="right">{formatCurrency(housing)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Transport</TableCell>
                        <TableCell align="right">{formatCurrency(annualTransport)}</TableCell>
                        <TableCell align="right">{formatCurrency(transport)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Other Allowances (Utility, Lunch, Education)</TableCell>
                        <TableCell align="right">{formatCurrency(annualAllowance)}</TableCell>
                        <TableCell align="right">{formatCurrency(allowance)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Leave Allowance</TableCell>
                        <TableCell align="right">{formatCurrency(leaveAllowance)}</TableCell>
                        <TableCell align="right">-</TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Gross Pay</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(totalAnnual)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(totalMonthly)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
