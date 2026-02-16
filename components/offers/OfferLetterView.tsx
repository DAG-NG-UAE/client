import { Box, Button, Card, CardContent, Divider, IconButton, Paper, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Clauses, Offer } from '@/interface/offer';

interface OfferLetterViewProps {
    offer: Partial<Offer> | null;
    onBack: () => void;
}

// Extending Clauses locally to accommodate potential extra fields like sort_order if they come from the API
interface OfferClause extends Clauses {
    sort_order?: number;
    clause_id?: string;
}

const OfferLetterView = ({ offer, onBack }: OfferLetterViewProps) => {
    if (!offer?.clauses || offer.clauses.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <IconButton onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography>No offer letter content available.</Typography>
            </Box>
        );
    }

    // Sort clauses by sort_order if available
    const sortedClauses = [...(offer.clauses as OfferClause[])].sort((a, b) => 
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    return (
        <Box sx={{ p: 3, maxWidth: '900px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">Offer Letter Preview</Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 8, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                {/* Header / Company Logo Area - Placeholder */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                     {/* You could add a logo here if available */}
                     <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{offer.company_name || 'Company Name'}</Typography>
                     <Typography variant="body2" color="text.secondary">ref: {offer.offer_id}</Typography>
                </Box>

                <Stack spacing={4}>
                    {sortedClauses.map((clause, index) => (
                        <Box key={clause.clause_id || clause.master_clauses_id || index}>
                            {/* Only show title if it's not the Cover Letter or if desired. 
                                Usually titles like "Compensation" are shown. 
                                "Offer Cover Letter" might be hidden or styled differently if preferred.
                                For now, I will render all titles as bold headers. 
                            */}
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {clause.title}
                            </Typography>
                            
                            {/* Using dangerouslySetInnerHTML if content is HTML, or just text. 
                                The example showed plain text but offers often have HTML. 
                                I'll assume text for now but if it looks like HTML commonly we might need parsing.
                                The user's snippet was plain text.
                            */}
                            <Typography 
                                variant="body1" 
                                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                            >
                                {clause.content}
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                {/* Signature Section */}
                <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                         <Box>
                             <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Authorized Signatory</Typography>
                             <Typography variant="body2" color="text.secondary">For {offer.company_name}</Typography>
                         </Box>
                         
                         {offer.digital_signature && (
                             <Box sx={{ textAlign: 'right' }}>
                                 {/* <img 
                                    src={offer.digital_signature} 
                                    alt="Candidate Signature" 
                                    style={{ maxHeight: '60px', marginBottom: '8px' }} 
                                 /> */}
                                 <Typography>{offer.digital_signature}</Typography>
                                 <Typography variant="body2" display="block">Accepted by {offer.position}</Typography>
                                 <Typography variant="caption" color="text.secondary">
                                     {offer.accepted_at ? new Date(offer.accepted_at).toLocaleDateString() : ''}
                                 </Typography>
                             </Box>
                         )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default OfferLetterView;
