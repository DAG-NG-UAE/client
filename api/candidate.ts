import { CandidateProfile } from "@/interface/candidate";
import axiosInstance, { API_BASE_URL } from "./axiosInstance";
import { CandidateEvaluationPayload } from "@/interface/interview";

// get the candidates for a requisition
export const getCandidatesForRequisition = async (requisitionId: string) => {
  try {
    const response = await axiosInstance.get(
      `requisition/candidate?requisitionId=${requisitionId}`,
    );
    console.log("Fetched candidates:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

export const apply = async (applicantData: FormData, slug: string) => {
  try {
    console.log("Making request to backend...");
    const response = await axiosInstance.post(
      `application?slug=${slug}`,
      applicantData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error applying:", error);
    throw error;
  }
};

export const getAllCandidates = async (
  requisitionId?: string,
  status?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  try {
    const queryParams = new URLSearchParams();
    if (requisitionId && requisitionId.trim().toLowerCase() !== "all") {
      queryParams.append("requisitionId", requisitionId);
    }
    if (status && status.trim().toLowerCase() !== "all") {
      queryParams.append("stage", status);
    }

    // Add pagination params
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Add search param
    if (search) {
      queryParams.append("search", search);
    }

    const queryString = queryParams.toString();
    const url = `candidate?${queryString}`;
    const response = await axiosInstance.get(url);
    console.log(
      `the response from get all candidate => ${JSON.stringify(response.data)}`,
    );
    // Return full response structure: { data: CandidateProfile[], meta: PaginationMeta }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all candidates:", error);
    throw error;
  }
};

export const getSingleCandidate = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `candidate/single?candidateId=${candidateId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching single candidate details");
    throw error;
  }
};

export const getCandidateResume = async (candidateId: string) => {
  try {
    const resumeLink = await axiosInstance.get(`candidate/resume?candidateId=${candidateId}`);
    console.log("The resume link is ", resumeLink);
    return resumeLink.data.data.value;
  } catch (error) {
    console.error("Error fetching single candidate details");
    throw error;
  }
};

export const updateCandidateStatus = async (
  updateData: Partial<CandidateProfile>,
) => {
  try {
    const response = await axiosInstance.put(`/candidate`, updateData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating candidate status");
    throw error;
  }
};

export const scheduleInterview = async (interviewData: {
  candidate_id: string;
  candidate_name: string;
  requisition_id: string;
  interview_phase: string;
  interview_date: string;
  duration_minutes: number;
  location_type: 'online' | 'in_person';
  location_details: string;
  interview_panel: string[];
  old_status: string;
  publicCvLink: string;
  body: string;
  candidateEmail: string;
  subject: string;
}) => {
  try {
    console.log("The data to the backend is ", interviewData);
    const response = await axiosInstance.post(
      "/interview/schedule",
      interviewData,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    throw error;
  }
};

export const evaluateCandidate = async (
  evaluationData: CandidateEvaluationPayload,
) => {
  try {
    const response = await axiosInstance.post(
      "/interview/evaluate-candidate",
      evaluationData,
    );
    return response.data.data;
  } catch (error) {
    console.log("Error inserting candidate evaluation");
    throw error;
  }
};

export const pingHiringManager = async (payload: {
  to: string;
  cc: string;
  subject: string;
  body: string;
  automationType: string;
}) => {
  try {
    console.log("The data to the backend is ", payload);
    const response = await axiosInstance.post(
      "/candidate/ping-hiring-manager",
      payload,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error pinging hiring manager");
    throw error;
  }
};

export const getCandidateActivity = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `/candidate/activity?candidateId=${candidateId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching candidate activity", error);
    throw error;
  }
};

export const getCandidateTotalEvaluation = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `/candidate/evaluation?candidateId=${candidateId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching candidate evaluation", error);
    throw error;
  }
};

export const getCandidateEvaluationDetails = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `/candidate/evaluation/details?candidateId=${candidateId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching candidate evaluation details", error);
    throw error;
  }
};
export const getCvByShareToken = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/candidate/public/cv?token=${token}`);
    console.log("The response from get cv by share token is ", response.data.data)
    return response.data.data.value;
  } catch (error) {
    console.error("Error fetching CV by share token:", error);
    throw error;
  }
};
