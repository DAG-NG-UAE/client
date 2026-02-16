"use client";

import { fetchPositions } from '@/redux/slices/positions';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';


export default function CandidatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {positions, loading} = useSelector((state: RootState) => state.positions)

  useEffect(() => {
    if (loading) {
      fetchPositions()
    }
  }, [loading]);

  return <>{children}</>;
}
