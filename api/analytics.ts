import axiosInstance from "./axiosInstance";

export const getCandidateCardStat = async (
  requisitionId?: string,
  year?: string
) => {
  try {
    const queryParams = new URLSearchParams();
    if (requisitionId && requisitionId.trim().toLowerCase() !== "all") {
      queryParams.append("requisitionId", requisitionId);
    }

    if (year && year.trim().toLowerCase() !== "all") {
      queryParams.append("year", year);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `analytics/candidate/stat?${queryString}`
      : `analytics/candidate/stat`;

    const response = await axiosInstance.get(url);
    return response.data.data;
  } catch (error) {
    console.log("Something went wrong while fetching the candidate card stat");
    throw error;
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await axiosInstance.get("/analytics/activity");
    return response.data.data;
  } catch (error) {
    console.log("Something went wrong while fetching the recent activity");
    throw error;
  }
};