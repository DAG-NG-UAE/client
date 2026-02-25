import axiosInstance from "./axiosInstance";

export const getPreference = async () => {
    try {
        const response = await axiosInstance.get("/preference/");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching preference:", error);
        throw error;
    }
}

export const getAdminPreferences = async (page = 1, limit = 10, search = "") => {
    try {
        const response = await axiosInstance.get(`/preference/admin?page=${page}&limit=${limit}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching admin preferences:", error);
        throw error;
    }
}

export const getSinglePreference = async (prefKey: string) => {
    try {
        const response = await axiosInstance.get(`/preference/admin/single?prefKey=${prefKey}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching single preference:", error);
        throw error;
    }
}

export const getSkillsByPrefKey = async (prefKey: string) => {
    try {
        const response = await axiosInstance.get(`/preference/admin/skill?prefKey=${prefKey}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching skills by prefKey:", error);
        throw error;
    }
}

export const deleteSkill = async (skillId: number | string, prefKey: string) => {
    try {
        const response = await axiosInstance.delete(`/preference/admin/skill?skillId=${skillId}&prefKey=${prefKey}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting skill:", error);
        throw error;
    }
}

export const addSkill = async (prefKey: string, skillName: string) => {
    try {
        const response = await axiosInstance.post(`/preference/admin/skill`, { prefKey, skillName });
        return response.data;
    } catch (error) {
        console.error("Error adding skill:", error);
        throw error;
    }
}

export const updateSkill = async (prefKey: string, skillId: number | string, skillName: string) => {
    try {
        const response = await axiosInstance.put(`/preference/admin/skill?prefKey=${prefKey}&skillId=${skillId}`, { skillName });
        return response.data;
    } catch (error) {
        console.error("Error updating skill:", error);
        throw error;
    }
}

export const getOptionValues = async (prefKey: string) => {
    try {
        const response = await axiosInstance.get(`/preference/admin/option?prefKey=${prefKey}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching option values:", error);
        throw error;
    }
}

export const addOptionValue = async (prefKey: string, optionName: string) => {
    try {
        const response = await axiosInstance.post(`/preference/admin/option`, { prefKey, optionName });
        return response.data;
    } catch (error) {
        console.error("Error adding option value:", error);
        throw error;
    }
}

export const updateOptionValue = async (prefKey: string, optionId: number | string, optionName: string) => {
    try {
        const response = await axiosInstance.put(`/preference/admin/option?prefKey=${prefKey}&optionId=${optionId}`, { optionName });
        return response.data;
    } catch (error) {
        console.error("Error updating option value:", error);
        throw error;
    }
}

export const createPreference = async (data: { label: string, field_type: string, category: string }) => {
    try {
        const response = await axiosInstance.post(`/preference/admin`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating preference:", error);
        throw error;
    }
}