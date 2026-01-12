"use client";

import React from 'react';
import OfferGenerator from '@/components/offers/OfferGenerator';
import { useParams } from 'next/navigation';

export default function OfferRevisionPage() {
  const params = useParams();
  const offerId = params.id as string;

  return (
    <OfferGenerator 
        existingOfferId={offerId} 
    />
  );
}
