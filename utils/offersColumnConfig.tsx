import React from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { getStatusChipProps } from "./statusColorMapping";
import { TableColumn } from "@/interface/table";
import { Offer } from "@/interface/offer";


const renderStatus = (offer: Partial<Offer>) => {
  return offer.status ? (
    <Chip 
        {...getStatusChipProps(offer.status)} 
        size="small" 
        sx={{ borderRadius: '6px', fontWeight: 500, ...(getStatusChipProps(offer.status).sx || {}) }}
    />
  ) : (
    "---"
  );
};

// Main configuration object
export const columnConfig: {
  [key: string]: TableColumn<Partial<Offer>>[];
} = {
  all: [
   { key: "candidate_name", label: "Candidate Name"},
    { key: "position", label: "Position" },
    { key: "status", label: "Status", render: renderStatus },
  ],
  pending: [
    { key: "candidate_name", label: "Candidate Name"},
    { key: "position", label: "Position" },
    { key: "status", label: "Status", render: renderStatus },
  ],
};

export const getColumnsForOfferStatus = (
  status: string | undefined
): TableColumn<Partial<Offer>>[] => {
  if (!status) return columnConfig.pending;
  return columnConfig[status] || columnConfig.pending;
};
