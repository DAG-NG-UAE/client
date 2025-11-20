import axios from 'axios';
import axiosInstance from './axiosInstance';

interface Requisition {
  id: string;
  title: string;
  status: string;
  // Add other requisition fields as they exist in your backend
}

export const getRequisitions = async (status?: string): Promise<Requisition[]> => {
  try {
    console.log(`the params being passed ${status}`)
    const config = {
      params: status ? { status } : {},
    };

    // 2. Pass the config object as the second argument to axiosInstance.get()
    const response = await axiosInstance.get('/requistion', config);
    console.log('The response we get is', JSON.stringify(response))
    return response.data.data;
  } catch (error) {
    console.error('Error fetching requisitions:', error);
    throw error;
  }
};
