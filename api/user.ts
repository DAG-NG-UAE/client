import axiosInstance from "./axiosInstance"

export const getRecruiters = async (roleName: string) => { 
    try{ 
        const response = await axiosInstance.get(`/user/role?role=${roleName}`)
        return response.data.data
    }catch(error: any){ 

    }
}

export const getLoggedInUserManager = async () => { 
    try{
        const response = await axiosInstance.get(`/user/ms/manager`)
        return response.data.data
    }catch(error: any){ 

    }
}