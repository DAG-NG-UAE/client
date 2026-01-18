export interface TableColumn<T> {
  key: keyof T | string; // Can be a key of T or a custom string
  label: string;
  render?: (row: T) => React.ReactNode; // Custom rendering function
  sortable?: boolean;
  className?: string; // Custom column styling
}

// Table props - using generics so it works with any data type
export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => any;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
