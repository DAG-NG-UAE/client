"use client";

import { useParams } from 'next/navigation';
import CandidateStatusPage from '@/components/candidates/CandidateStatusPage';

export default function Page() {
  const { status } = useParams();

  // status can be a string or an array of strings, we only want the string.
  const statusString = Array.isArray(status) ? status[0] : status;

  if (!statusString) {
    // Return a loading state or null while the router is warming up
    return null; 
  }

  return <CandidateStatusPage status={statusString} />;
}