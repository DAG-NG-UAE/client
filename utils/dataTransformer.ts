interface ExtractedData {
  labels: string[];
  values: string[];
}

interface TransformedRecord {
  [key: string]: string;
}

export const transformData = (allExtractedData: ExtractedData[]): TransformedRecord[] => {
  const transformedRecords: TransformedRecord[] = [];

  allExtractedData.forEach(extractedData => {
    const record: TransformedRecord = {};
    extractedData.labels.forEach((label, index) => {
      if (label) {
        record[label] = extractedData.values[index] || '';
      }
    });
    transformedRecords.push(record);
  });

  return transformedRecords;
};
