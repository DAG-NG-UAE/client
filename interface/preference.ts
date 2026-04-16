export interface Preference {
    id: number;
    pref_key: string;
    label: string;
    field_type: string;
    category: string;
    question_style?: string | null;
    created_at: string;
    updated_at: string;
    updated_by: string;
}

export interface RankingOption {
    id: number;
    pref_key: string;
    option_value: string;
    rank: number;
}

export interface PreferenceDetail {
    pref_key: string;
    category_label: string;
    field_type: string;
    category: string;
    skill_id: number | null;
    skill_name: string | null;
    ranking_options: RankingOption[];
}

export interface PreferenceMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
