export const getStatusChipProps = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return { label: 'Open', color: 'success' as 'success', variant: 'outlined' as 'outlined' };
    case 'hired':
      return { label: 'Hired', color: 'success' as 'success', variant: 'outlined' as 'outlined' };
    case 'shortlisted':
      return { label: 'Shortlisted', color: 'warning' as 'success', variant: 'outlined' as 'outlined' };
    case 'in review':
      return { label: 'In Review', color: 'warning' as 'warning', variant: 'outlined' as 'outlined' };
    case 'closed':
      return { label: 'Closed', color: 'success' as 'success', variant: 'outlined' as 'outlined' };
    case 'approved':
      return { label: 'Approved', color: 'success' as 'success', variant: 'outlined' as 'outlined' };
    case 'pending':
      return { label: 'Pending', color: 'error' as 'error', variant: 'outlined' as 'outlined' };
    case 'hold':
      return { label: 'On Hold', color: 'warning' as 'warning', variant: 'outlined' as 'outlined' };
    case 'progress':
      return { label: 'In Progress', color: 'primary' as 'primary', variant: 'outlined' as 'outlined' };
    default:
      return { label: status, color: 'default' as 'default', variant: 'outlined' as 'outlined' };
  }
};