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
    const params = status ? { status } : {};
    const response = await axiosInstance.get('/requistion')
    console.log('The response we get is', JSON.stringify(response))
    return response.data.data;
  } catch (error) {
    console.error('Error fetching requisitions:', error);
    throw error;
  }
};
