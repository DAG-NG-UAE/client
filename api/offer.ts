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

export const getAllOffers = async (
  status?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  requisitionId?: string,
) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (requisitionId && requisitionId !== "all")
      params.append("requisitionId", requisitionId);

    const url = `offer/all?${params.toString()}`;

    if (search) {
      // Re-adding search manually if needed, or trusting URLSearchParams handles encoding
      // URLSearchParams handles encoding automatically.
    }

    const response = await axiosInstance.get(url);
    console.log(
      `the response from get all offers => ${JSON.stringify(response.data)}`,
    );
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
    const response = await axiosInstance.get(
      `offer/joining/info?offerId=${offerId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching joining details", error);
    throw error;
  }
};

export const getGuarantor = async (offerId: string) => {
  try {
    const response = await axiosInstance.get(
      `offer/guarantor/info?offerId=${offerId}`,
    );
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

export const generateOffer = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`offer/send`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer letter", error);
    throw error;
  }
};

export const updateOffer = async (payload: any, offerId: string) => {
  try {
    const response = await axiosInstance.patch(
      `offer/edit?offerId=${offerId}`,
      payload,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer letter", error);
    throw error;
  }
};

export const createEmployee = async (
  requisitionId: string,
  candidateId: string,
) => {
  try {
    const response = await axiosInstance.patch(
      `offer/employee/create?requisitionId=${requisitionId}&candidateId=${candidateId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offer letter", error);
    throw error;
  }
};

export const resolveRequisition = async (offerId: string) => {
  try {
    const response = await axiosInstance.patch(
      `offer/revision/resolve?offerId=${offerId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error resolving requisition", error);
    throw error;
  }
};

export const savePreOfferDocs = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`offer/pre`, payload);
    return response.data;
  } catch (error) {
    console.error("Error saving pre-offer docs", error);
    throw error;
  }
};

export const fetchPreOfferDocs = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `offer/pre/docs?candidateId=${candidateId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pre-offer docs", error);
    throw error;
  }
};

export const fetchInternalSalaryOffer = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `offer/internal/salary?candidateId=${candidateId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching internal salary offer", error);
    throw error;
  }
};

export const sendInternalSalaryOffer = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `offer/internal/salary/send`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error sending internal salary offer", error);
    throw error;
  }
};

export const verifyInternalSalaryToken = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      `offer/internal/salary/verify?token=${token}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying internal salary token", error);
    throw error;
  }
};

export const updateInternalSalaryProposal = async (
  id: string[],
  candidateId: string,
  status: string,
) => {
  try {
    const response = await axiosInstance.post(`offer/internal/salary/status`, {
      approvalIds: id,
      candidateId,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating internal salary proposal", error);
    throw error;
  }
};

export const approvedInternalSalaryProposal = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `offer/internal/salary/approved?candidateId=${candidateId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error approved internal salary proposal", error);
    throw error;
  }
};

export const updateJoiningDocsStatus = async (
  documentId: string,
  status: string,
  comment: string,
  category: string,
) => {
  try {
    const response = await axiosInstance.patch(`offer/docs/status`, {
      documentId,
      status,
      comment,
      category,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating joining docs status", error);
    throw error;
  }
};
