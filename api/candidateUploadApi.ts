import axiosInstance from './axiosInstance';


interface TransformedRecord {
  [key: string]: string;
}

interface UploadPayload {
  data: TransformedRecord[];
  requisitionId: string; // Add requisitionId to payload
}

export const uploadCandidates = async (payload: UploadPayload) => {
  try {
    const response = await axiosInstance.post('/upload/candidate-profile', payload); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error uploading candidates:', error);
    throw error;
  }
};
