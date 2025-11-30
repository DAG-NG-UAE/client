import axiosInstance from "./axiosInstance";

export const getHistoricalRequisitions = async () => {
    try {
        const response = await axiosInstance.get('/requistion/historical');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching historical requisitions:', error);
        throw error;
    }
}

export const getHistoricalRequisitionsById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/requisitions/historical/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching historical requisitions:', error);
        throw error;
    }
}