"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPositions } from '@/store/features/positionsSlice';
import { RootState } from '@/store/store';

export default function CandidatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const positionsStatus = useAppSelector((state: RootState) => state.positions.status);

  useEffect(() => {
    if (positionsStatus === 'idle') {
      dispatch(fetchPositions());
    }
  }, [dispatch, positionsStatus]);

  return <>{children}</>;
}
