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
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getPreference } from "../../api/preference";

// --- Types for API Data ---
interface ApiRankingOption {
  rank: number;
  label: string;
}

interface ApiPreferenceItem {
  pref_key: string;
  category_label: string;
  field_type: string;
  category: "local" | "expat" | "both";
  skill_id: number | null;
  skill_name: string | null;
  ranking_options: ApiRankingOption[];
}

// --- Types for Internal State ---
interface UserSelection {
  internalId: string; // for React keys
  prefKey: string;
  categoryLabel: string;
  
  // For multi-skill categories
  skillId: number | null;
  skillName: string | null;
  
  // The selected value
  rankValue: string; // e.g., "Fluent" or "Bachelors"
  
  askCandidate: boolean;
}

// --- Compatible Interface for Parent Component ---
export interface PreferenceItem {
  id: string;
  preference: string;
  type: string; // kept for compatibility
  options?: string[]; // kept for compatibility
  value: string;
  askCandidate: boolean;
  // Extras that might be useful
  skill_id?: number | null;
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
  const [fetching, setFetching] = useState(true);
  
  // Grouped API data: prefKey -> list of items
  const [availableGroups, setAvailableGroups] = useState<Record<string, ApiPreferenceItem[]>>({});
  
  // Derived metadata about groups (label, isMultiSkill)
  const [groupMeta, setGroupMeta] = useState<Record<string, { label: string; isMultiSkill: boolean }>>({});

  // User selections: prefKey -> list of selections
  const [selections, setSelections] = useState<Record<string, UserSelection[]>>({});

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setFetching(true);
        const data: ApiPreferenceItem[] = await getPreference();

        // 1. Filter by recruitment type
        const filtered = data.filter((item) => {
          if (item.category === "both") return true;
          if (recruitmentType === "Expat" && item.category === "expat") return true;
          if (recruitmentType === "Local" && item.category === "local") return true;
          return false;
        });

        // 2. Group by pref_key
        const groups: Record<string, ApiPreferenceItem[]> = {};
        const meta: Record<string, { label: string; isMultiSkill: boolean }> = {};
        const initialSelections: Record<string, UserSelection[]> = {};

        filtered.forEach((item) => {
          if (!groups[item.pref_key]) {
            groups[item.pref_key] = [];
            
            // Check if this category has distinct skills
            // If the first item has a skill_id, we assume it's a list of skills (e.g. languages)
            // If skill_id is null, it's likely a single config (e.g. min_qualification)
            const isMulti = item.skill_id !== null;
            meta[item.pref_key] = {
              label: item.category_label,
              isMultiSkill: isMulti,
            };
            initialSelections[item.pref_key] = [];
          }
          groups[item.pref_key].push(item);
        });

        setAvailableGroups(groups);
        setGroupMeta(meta);
        
        // Initialize selections.
        // For single-skill groups (e.g. Min Qual), we might want to initialize one empty row
        // so the user sees the dropdown immediately.
        Object.keys(meta).forEach(key => {
            if (!meta[key].isMultiSkill) {
               // Add a default entry
               const groupItems = groups[key];
               if (groupItems.length > 0) {
                   const item = groupItems[0];
                   initialSelections[key] = [{
                       internalId: crypto.randomUUID(),
                       prefKey: key,
                       categoryLabel: item.category_label,
                       skillId: null,
                       skillName: null,
                       rankValue: "", // Empty initially
                       askCandidate: false
                   }];
               }
            }
        });

        setSelections(initialSelections);
      } catch (err) {
        console.error("Failed to fetch preferences", err);
      } finally {
        setFetching(false);
      }
    };

    fetchPreferences();
  }, [recruitmentType]);

  // --- Handlers ---

  const handleAddRow = (prefKey: string) => {
    const meta = groupMeta[prefKey];
    const newRow: UserSelection = {
        internalId: crypto.randomUUID(),
        prefKey: prefKey,
        categoryLabel: meta.label,
        skillId: null, // User needs to pick
        skillName: null,
        rankValue: "",
        askCandidate: true // Default to true for manually added rows
    };

    setSelections(prev => ({
        ...prev,
        [prefKey]: [...(prev[prefKey] || []), newRow]
    }));
  };

  const handleRemoveRow = (prefKey: string, internalId: string) => {
      setSelections(prev => ({
          ...prev,
          [prefKey]: prev[prefKey].filter(row => row.internalId !== internalId)
      }));
  };

  const handleUpdateRow = (prefKey: string, internalId: string, field: keyof UserSelection, value: any) => {
      setSelections(prev => { // prev is Record<string, UserSelection[]>
        const groupSelections = prev[prefKey] || [];
        const updatedGroup = groupSelections.map(row => {
            if (row.internalId !== internalId) return row;
            
            // If changing skill, we also need to update skillId and skillName
            if (field === 'skillId') {
                const selectedSkillId = value as number;
                // Find the skill name from availableGroups
                const item = availableGroups[prefKey]?.find(i => i.skill_id === selectedSkillId);
                return {
                    ...row,
                    skillId: selectedSkillId,
                    skillName: item?.skill_name || null,
                    rankValue: "" // Reset rank if skill changes, as options might strictly depend on skill (though generic usually)
                };
            }
            
            return { ...row, [field]: value };
        });

        return {
            ...prev,
            [prefKey]: updatedGroup
        };
      });
  };

  const handleSubmit = () => {
    // Flatten selections to PreferenceItem[]
    const result: PreferenceItem[] = [];

    Object.values(selections).forEach(groupRows => {
        groupRows.forEach(row => {
            // Only include if value is selected (or if it's a meaningful boolean toggle?)
            // Requirement says "preferencesSummary" is built from this.
            // We should filter out incomplete rows? 
            // For now, let's include them, maybe validation is needed.
            // Or just filter out ones with empty rankValue if rank is required.
            
            // Construct ID: Needs to be unique.
            // If skill present: `${prefKey}-${skillId}`
            // Else: `${prefKey}`
            
            const id = row.skillId 
                ? `${row.prefKey}-${row.skillId}` 
                : row.prefKey;

            const preferenceName = row.skillName
                ? `${row.categoryLabel} - ${row.skillName}`
                : row.categoryLabel;

            result.push({
                id: id,
                preference: preferenceName,
                value: row.rankValue,
                askCandidate: row.askCandidate,
                type: "text", // dummy
                skill_id: row.skillId
            });
        });
    });

    onSubmit(result);
  };

  if (fetching) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Candidate Preferences ({recruitmentType})
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify the skills and qualifications required for this role.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Object.keys(availableGroups).map((prefKey) => {
             const meta = groupMeta[prefKey];
             const groupItems = availableGroups[prefKey];
             const groupSelections = selections[prefKey] || [];
             const isMulti = meta.isMultiSkill;

             return (
                 <Paper key={prefKey} variant="outlined" sx={{ p: 2 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                         <Typography variant="subtitle1" fontWeight="bold">
                             {meta.label}
                         </Typography>
                         {isMulti && (
                            <Button 
                                startIcon={<AddIcon />} 
                                size="small" 
                                onClick={() => handleAddRow(prefKey)}
                                variant="text"
                            >
                                Add {meta.label}
                            </Button>
                         )}
                     </Box>

                    {/* If no selections (Multi with 0 rows), show default message */}
                    {isMulti && groupSelections.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No {meta.label.toLowerCase()} requirements added. Click 'Add' to specify.
                        </Typography>
                    )}

                    {/* Table / List of Selections */}
                    {(groupSelections.length > 0) && (
                         <TableContainer>
                         <Table size="small">
                             <TableHead>
                                 <TableRow>
                                     {isMulti && <TableCell width="40%">Skill</TableCell>}
                                     <TableCell width={isMulti ? "30%" : "50%"}>Proficiency / Level</TableCell>
                                     <TableCell width="20%">Ask Candidate?</TableCell>
                                     {isMulti && <TableCell width="10%"></TableCell>}
                                 </TableRow>
                             </TableHead>
                             <TableBody>
                                 {groupSelections.map((row) => {
                                     // Find the specific item config if skill selected
                                     const activeItem = isMulti 
                                        ? groupItems.find(i => i.skill_id === row.skillId)
                                        : groupItems[0];
                                     
                                     // Ranking options depend on the active item, or fallback to first item if skill not yet picked (but ideally we wait for skill)
                                     const rankingOptions = activeItem ? activeItem.ranking_options : [];

                                     return (
                                         <TableRow key={row.internalId}>
                                             {isMulti && (
                                                 <TableCell>
                                                     <Select
                                                         size="small"
                                                         fullWidth
                                                         displayEmpty
                                                         value={row.skillId || ""}
                                                         onChange={(e) => handleUpdateRow(prefKey, row.internalId, 'skillId', e.target.value)}
                                                     >
                                                         <MenuItem value="" disabled>Select Skill</MenuItem>
                                                         {groupItems.map(item => (
                                                             <MenuItem key={item.skill_id} value={item.skill_id as number}>
                                                                 {item.skill_name}
                                                             </MenuItem>
                                                         ))}
                                                     </Select>
                                                 </TableCell>
                                             )}
                                             
                                             <TableCell>
                                                 <Select
                                                     size="small"
                                                     fullWidth
                                                     displayEmpty
                                                     value={row.rankValue || ""}
                                                     onChange={(e) => handleUpdateRow(prefKey, row.internalId, 'rankValue', e.target.value)}
                                                     disabled={isMulti && !row.skillId}
                                                 >
                                                     <MenuItem value="" disabled>Select Level</MenuItem>
                                                     {rankingOptions?.map(opt => (
                                                         <MenuItem key={opt.rank} value={opt.label}>
                                                             {opt.label}
                                                         </MenuItem>
                                                     ))}
                                                 </Select>
                                             </TableCell>

                                             <TableCell>
                                                 <Switch
                                                     checked={row.askCandidate}
                                                     onChange={(e) => handleUpdateRow(prefKey, row.internalId, 'askCandidate', e.target.checked)}
                                                     size="small"
                                                 />
                                             </TableCell>
                                             
                                             {isMulti && (
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={() => handleRemoveRow(prefKey, row.internalId)} color="error">
                                                        <DeleteIcon fontSize="small"/>
                                                    </IconButton>
                                                </TableCell>
                                             )}
                                         </TableRow>
                                     );
                                 })}
                             </TableBody>
                         </Table>
                         </TableContainer>
                    )}
                 </Paper>
             );
        })}
      </Box>

      {/* Footer Buttons */}
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
          onClick={handleSubmit}
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
