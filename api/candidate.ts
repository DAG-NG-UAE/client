import { CandidateProfile } from "@/interface/candidate";
import axiosInstance, { API_BASE_URL } from "./axiosInstance";

// get the candidates for a requisition 
export const getCandidatesForRequisition = async (requisitionId: string) => {
    try {
        const response = await axiosInstance.get(`requistion/candidate?requisitionId=${requisitionId}`);
        console.log('Fetched candidates:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching candidates:', error);
        throw error;
    }
};

export const apply = async(applicantData: FormData, slug: string) => { 
    try { 
        console.log('Making request to backend...');
        const response = await axiosInstance.post(
            `application?slug=${slug}`, 
            applicantData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error applying:', error);
        throw error;
    }
}

export const getAllCandidates = async(requisitionId?:string, status?:string) => { 
    try{ 
        const queryParams = new URLSearchParams()
        if(requisitionId && requisitionId.trim().toLowerCase() !== 'all'){
            queryParams.append('requisitionId', requisitionId)
        }
        if(status && status.trim().toLowerCase() !== 'all'){ 
            queryParams.append('stage', status)
        }
        const queryString = queryParams.toString()
        const url = requisitionId || status ? `candidate?${queryString}` : `candidate`
        const response = await axiosInstance.get(url)
        console.log(`the response from get all candidate => ${JSON.stringify(response.data.data)}`)
        return response.data.data
    }catch(error){ 
        console.error('Error fetching all candidates:', error);
        throw error;
    }
}

export const getSingleCandidate = async(candidateId: string) => { 
    try{ 
        const response = await axiosInstance.get(`candidate/single?candidateId=${candidateId}`)
        return response.data.data
    }catch(error){ 
        console.error("Error fetching single candidate details")
        throw error
    }
}

export const getCandidateResume = async(candidateId:string) => { 
    try{ 
        const resumeLink = `${API_BASE_URL}/candidate/resume?candidateId=${candidateId}`
        return resumeLink
    }catch(error){ 
        console.error("Error fetching single candidate details")
        throw error
    }
}

export const updateCandidateStatus = async(updateData:Partial<CandidateProfile>) => { 
    try{ 
        const response = await axiosInstance.put(`/candidate`, updateData)
        return response.data.data
    }catch(error){ 
        console.error("Error updating candidate status")
        throw error
    }
}

export const scheduleInterview = async(interviewData: {
    candidate_id: string, 
    requisition_id: string, 
    current_status: string,
    interview_date: string, 
    interview_time: string, 
    interview_type: string,
}) => {
    try{
        console.log('The data to the backend is ', interviewData)
        const response = await axiosInstance.post('/interview/schedule', interviewData)
        return response.data.data
    }catch(error){
        console.error("Error scheduling interview:", error);
        throw error;
    }
}