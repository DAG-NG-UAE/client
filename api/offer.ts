import axiosInstance from "./axiosInstance";

export const getAllClauses = async () => {
  try {
    const response = await axiosInstance.get("offer/clauses");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all clauses", error);
    throw error;
  }
};

export const getAllOffers = async (status?: string) => {
  try {
    const url = status ? `offer/all?status=${status}` : "offer/all";
    const response = await axiosInstance.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all offers", error);
    throw error;
  }
};

export const getOfferById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`offer/single?offerId=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer by id", error);
    throw error;
  }
};

export const getJoiningDetails = async (offerId: string) => {
  try {
    const response = await axiosInstance.get(`offer/joining/info?offerId=${offerId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching joining details", error);
    throw error;
  }
};

export const getGuarantor = async (offerId: string) => {
  try {
    const response = await axiosInstance.get(`offer/guarantor/info?offerId=${offerId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching guarantor", error);
    throw error;
  }
};

export const getOfferLetter = async (offerId: string) => {
  try {
    const response = await axiosInstance.get(`offer/letter?offerId=${offerId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer letter", error);
    throw error;
  }
};

export const generateOffer = async(payload: any) => { 
  try {
    const response = await axiosInstance.post(`offer/send`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer letter", error);
    throw error;
  }
}

export const updateOffer = async(payload: any, offerId: string) => { 
  try {
    const response = await axiosInstance.patch(`offer/edit?offerId=${offerId}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer letter", error);
    throw error;
  }
}

export const createEmployee = async(requisitionId: string, candidateId: string) => { 
  try {
    const response = await axiosInstance.patch(`offer/employee/create?requisitionId=${requisitionId}&candidateId=${candidateId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer letter", error);
    throw error;
  }
}