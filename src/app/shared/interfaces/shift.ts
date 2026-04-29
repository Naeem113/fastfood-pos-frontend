export interface ShiftDTO {
  _id: string;
  userId: string;
  user: {
    name: string;
  };
  shiftName?: string;
  openingTime: Date;
  closingTime?: Date;

  totalSales: number;
  ordersCount: number;

  openingCash: number;
  closingCash?: number;

  status: 'OPEN' | 'CLOSED';

  paymentSummary: {
    cash: number;
    card: number;
    online: number;
  };
}
