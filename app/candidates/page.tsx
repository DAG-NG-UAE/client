"use client"
import { redirect } from "next/navigation";


// TODO decide if you want to send them to the applied page immediately they land on the page redirect('/candidates/applied');

const CandidatesPage = () => { 
  redirect('/candidates/all')
 
}

export default CandidatesPage