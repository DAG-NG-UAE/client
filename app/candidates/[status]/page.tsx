"use client";

import { useParams } from 'next/navigation';
import CandidateStatusPage from '@/components/candidates/CandidateStatusPage';
import { getPosition } from '@/api/requisitionApi';
import { useEffect, useState } from 'react';
import { AvailablePositions } from '@/interface/requisition';

export default function Page() {
  const { status } = useParams();
  const [positions, setPositions] = useState<AvailablePositions[]>([])
  
  const fetchPosition = async() => { 
    try{ 
      const result = await getPosition()
      console.log(`we have the position ${JSON.stringify(result)}`)
      setPositions(result)
    }catch(error){ 
      console.log("An error occurred while getting the position ")
    }
  }

  const allRoles = [
    { text: 'All Roles', value: 'all' },
    ...positions
      .map((position) => ({
        text: position.position,
        value: position.requisition_id,
      }))
     
  ];

  useEffect(() => { 
    fetchPosition()
  }, [])
  // status can be a string or an array of strings, we only want the string.
  const statusString = Array.isArray(status) ? status[0] : status;

  if(statusString == undefined){ 
    console.log('you are undefined which is weird')
  }
  return <CandidateStatusPage status={statusString!} allRoles={allRoles} />;
}