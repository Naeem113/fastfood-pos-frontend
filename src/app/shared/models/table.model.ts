import { TableStatus } from "../enums/tableStatus";

export type ViewMode = 'grid' | 'list';
export type FilterMode = 'all' | TableStatus;

export interface RestaurantTable {
  id: string;
  status: TableStatus;
  section: string;
  seats: number;
  guest: string | null;
  time: string | null;
  duration: string | null;
}
