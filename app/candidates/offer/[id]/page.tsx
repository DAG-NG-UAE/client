"use client";

import React from 'react';
import OfferGenerator from '@/components/offers/OfferGenerator';
import { useParams, useSearchParams } from 'next/navigation';

export default function OfferPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const offerId = searchParams.get('offerId');

  return (
    <OfferGenerator 
        candidateId={params.id as string} 
        existingOfferId={offerId || undefined} 
    />
  );
}
