import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Stack, Select, MenuItem, FormControl, InputLabel, IconButton, FormHelperText
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { CandidateProfile } from '@/interface/candidate';
import { scheduleInterview } from '@/api/candidate'; // Import the new API function

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  candidate: Partial<CandidateProfile> | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ open, onClose, candidate }) => {
  const [interviewType, setInterviewType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [interviewers, setInterviewers] = useState(['']); // Changed to an array
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterviewerChange = (index: number, value: string) => {
    const newInterviewers = [...interviewers];
    newInterviewers[index] = value;
    setInterviewers(newInterviewers);
  };

  const addInterviewer = () => {
    setInterviewers([...interviewers, '']);
  };

  const removeInterviewer = (index: number) => {
    const newInterviewers = interviewers.filter((_, i) => i !== index);
    setInterviewers(newInterviewers);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!candidate?.candidate_id || !candidate.requisition_id) {
        console.error("Candidate ID or Requisition ID is missing");
        return;
    }

    setIsSubmitting(true);
    try {
        await scheduleInterview({
            candidate_id: candidate.candidate_id,
            requisition_id: candidate.requisition_id,
            current_status: 'interview_scheduled',
            interview_type: interviewType,
            interview_date: date,
            interview_time: time,
            interview_panel: interviewers.filter(i => i.trim() !== ''), // Send clean array
        });
        onClose(); // Close the modal and trigger refresh
    } catch (error) {
        console.error("Failed to schedule interview:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="schedule-interview-modal-title"
    >
      <Box sx={style}>
        <Typography id="schedule-interview-modal-title" variant="h6" component="h2">
          Schedule Interview for {candidate?.candidate_name}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="interview-type-label">Interview Type</InputLabel>
              <Select
                labelId="interview-type-label"
                value={interviewType}
                label="Interview Type"
                onChange={(e) => setInterviewType(e.target.value)}
                required
              >
                <MenuItem value="hm-interview">Interview With HM</MenuItem>
                <MenuItem value="another-interview">Another Interview</MenuItem>
                <MenuItem value="executive-interview">Interview With C-Level</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: -1 }}>Interviewer(s)</Typography>
            {interviewers.map((interviewer, index) => (
              <Stack direction="row" spacing={1} key={index} alignItems="center">
                <TextField
                  label={`Interviewer ${index + 1}`}
                  value={interviewer}
                  onChange={(e) => handleInterviewerChange(index, e.target.value)}
                  required
                  fullWidth
                />
                <IconButton onClick={() => removeInterviewer(index)} disabled={interviewers.length === 1}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addInterviewer}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Interviewer
            </Button>
            <FormHelperText sx={{mt: -1, ml: 1}}>Click the button to add another interviewer.</FormHelperText>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling...' : 'Schedule'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ScheduleInterviewModal;