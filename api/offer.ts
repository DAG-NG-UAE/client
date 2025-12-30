import axiosInstance from "./axiosInstance"

export const getAllClauses  = async() => { 
    try{ 
        const response = await axiosInstance.get('offer/clauses')
        return response.data.data
    }catch(error) { 
        console.error('Error fetching all clauses', error)
        throw error
    }
}