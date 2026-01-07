import { Box, Card, CardContent, Divider, Grid, IconButton, Stack, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { JoiningDetails } from '@/interface/offer';
import { formatOfferDate } from '@/utils/transform';

interface JoiningDetailsViewProps {
    details: Partial<JoiningDetails> | null;
    onBack: () => void;
}

const JoiningDetailsView = ({ details, onBack }: JoiningDetailsViewProps) => {
    if (!details) {
        return (
            <Box sx={{ p: 3 }}>
                <IconButton onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography>No joining details available.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">Joining Form Details</Typography>
            </Box>

            <Stack spacing={4}>
                {/* Personal Details */}
                <SectionCard title="Personal Details">
                    <Grid container spacing={3}>
                        <DetailItem label="First Name" value={details.first_name} />
                        <DetailItem label="Middle Name" value={details.middle_name} />
                        <DetailItem label="Last Name" value={details.last_name} />
                        <DetailItem label="Gender" value={details.gender} />
                        <DetailItem label="Date of Birth" value={details.dob} />
                        <DetailItem label="Place of Birth" value={details.place_of_birth} />
                        <DetailItem label="Country of Birth" value={details.country_of_birth} />
                        <DetailItem label="Nationality" value={details.nationality} />
                        <DetailItem label="Marital Status" value={details.marital_status} />
                        <DetailItem label="Religion" value={details.religion} />
                        <DetailItem label="Blood Group" value={details.blood_group} />
                    </Grid>
                    
                    {details.languages && details.languages.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                             <Typography variant="subtitle2" sx={{ mb: 1 }}>Languages</Typography>
                             <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Language</TableCell>
                                            <TableCell align="center">Read</TableCell>
                                            <TableCell align="center">Write</TableCell>
                                            <TableCell align="center">Speak</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {details.languages.map((lang, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{lang.language}</TableCell>
                                                <TableCell align="center">{lang.read ? 'Yes' : 'No'}</TableCell>
                                                <TableCell align="center">{lang.write ? 'Yes' : 'No'}</TableCell>
                                                <TableCell align="center">{lang.speak ? 'Yes' : 'No'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </TableContainer>
                        </Box>
                    )}
                </SectionCard>

                {/* Contact & Address */}
                <SectionCard title="Contact & Address">
                    <Grid container spacing={3}>
                        <DetailItem label="Permanent Address" value={details.permanent_address} xs={12} />
                        <DetailItem label="Current Address" value={details.current_address} xs={12} />
                        <DetailItem label="Mobile (Nigeria)" value={details.mobile_nigeria} />
                        <DetailItem label="Personal Email" value={details.personal_email} />
                    </Grid>
                </SectionCard>

                {/* Identification & Licenses */}
                <SectionCard title="Identification & Licenses">
                    <Grid container spacing={3}>
                        <DetailItem label="Passport Number" value={details.passport_number} />
                        <DetailItem label="Date of Issue" value={details.passport_issue_date} />
                        <DetailItem label="Expiry Date" value={details.passport_expiry_date} />
                        <DetailItem label="Place of Issue" value={details.passport_place_of_issue} />
                        <DetailItem label="Has Driving License?" value={details.has_driving_license} />
                        <DetailItem label="License Number" value={details.driving_license_number} />
                    </Grid>
                </SectionCard>

                {/* Financials */}
                <SectionCard title="Financials">
                    <Grid container spacing={3}>
                        <DetailItem label="Bank Name" value={details.bank_name} />
                        <DetailItem label="Account Number" value={details.account_number} />
                        <DetailItem label="Account Type" value={details.account_type} />
                        <DetailItem label="Pension Fund Account" value={details.pension_fund_account} />
                        <DetailItem label="Gross Salary" value={details.gross_salary} />
                    </Grid>
                </SectionCard>

                {/* Family & Next of Kin */}
                <SectionCard title="Family & Next of Kin">
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', mt: 1 }}>Next of Kin</Typography>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <DetailItem label="Name" value={details.next_of_kin?.name} />
                        <DetailItem label="Relationship" value={details.next_of_kin?.relationship} />
                        <DetailItem label="Age" value={details.next_of_kin?.age} />
                        <DetailItem label="Phone" value={details.next_of_kin?.phone} />
                        <DetailItem label="Address" value={details.next_of_kin?.address} xs={12} />
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>Relatives in Company</Typography>
                     <Grid container spacing={3} sx={{ mb: 3 }}>
                        <DetailItem label="Has Relative?" value={details.relatives_in_company?.has_relative} />
                        {details.relatives_in_company?.has_relative === 'Yes' && (
                            <>
                                <DetailItem label="Name" value={details.relatives_in_company?.name} />
                                <DetailItem label="Relation" value={details.relatives_in_company?.relation} />
                                <DetailItem label="Department" value={details.relatives_in_company?.dept} />
                            </>
                        )}
                    </Grid>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>Family Members</Typography>
                    {details.family_members && details.family_members.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Relation</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Date of Birth</TableCell>
                                        <TableCell>Profession</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {details.family_members.map((member, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{member.name}</TableCell>
                                            <TableCell>{member.relation_type}</TableCell>
                                            <TableCell>{member.gender}</TableCell>
                                            <TableCell>{member.dob}</TableCell>
                                            <TableCell>{member.profession}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : <Typography color="text.secondary">No family members listed.</Typography>}
                </SectionCard>

                {/* Emergency Contacts & References */}
                <SectionCard title="Emergency Contacts & References">
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>Emergency Contact (Primary)</Typography>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <DetailItem label="Name" value={details.emergency_primary?.name} />
                        <DetailItem label="Relationship" value={details.emergency_primary?.relationship} />
                         <DetailItem label="Phone" value={details.emergency_primary?.phone} />
                        <DetailItem label="Address" value={details.emergency_primary?.address} xs={12} />
                    </Grid>

                    <Divider sx={{ my: 2 }} />
                     <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>References</Typography>
                     {details.references && details.references.length > 0 ? (
                         <Grid container spacing={2}>
                            {details.references.map((ref, idx) => (
                                <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                                        <Typography variant="subtitle2">{ref.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{ref.contact_no}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                         </Grid>
                     ) : <Typography color="text.secondary">No references listed.</Typography>}
                </SectionCard>

                 {/* History */}
                 <SectionCard title="History">
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>Employment History</Typography>
                    {details.employment_history && details.employment_history.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Designation</TableCell>
                                        <TableCell>From</TableCell>
                                        <TableCell>To</TableCell>
                                        <TableCell>Reason for Leaving</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {details.employment_history.map((job, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{job.company_name}</TableCell>
                                            <TableCell>{job.last_designation}</TableCell>
                                            <TableCell>{job.doj}</TableCell>
                                            <TableCell>{job.dol}</TableCell>
                                            <TableCell>{job.reason_for_leaving}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : <Typography color="text.secondary" sx={{ mb: 3 }}>No employment history.</Typography>}

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>Educational History</Typography>
                    {details.educational_history && details.educational_history.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Institute</TableCell>
                                        <TableCell>Qualification</TableCell>
                                        <TableCell>Specialization</TableCell>
                                        <TableCell>Passing Year</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {details.educational_history.map((edu, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{edu.institute}</TableCell>
                                            <TableCell>{edu.qualification}</TableCell>
                                            <TableCell>{edu.specialization}</TableCell>
                                            <TableCell>{edu.passing_year}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : <Typography color="text.secondary" sx={{ mb: 3 }}>No educational history.</Typography>}

                     <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>Trainings & Certifications</Typography>
                    {details.trainings_certifications && details.trainings_certifications.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                             <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Completion Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {details.trainings_certifications.map((cert, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{cert.name}</TableCell>
                                            <TableCell>{cert.location}</TableCell>
                                            <TableCell>{cert.completion_date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : <Typography color="text.secondary">No certifications.</Typography>}
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

export default JoiningDetailsView;
