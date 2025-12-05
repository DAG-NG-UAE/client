import axios from 'axios';
import axiosInstance from './axiosInstance';
import { Requisition } from '@/interface/requisition';


export const getRequisitions = async (status?: string): Promise<Partial<Requisition>[]> => {
  try {
    console.log(`the params being passed ${status}`)
    const config = {
      params: status ? { status } : {},
    };

    // 2. Pass the config object as the second argument to axiosInstance.get()
    const response = await axiosInstance.get("/requistion", config);
    console.log("The response we get is", JSON.stringify(response));
    return response.data.data;
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    throw error;
  }
};

export const getSingleRequisition = async (
  id: string
): Promise<Partial<Requisition>> => {
  try {
    const response = await axiosInstance.get(
      `/requistion/single?requisitionId=${id}`
    );
    console.log("The response we get is", JSON.stringify(response));
    return response.data.data;
  } catch (error) {
    console.error("Error fetching requisition:", error);
    throw error;
  }
};

export const updateRequisition = async (
  id: string,
  data: Partial<Requisition>
): Promise<Partial<Requisition>> => {
  try {
    const response = await axiosInstance.put(
      `/requistion?requisitionId=${id}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating requisition:", error);
    throw error;
  }
};