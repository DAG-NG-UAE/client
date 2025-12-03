import axiosInstance from "./axiosInstance";

// get the candidates for a requisition 
export const getCandidatesForRequisition = async (requisitionId: string) => {
    try {
        const response = await axiosInstance.get(`requistion/candidate?requisitionId=${requisitionId}`);
        console.log('Fetched candidates:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching candidates:', error);
        throw error;
    }
};