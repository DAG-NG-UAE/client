import axiosInstance from "./axiosInstance"

export const getEvaluationForm = async (department: string) => {
    try {
        const response = await axiosInstance.get(`/interview/evaluation-form?department=${department}`)
        console.log(`from the interview api, the form is => ${JSON.stringify(response.data.data)}`)
        return response.data.data
    } catch (error) {
        console.error("Error updating candidate status")
        throw error
    }
}

export const searchInterviewers = async (query: string) => {
    try {
        const response = await axiosInstance.get(`/interview/search-interviewers?q=${query}`)
        console.log(`from the interview api, the search results are => ${JSON.stringify(response.data.data)}`)
        return response.data.data
    } catch (error) {
        console.error("Error searching interviewers:", error)
        throw error
    }
}

export const getInterviewerAvailability = async (email: string[], date: string) => {
    try {
        console.log(email)
        // convert the email to array of string 

        const response = await axiosInstance.get('/interview/check-availability', {
            params: {
                // Axios will format this as ?email=user1@...&email=user2@...
                email,
                date: date
            },
            paramsSerializer: {
                indexes: null
            }
        });
        console.log(`from the interview api, the interviewer availability is => ${JSON.stringify(response.data.data)}`)
        return response.data.data
    } catch (error) {
        console.error("Error fetching interviewer availability:", error)
        throw error
    }
}