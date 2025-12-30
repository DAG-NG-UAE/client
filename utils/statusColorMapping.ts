export const getStatusChipProps = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "open":
      return {
        label: "Open",
        color: "success" as "success",
        variant: "outlined" as "outlined",
      };
    case "in review":
      return {
        label: "In Review",
        color: "warning" as "warning",
        variant: "outlined" as "outlined",
      };
    case "closed":
      return {
        label: "Closed",
        color: "success" as "success",
        variant: "outlined" as "outlined",
      };
    case "approved":
      return {
        label: "Approved",
        color: "success" as "success",
        variant: "outlined" as "outlined",
      };
    case "pending":
      return {
        label: "Pending",
        color: "error" as "error",
        variant: "outlined" as "outlined",
      };
    case "on_hold":
      return {
        label: "On Hold",
        color: "error" as "error",
        variant: "outlined" as "outlined",
      };
    case "progress":
      return {
        label: "In Progress",
        color: "primary" as "primary",
        variant: "outlined" as "outlined",
      };
    case "hired":
    return {
      label: "Hired", 
      sx: {
        bgcolor: "#cbfbf1",
        color: "#46958e",
      },
      variant: "filled" as "filled",
    };
  case "shortlisted":
    return {
      label: "Shortlisted",
      sx: {
        bgcolor: "#fef9c2",
        color: "#b7904d",
      },
      variant: "filled" as "filled",
    };
    case "applied":
      return {
        label: "Applied",
        sx: {
          bgcolor: "#dbeafe",
          color: "#5c78d0"
        },
        variant: "filled" as "filled",
      };
    case "interview":
      return {
        label: "Interview",
        sx: {
          bgcolor: "#f3e8ff",
          color: "#6b21a8"
        },
        variant: "filled" as "filled",
      };
    case "offer":
      return {
        label: "Offer",
        sx: {
          bgcolor: "#dbfce7",
          color: "#83c09d"
        },
        variant: "filled" as "filled",
      };
      case "approved_for_offer":
      return {
        label: "Approved for Offer",
        sx: {
          bgcolor: "#FEF3C7",
          color: "#D97706"
        },
        variant: "filled" as "filled",
      };
    case "reject":
      return {
        label: "Rejected",
        sx: {
          bgcolor: "#ffe2e2",
          color: "#b3353e"
        },
        variant: "filled" as "filled",
      };
    default:
      return {
        label: status || "Unknown",
        color: "default" as "default",
        variant: "outlined" as "outlined",
      };
  }
};
