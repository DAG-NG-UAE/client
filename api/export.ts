import axiosInstance from "./axiosInstance";

export const exportCandidateProfiles = async (candidateIds: string[]): Promise<void> => {
    const response = await axiosInstance.post(
        '/analytics/export/candidate/profile',
        { candidateIds },
        { responseType: 'blob' }
    );

    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'candidates.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};
