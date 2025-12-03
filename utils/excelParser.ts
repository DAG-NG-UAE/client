import * as XLSX from 'xlsx';

interface ExtractedData {
  labels: string[];
  values: string[];
}

export const readExcelFile = (file: File): Promise<ExtractedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const labels: string[] = [];
        const values: string[] = [];

        // Read Column B (Labels) from Row 2 to 23
        for (let i = 2; i <= 23; i++) {
          const cellAddress = XLSX.utils.encode_cell({ r: i - 1, c: 1 }); // Column B is index 1
          const cell = worksheet[cellAddress];
          labels.push(cell ? String(cell.v) : '');
        }

        // Read Column C (Values) from Row 2 to 23
        for (let i = 2; i <= 23; i++) {
          const cellAddress = XLSX.utils.encode_cell({ r: i - 1, c: 2 }); // Column C is index 2
          const cell = worksheet[cellAddress];
          values.push(cell ? String(cell.v) : '');
        }

        resolve({ labels, values });
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

export interface SheetData {
  name: string;
  data: any[][];
  totalRows: number;
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
          const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' }) as any[][];
          sheetData.push({ name: sheetName, data: jsonSheet, totalRows: jsonSheet.length });
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
