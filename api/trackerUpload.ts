import axiosInstance from './axiosInstance';

export const uploadTrackerData = async (payload: any) => {
    try {
        console.log(`the payload we are sending to the api ${payload}`)
        const response = await axiosInstance.post('/upload/recruitment-tracker', {payload:payload}); // Axios sends payload directly

        // Axios responses don't have .ok, check status directly
        if (response.status !== 200 && response.status !== 201) { // Assuming 200 or 201 for success
        throw new Error(response.data.message || 'Failed to upload tracker data');
        }

        return response.data; // Axios response data is directly available
    } catch (error: any) {
        console.error('Error in uploadTrackerData:', error.response?.data || error.message);
        throw error;
    }
};