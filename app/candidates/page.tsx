"use client"
import { getCandidateCardStat } from "@/api/analytics";
import { getAllCandidates } from "@/api/candidate";
import { getPosition } from "@/api/requisitionApi";
import CandidateTable from "@/components/candidates/CandidateTable";
import Filters from "@/components/Filters";
import RequisitionFilters from "@/components/Filters";
import SummaryStats from "@/components/SummaryStats";
import { CandidateCardStat } from "@/interface/analytics";
import { CandidateProfile } from "@/interface/candidate";
import { AvailablePositions } from "@/interface/requisition";
import { Box, Container, Stack, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

// TODO decide if you want to send them to the applied page immediately they land on the page redirect('/candidates/applied');

const CandidatesPage = () => { 
  redirect('/candidates/all')
  // const [candidates, setCandidates] = useState<Partial<CandidateProfile>[]>([]);
  // const [positions, setPositions] = useState<AvailablePositions[]>([])
  // const [candidateStat, setCandidateStat] = useState<Partial<CandidateCardStat>>({})
  // const [selectedRequisitionId, setSelectedRequisitionId] = useState<string>('all');
  // const [selectedYear, setSelectedYear] = useState<string>('all');

  // const allYears = [
  //   { text: 'All years', value: 'all'}, 
  //   { text: '2025', value: '2025'}
  // ]

  // const candidateCardStat = async(requisitionId: string = 'all', year: string = 'all') => { 
  //   try{ 
  //     const result = await getCandidateCardStat(requisitionId, year)
  //     setCandidateStat(result)
  //   }catch(error){ 
  //     console.log('An error occurred while fetching the candidate card stat')
  //   }
  // }

  // const filterCandidatesByRole = async(requisitionId: string) => { 
  //   // get the requisitionId that was passed
  //   console.log(`we want to filter by requisition => ${requisitionId}`)
  //   setSelectedRequisitionId(requisitionId);
  //   await fetchAllCandidates(requisitionId)
  //   await candidateCardStat(requisitionId, selectedYear)
  // }

  // const handleYearChange = async(year: string) => {
  //   setSelectedYear(year);
  //   await candidateCardStat(selectedRequisitionId, year);
  // }

  // const fetchAllCandidates = async(requisitionId?: string) => { 
  //   try{ 
  //     console.log('in the fetch all candidates')
  //     const result = await getAllCandidates(requisitionId)
  //     setCandidates(result.mainResult)
  //   }catch(error){ 
  //     console.log('An error occurred')
  //   }
  // }

  // const fetchPosition = async() => { 
  //   try{ 
  //     const result = await getPosition()
  //     console.log(`we have the position ${JSON.stringify(result)}`)
  //     setPositions(result)
  //   }catch(error){ 
  //     console.log("An error occurred while getting the position ")
  //   }
  // }

  // useEffect(() => { 
  //   candidateCardStat()
  //   fetchPosition()
  //   fetchAllCandidates()
  // }, [])

  // const allRoles = [
  //   { text: 'All Roles', value: 'all' },
  //   ...positions
  //     .map((position) => ({
  //       text: position.position,
  //       value: position.requisition_id,
  //     }))
     
  // ];
  // console.log(`we have the position ${JSON.stringify(allRoles)}`)

  // // get the position from the candidates
 
  //   return (
  //   <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
  //     <Container maxWidth="xl">
  //       {/* Header */}
  //       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
  //         <Box>
  //           <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
  //             Candidate Management
  //           </Typography>
  //           <Typography variant="body1" color="text.secondary">
  //             Manage and track all candidate applications
  //           </Typography>
  //         </Box>
  //       </Stack>

  //       {/* Summary Stats */}
  //       <SummaryStats stats={[
  //           { title: 'Total Candidates', value: candidateStat.total_candidates || '0' },
  //           { title: 'Applied', value: candidateStat.count_applied || '0' },
  //           { title: 'Screening', value: candidateStat.count_screening || '0' },
  //           { title: 'Interview', value: candidateStat.count_interview || '0' },
  //           { title: 'Offer Stage', value: candidateStat.count_offer || '0' },
  //           { title: 'Hired', value: candidateStat.count_hired || '0' },
  //           { title: 'Rejected', value: candidateStat.count_rejected || '0' }
  //         ]} />

  //       {/* Filters */}
  //       <Filters 
  //         menuItems={allRoles} 
  //         textPlaceholder="Search candidate..." 
  //         isCandidate={true} 
  //         // allDepartments={allDepartments}
  //         allYears={allYears}
  //         filterFunction={filterCandidatesByRole}
  //         onYearChange={handleYearChange}
  //       />

  //       {/* Table */}
  //       <CandidateTable candidates={candidates} />
        
  //     </Container>
  //   </Box>
  // );
}

export default CandidatesPage