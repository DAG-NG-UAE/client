
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Checkbox,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Chip,
  CircularProgress,
} from "@mui/material";
import { getPreference } from "../../api/preference";

export interface PreferenceItem {
  id: string;
  preference: string; // The Name
  type: "select" | "checkbox" | "text" | "multi-select";
  options?: string[]; // If select
  value: string | boolean | string[];
  askCandidate: boolean;
}

interface PreferenceTableProps {
  recruitmentType: "Local" | "Expat";
  onBack: () => void;
  onSubmit: (preferences: PreferenceItem[]) => void;
  loading?: boolean;
}

const PreferenceTable: React.FC<PreferenceTableProps> = ({
  recruitmentType,
  onBack,
  onSubmit,
  loading = false,
}) => {
  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setFetching(true);
        const data = await getPreference();
        
        // Filter based on recruitment type
        // 'both' applies to everyone. 'expat' only for Expat. 'local' (if exists) only for Local.
        const filteredData = data.filter((item: any) => {
            if (item.category === 'both') return true;
            if (recruitmentType === 'Expat' && item.category === 'expat') return true;
            if (recruitmentType === 'Local' && item.category === 'local') return true; // assuming 'local' exists
            return false;
        });

        const mappedPreferences: PreferenceItem[] = filteredData.map((item: any) => {
            let type: PreferenceItem["type"] = "text";
            let value: any = "";

            if (item.field_type === "dropdown") {
                type = "select";
                value = item.options && item.options.length > 0 ? item.options[0] : "";
            } else if (item.field_type === 'number') {
                type = "text"; // We render a TextField
            }

            // Special case for language proficiency to be multi-select
            if (item.pref_key === "language_proficiency") {
                type = "multi-select";
                value = [];
            }

            return {
                id: item.pref_key, // using pref_key as unique id
                preference: item.label,
                type: type,
                options: item.options || [],
                value: value,
                askCandidate: false, // Default to false as per user request (toggle button is separate)
            };
        });

        setPreferences(mappedPreferences);
      } catch (err) {
        console.error("Failed to fetch preferences", err);
      } finally {
        setFetching(false);
      }
    };

    fetchPreferences();
  }, [recruitmentType]);

  const handleValueChange = (id: string, newValue: any) => {
    setPreferences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  const handleAskChange = (id: string, checked: boolean) => {
    setPreferences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, askCandidate: checked } : item
      )
    );
  };

  const renderInput = (item: PreferenceItem) => {
    if (item.type === "select") {
      return (
        <Select
          size="small"
          fullWidth
          value={item.value as string}
          onChange={(e) => handleValueChange(item.id, e.target.value)}
        >
            {item.options?.map((opt) => (
            <MenuItem key={opt} value={opt}>
                {opt}
            </MenuItem>
            ))}
        </Select>
      );
    }
    if (item.type === "multi-select") {
        return (
            <Select
                size="small"
                fullWidth
                multiple
                value={item.value as string[]}
                onChange={(e) => handleValueChange(item.id, typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                        ))}
                    </Box>
                )}
            >
                {item.options?.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                ))}
            </Select>
        );
    }
    if (item.type === "checkbox") {
      return (
        <Checkbox
          checked={item.value as boolean}
          onChange={(e) => handleValueChange(item.id, e.target.checked)}
        />
      );
    }
    if (item.type === "text") {
        return (
            <TextField 
                size="small" 
                fullWidth 
                value={item.value} 
                onChange={(e) => handleValueChange(item.id, e.target.value)}
                type={item.id === 'min_experience' ? "number" : "text"} // Simple heuristic for now
            />
        )
    }
    return null;
  };

  if (fetching) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Candidate Preferences ({recruitmentType})
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure the final requirements and preferences.
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ backgroundColor: "background.default" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: '30%' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: '40%' }}>Value / Requirement</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: '30%' }}>Ask Candidate?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {preferences.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>{item.preference}</TableCell>
                    <TableCell>{renderInput(item)}</TableCell>
                    <TableCell>
                        <FormControlLabel
                            control={
                            <Switch
                                checked={item.askCandidate}
                                onChange={(e) => handleAskChange(item.id, e.target.checked)}
                                color="primary"
                            />
                            }
                            label={item.askCandidate ? "Yes" : "No"}
                        />
                    </TableCell>
                </TableRow>
             ))}
            
            {preferences.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} align="center">No specific preferences defined.</TableCell>
                </TableRow>
            )}

          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button onClick={onBack} variant="outlined" disabled={loading}>
          Back
        </Button>
        <Button
          onClick={() => onSubmit(preferences)}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Requisition"}
        </Button>
      </Box>
    </Box>
  );
};

export default PreferenceTable;
