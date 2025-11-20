import * as XLSX from 'xlsx';

export interface SheetData {
  name: string;
  data: any[][];
}

export const readHistoricalExcelFile = (file: File): Promise<SheetData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetData: SheetData[] = [];

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          sheetData.push({ name: sheetName, data: jsonSheet });
        });

        resolve(sheetData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};
