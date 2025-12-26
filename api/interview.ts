import axiosInstance from "./axiosInstance"

export const getEvaluationForm = async (department:string) => { 
    try{ 
        const response = await axiosInstance.get(`/interview/evaluation-form?department=${department}`)
        console.log(`from the interview api, the form is => ${JSON.stringify(response.data.data)}`)
        return response.data.data
    }catch(error){ 
        console.error("Error updating candidate status")
        throw error
    }
}