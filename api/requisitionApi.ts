import axios from 'axios';
import axiosInstance from './axiosInstance';
import { RecruiterSelection, Requisition } from '@/interface/requisition';


export const getRequisitions = async (status?: string): Promise<Partial<Requisition>[]> => {
  try {
    console.log(`the params being passed ${status}`)
    const config = {
      params: status ? { status } : {},
    };

    // 2. Pass the config object as the second argument to axiosInstance.get()
    const response = await axiosInstance.get("/requisition", config);
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
      `/requisition/single?requisitionId=${id}`
    );
    console.log("The response we get is", JSON.stringify(response));
    return response.data.data;
  } catch (error) {
    console.error("Error fetching requisition:", error);
    throw error;
  }
};

export const getCareerDetail = async (slug:string): Promise<Partial<Requisition>> => { 
try{ 
  const response = await axiosInstance.get(`/requisition/career?slug=${slug}`)
  return response.data.data
}catch(error){ 
  console.error('Error fetching requisition by slug')
  throw error 
}
}

export const updateRequisition = async (
  id: string,
  data: Partial<Requisition>
): Promise<Partial<Requisition>> => {
  try {
    const response = await axiosInstance.put(
      `/requisition?requisitionId=${id}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating requisition:", error);
    throw error;
  }
};

export const publishRequisition = async (requisitionId: string) => { 
  try{ 
    const response = await axiosInstance.put(`/requisition/publish?requisitionId=${requisitionId}`)
    return response.data.data
  }catch(error){ 
    console.error("Error publishing the requisition", error)
    throw error
  }
}

export const unPublishRequisition = async(requisitionId: string, jobListKey: string) => {
  try{ 
    const response = await axiosInstance.put(`/requisition/unpublish?requisitionId=${requisitionId}&jobListKey=${jobListKey}`)
    return response.data.data
  }catch(error){ 
    console.error("Error publishing the requisition", error)
    throw error
  }
}

export const getPosition = async() => { 
  try{ 
    const response = await axiosInstance.get(`requisition/position`)
    return response.data.data
  }catch(error){ 
    console.error("Error getting the position", error)
    throw error
  }
}

export const approveRequisition = async (recruiter: RecruiterSelection[], requisitionId: string) => { 
  try{ 
    const response = await axiosInstance.post(`requisition/approve?requisitionId=${requisitionId}`,{recruiter})
    return response.data.data
  }catch(error){ 
    console.error("Error getting the position", error)
    throw error
  }
}

export const holdRequisition = async(requisitionId: string) => { 
  try{ 
    const response = await axiosInstance.put(`requisition/hold?requisitionId=${requisitionId}`)
    return response.data.data
  }catch(error){ 
    console.error("Error getting the position", error)
    throw error
  }
}