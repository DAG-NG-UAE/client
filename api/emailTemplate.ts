import axiosInstance from "./axiosInstance";

export const getTemplateType = async (templateType: string) => { 
    try{ 
        const response = await axiosInstance.get(`/email-template?templateType=${templateType}`);
        return response.data;
    }catch(error){ 
        throw error;
    }
}