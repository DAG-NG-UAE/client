import { CandidateActions } from "@/interface/candidate";
import { CandidateStatusType } from "@/types/candidate";

export function determineActions(currentStatus: CandidateStatusType): CandidateActions {
    switch (currentStatus) {
     case 'applied':
       return {
         progressionAction: {
           label: 'Move to Shortlisted',
           actionType: 'SHORTLIST_CANDIDATE',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: true,
           requiresNotes: true,
           targetStatus: 'SHORTLISTED',
         },
         rejectionAction: {
           label: 'Reject Candidate',
           actionType: 'REJECT_CANDIDATE',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: true,
           requiresNotes: true,
           targetStatus: 'REJECTED', // Assuming 'REJECTED' as a terminal status
         },
       };
     case 'shortlisted':
       return {
         progressionAction: {
           label: 'Schedule Interview',
           actionType: 'SCHEDULE_INTERVIEW',
           description: 'Triggers the Scheduling Workflow (Hiring Manager, date, time, Teams link, email).',
           triggersWorkflow: 'Scheduling',
         },
         rejectionAction: {
           label: 'Reject Candidate',
           actionType: 'REJECT_CANDIDATE',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: true,
           requiresNotes: true,
           targetStatus: 'REJECTED',
           triggersWorkflow: 'Reject Candidate'
         },
       };
     case 'interview_scheduled':
       return {
         progressionAction: {
           label: 'Mark as Interviewed',
           actionType: 'MARK_INTERVIEWED',
           description: 'Mark as Interviewed is a simple status change.',
           targetStatus: 'INTERVIEWED',
         },
         rejectionAction: {
           label: 'Cancel Interview / Reject',
           actionType: 'CANCEL_INTERVIEW_REJECT',
           description: 'Cancel resets to SHORTLISTED. If rejection, simple status change.',
           requiresConfirmation: true, // For both cancel and reject scenarios
           requiresNotes: true, // If rejecting
           targetStatus: 'SHORTLISTED', // Default for cancel, logic will handle actual rejection if chosen
         },
       };
     case 'interviewed':
       return {
         progressionAction: {
           label: 'Begin Pre-offer Discussion',
           actionType: 'BEGIN_PRE_OFFER_DISCUSSION',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: false,
           requiresNotes: false,
           targetStatus: 'PRE_OFFER_DISCUSSION',
         },
         rejectionAction: {
           label: 'Reject Candidate',
           actionType: 'REJECT_CANDIDATE',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: true,
           requiresNotes: true,
           targetStatus: 'REJECTED',
         },
       };
     case 'pending_feedback':
       return {
         progressionAction: {
           label: 'Begin Pre-offer Discussion',
           actionType: 'BEGIN_PRE_OFFER_DISCUSSION',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: false,
           requiresNotes: false,
           targetStatus: 'PRE_OFFER_DISCUSSION',
         },
         rejectionAction: {
           label: 'Reject Candidate',
           actionType: 'REJECT_CANDIDATE',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: true,
           requiresNotes: true,
           targetStatus: 'REJECTED',
         },
       };
       case 'pre_offer':
       return {
         progressionAction: {
           label: 'Begin Internal Salary Proposal',
           actionType: 'BEGIN_INTERNAL_SALARY_PROPOSAL',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: false,
           requiresNotes: false,
           targetStatus: 'INTERNAL_SALARY_PROPOSAL',
         },
         rejectionAction: {
           label: 'Reject Candidate',
           actionType: 'REJECT_CANDIDATE',
           description: 'Simple status change; requires confirmation/notes.',
           requiresConfirmation: true,
           requiresNotes: true,
           targetStatus: 'REJECTED',
         },
       };
     case 'offer_extended':
       return {
         progressionAction: {
           label: 'Record: Accepted',
           actionType: 'RECORD_OFFER_ACCEPTED',
           description: 'Simple status change to OFFER_ACCEPTED.',
           targetStatus: 'OFFER_ACCEPTED',
         },
         rejectionAction: {
           label: 'Record: Rejected',
           actionType: 'RECORD_OFFER_REJECTED',
           description: 'Simple status change to OFFER_REJECTED.',
           targetStatus: 'OFFER_REJECTED',
         },
       };
     default:
       // For any other status (e.g., OFFER_ACCEPTED, OFFER_REJECTED, or unexpected)
           return {
             progressionAction: null,
             rejectionAction: null,
           };
       }
   }