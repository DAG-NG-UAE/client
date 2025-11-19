import axiosInstance from './axiosInstance';

interface Mapping {
  [key: string]: string;
}

interface TransformedRecord {
  [key: string]: string;
}

interface UploadPayload {
  mapping: Mapping;
  data: TransformedRecord[];
  requisitionId: string; // Add requisitionId to payload
}

export const uploadCandidates = async (payload: UploadPayload) => {
  try {
    const response = await axiosInstance.post('/upload', payload); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error uploading candidates:', error);
    throw error;
  }
};
