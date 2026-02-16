import axios from "axios";
import axiosInstance from "./axiosInstance";
import { RecruiterSelection, Requisition } from "@/interface/requisition";

export const getRequisitions = async (
  status?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<{ data: Partial<Requisition>[]; meta: any }> => {
  try {
    console.log(
      `the params being passed ${status} page=${page} limit=${limit} search=${search}`,
    );
    const config = {
      params: {
        ...(status ? { status } : {}),
        page,
        limit,
        ...(search ? { search } : {}),
      },
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
  id: string,
): Promise<Partial<Requisition>> => {
  try {
    const response = await axiosInstance.get(
      `/requisition/single?requisitionId=${id}`,
    );
    console.log("The response we get is", JSON.stringify(response));
    return response.data.data;
  } catch (error) {
    console.error("Error fetching requisition:", error);
    throw error;
  }
};

export const getCareerDetail = async (
  slug: string,
) => {
  try {
    const response = await axiosInstance.get(
      `/requisition/career?slug=${slug}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching requisition by slug");
    throw error;
  }
};

export const updateRequisition = async (
  id: string,
  data: Partial<Requisition>,
): Promise<Partial<Requisition>> => {
  try {
    const response = await axiosInstance.put(
      `/requisition?requisitionId=${id}`,
      data,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating requisition:", error);
    throw error;
  }
};

export const publishRequisition = async (requisitionId: string) => {
  try {
    const response = await axiosInstance.put(
      `/requisition/publish?requisitionId=${requisitionId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error publishing the requisition", error);
    throw error;
  }
};

export const unPublishRequisition = async (
  requisitionId: string,
  jobListKey: string,
) => {
  try {
    const response = await axiosInstance.put(
      `/requisition/unpublish?requisitionId=${requisitionId}&jobListKey=${jobListKey}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error publishing the requisition", error);
    throw error;
  }
};

export const getPosition = async () => {
  try {
    const response = await axiosInstance.get(`requisition/position`);
    return response.data.data;
  } catch (error) {
    console.error("Error getting the position", error);
    throw error;
  }
};

export const approveRequisition = async (
  recruiter: RecruiterSelection[],
  requisitionId: string,
  recruiterEmails: string,
) => {
  try {
    const response = await axiosInstance.post(
      `requisition/approve?requisitionId=${requisitionId}`,
      { recruiter, recruiterEmails },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error getting the position", error);
    throw error;
  }
};

export const holdRequisition = async (requisitionId: string) => {
  try {
    const response = await axiosInstance.put(
      `requisition/hold?requisitionId=${requisitionId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error getting the position", error);
    throw error;
  }
};

export const assignRecruiters = async (
  requisitionId: string,
  recruiters: { userId: string; roleId: string }[],
  recruiterEmails: string,
) => {
  try {
    const response = await axiosInstance.put(
      `/requisition/assign-recruiters?requisitionId=${requisitionId}`,
      { recruiters, recruiterEmails },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error assigning recruiters:", error);
    throw error;
  }
};

export const removeRecruiters = async (
  requisitionId: string,
  userId: string,
  recruiterEmail: string,
) => {
  try {
    const response = await axiosInstance.put(
      `/requisition/remove-recruiters?requisitionId=${requisitionId}`,
      { userId, recruiterEmail },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error signing recruiters:", error);
    throw error;
  }
};

export const addRequisitionLocation = async (
  requisitionId: string,
  location: string,
  headCount: number,
) => {
  try {
    const response = await axiosInstance.patch(
      `/requisition/locations?requisitionId=${requisitionId}`,
      { locations: { loc: location, headCount } },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding location:", error);
    throw error;
  }
};

export const updateRequisitionLocation = async (
  requisitionId: string,
  positionSlotId: string,
  location: string,
  headCount: number,
) => {
  try {
    const response = await axiosInstance.patch(
      `/requisition/locations?requisitionId=${requisitionId}`,
      {
        locations: {
          position_slot_id: positionSlotId,
          loc: location,
          headCount,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

export const removeRequisitionLocation = async (
  requisitionId: string,
  positionSlotId: string,
  location: string,
) => {
  try {
    // Axios delete with body requires 'data' property in config
    const response = await axiosInstance.patch(
      `/requisition/locations?requisitionId=${requisitionId}`,
      { locations: { position_slot_id: positionSlotId, loc: location } },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error removing location:", error);
    throw error;
  }
};

export const createRequisition = async (requisition: Partial<Requisition>) => {
  try {
    const response = await axiosInstance.post("/requisition", requisition);
    return response.data.data;
  } catch (error) {
    console.error("Error creating requisition:", error);
    throw error;
  }
};
