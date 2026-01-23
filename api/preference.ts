import axiosInstance from "./axiosInstance";

export const getPreference = async() => {
    try{ 
        const response = await axiosInstance.get("/preference/");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching preference:", error);
        throw error;
    }
}