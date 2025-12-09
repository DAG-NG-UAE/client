import axiosInstance from "./axiosInstance";

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

export const getAllCandidates = async() => { 
    try{ 
        const response = await axiosInstance.get(`candidate`)
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