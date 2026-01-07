import { Box, Card, CardContent, Grid, IconButton, Stack, Typography, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Guarantor } from '@/interface/offer';

interface GuarantorDetailsViewProps {
    details: Partial<Guarantor> | null;
    onBack: () => void;
}

const GuarantorDetailsView = ({ details, onBack }: GuarantorDetailsViewProps) => {
    if (!details) {
        return (
            <Box sx={{ p: 3 }}>
                <IconButton onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography>No guarantor details available.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">Guarantor Details</Typography>
            </Box>

            <Stack spacing={4}>
                {/* Basic Information */}
                <SectionCard title="Guarantor Information">
                    <Grid container spacing={3}>
                        <DetailItem label="Full Name" value={details.guarantor_full_name} />
                        <DetailItem label="Email Address" value={details.email_address} />
                        <DetailItem label="Phone Number" value={details.phone_number} />
                        <DetailItem label="Income Range" value={details.income_range} />
                        <DetailItem label="Work Address" value={details.place_of_work_address} xs={12} />
                        <DetailItem label="Home Address" value={details.house_address} xs={12} />
                    </Grid>
                </SectionCard>

                {/* Relationship & Assessment */}
                <SectionCard title="Relationship & Assessment">
                    <Grid container spacing={3}>
                        <DetailItem label="Relationship" value={details.relationship_with_employee === 'Other' ? details.relationship_other : details.relationship_with_employee} />
                        <DetailItem label="Known Duration" value={details.known_duration} />
                        <DetailItem label="Assessment of Character" value={details.assessment_character} />
                        <DetailItem label="Character Comments" value={details.assessment_comment} xs={12} />
                        <DetailItem label="General Comments" value={details.general_comment} xs={12} />
                    </Grid>
                    
                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={3}>
                        <DetailItem label="Is Honest?" value={details.is_honest} />
                        <DetailItem label="Recommend for Employment?" value={details.recommend_for_employment} />
                        <DetailItem label="Recommendation Comments" value={details.recommend_comment} xs={12} />
                        <DetailItem label="Will Stand as Guarantor?" value={details.will_stand_as_guarantor} />
                    </Grid>
                </SectionCard>

                {/* Declaration of Truth */}
                <SectionCard title="Declaration">
                    <Typography gutterBottom>
                        {details.declaration_agreed 
                            ? "Guarantor has agreed to the declaration of truth." 
                            : "Declaration not agreed yet."}
                    </Typography>
                    {details.digital_signature && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Digital Signature</Typography>
                            <img src={details.digital_signature} alt="Guarantor Signature" style={{ maxWidth: '100%', maxHeight: '80px', marginTop: '8px' }} />
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <DetailItem label="Signed Date" value={details.declaration_date} />
                    </Box>
                </SectionCard>
            </Stack>
        </Box>
    );
};

const SectionCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Card>
        <CardContent>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>{title}</Typography>
            {children}
        </CardContent>
    </Card>
);

const DetailItem = ({ label, value, xs = 6 }: { label: string, value: any, xs?: number }) => (
    <Grid size={{ xs: xs, md: xs === 12 ? 12 : 4 }}>
        <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
        <Typography variant="body1">{value || '---'}</Typography>
    </Grid>
);

export default GuarantorDetailsView;
