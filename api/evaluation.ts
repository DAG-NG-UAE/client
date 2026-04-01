import axiosInstance from './axiosInstance';

export interface EvaluationCriteriaPayload {
  competence_profile: string;
  parameter_name: string;
  guidance_points: string[];
  is_global: boolean;
  departments?: string[];
}

// GET response shape — note: server returns `competency_profile` (no 'e')
export interface EvaluationCriteria {
  evaluation_criteria_id: string;
  competency_profile: string;
  parameter_name: string;
  guidance_points: string[];
  is_global: boolean;
  is_active: boolean;
  departments: string[];
}

export const createEvaluationCriteria = async (criteria: EvaluationCriteriaPayload[]) => {
  try {
    const response = await axiosInstance.post('/interview/evaluation-criteria', criteria);
    return response.data.data;
  } catch (error) {
    console.error('Error creating evaluation criteria:', error);
    throw error;
  }
};

export const getEvaluationCriteria = async (params?: { is_active?: boolean; is_global?: boolean }) => {
  try {
    const response = await axiosInstance.get('/interview/evaluation-criteria', { params });
    return response.data.data as EvaluationCriteria[];
  } catch (error) {
    console.error('Error fetching evaluation criteria:', error);
    throw error;
  }
};
