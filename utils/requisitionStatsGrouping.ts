export type RequisitionStatEntry = {
    current_status: string;
    count: string | number;
    total_candidates: string | number;
};

export type StageBreakdown = {
    status: string;
    count: number;
};

export type ZoneGroup = {
    label: string;
    total: number;
    stages: StageBreakdown[];
};

export type GroupedRequisitionStats = {
    zones: ZoneGroup[];
    totalCandidates: number;
};

const ZONE_DEFINITIONS: { label: string; statuses: string[] }[] = [
    { label: 'In Pipeline', statuses: ['applied', 'screened', 'shortlisted'] },
    { label: 'In Interview', statuses: ['interview_scheduled', 'interviewed', 'pending_feedback'] },
    {
        label: 'In Offer',
        statuses: ['pre_offer', 'internal_salary_proposal', 'approved_for_offer', 'offer_extended', 'offer_accepted', 'offer_rejected', 'hired'],
    },
    { label: 'Exited', statuses: ['rejected', 'withdrawn', 'on_hold'] },
];

export const ZONE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'In Pipeline': { bg: '#dbeafe', text: '#1e3a8a', border: '#93c5fd' },
    'In Interview': { bg: '#f3e8ff', text: '#6b21a8', border: '#c4b5fd' },
    'In Offer': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'Exited': { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
};

export const groupRequisitionStats = (data: RequisitionStatEntry[]): GroupedRequisitionStats => {
    if (!data || data.length === 0) {
        return {
            zones: ZONE_DEFINITIONS.map(def => ({ label: def.label, total: 0, stages: [] })),
            totalCandidates: 0,
        };
    }

    const totalCandidates = parseInt(String(data[0]?.total_candidates ?? '0'), 10) || 0;

    const countMap = new Map<string, number>();
    data.forEach(entry => {
        const count = parseInt(String(entry.count ?? '0'), 10) || 0;
        if (entry.current_status) countMap.set(entry.current_status, count);
    });

    const zones: ZoneGroup[] = ZONE_DEFINITIONS.map(def => {
        const stages: StageBreakdown[] = def.statuses
            .map(status => ({ status, count: countMap.get(status) ?? 0 }))
            .filter(s => s.count > 0);
        const total = stages.reduce((sum, s) => sum + s.count, 0);
        return { label: def.label, total, stages };
    });

    return { zones, totalCandidates };
};
