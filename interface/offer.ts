export interface Clauses { 
    master_clauses_id: string; 
    title: string; 
    content: string; 
    is_mandatory: boolean
}
export interface ExtendedClause extends Clauses {
    instanceId: string; // Unique ID for the drag mapping (in case multiple of same clause)
    sort_order: number; // Added for sorting
}