export interface EvaluationForm {
  evaluation_criteria_id: string;
  parameter_name: string;
  guidance_points: string[];
}

interface EvaluationDetail {
  rating: number;
  comment: string;
}

export interface CandidateEvaluationPayload {
  candidateId: string; // UUID string
  evaluatorId: string; // UUID string
  evaluation: Record<string, EvaluationDetail>;
  recommendation: string; // 'approved_for_offer' | 'rejected' | 'hold'
  requisitionId: string
}
