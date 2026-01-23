import axiosInstance from "./axiosInstance";

export const getHistoricalRequisitions = async () => {
    try {
        const response = await axiosInstance.get('/requisition/historical');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching historical requisitions:', error);
        throw error;
    }
}

export const getHistoricalRequisitionsById = async (id: any) => {
    try {
        const response = await axiosInstance.get(`requisition/historical/single?historicalId=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching historical requisitions:', error);
        throw error;
    }
}