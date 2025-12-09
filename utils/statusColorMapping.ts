export const getStatusChipProps = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "open":
      return {
        label: "Open",
        color: "success" as "success",
        variant: "outlined" as "outlined",
      };
    case "hired":
      return {
        label: "Hired",
        color: "success" as "success",
        variant: "outlined" as "outlined",
      };
    case "shortlisted":
       return {
        label: "Shortlisted",
        sx: {
          bgcolor: "red",
          color: "#fef9c2",
          borderColor: "#e9d5ff",
        },
        variant: "filled" as "filled",
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
    case "hold":
      return {
        label: "On Hold",
        color: "warning" as "warning",
        variant: "outlined" as "outlined",
      };
    case "progress":
      return {
        label: "In Progress",
        color: "primary" as "primary",
        variant: "outlined" as "outlined",
      };
    case "applied":
      return {
        label: "Applied",
        color: "primary" as "primary",
        variant: "outlined" as "outlined",
      };
    case "interview":
      return {
        label: "Interview",
        sx: {
          bgcolor: "#f3e8ff",
          color: "#6b21a8",
          borderColor: "#e9d5ff",
        },
        variant: "filled" as "filled",
      };
    case "offer":
      return {
        label: "Offer",
        sx:{ 
          bgColor: "#f3e8ff",
          color: "#dbfce7",
          borderColor: "#dbfce7",
        },
        variant: "filled" as "filled",
      };
    case "reject":
      return {
        label: "Rejected",
        sx:{ 
          bgColor: "#bb474f",
          color: "#bb474f",
          borderColor: "#bb474f",
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
