"use client";

import OfferRevisionDetails from '@/components/offers/OfferRevisionDetails';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();

  // id can be a string or an array of strings, we only want the string.
  const idString = Array.isArray(id) ? id[0] : id;

  if (!idString) {
    // Return a loading state or null while the router is warming up
    return null; 
  }

  return <OfferRevisionDetails id={idString} />;
}
