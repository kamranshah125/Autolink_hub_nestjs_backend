export class DealerPurchaseHistoryItemDto {
  id: number;
  inventoryId: string;
  status: string;
  bidAmount: number;
  createdAt: Date;
  invoice: {
    id: number;
    amount: number;
    status: string;
  } | null;
}

export class DealerPurchaseHistoryResponseDto {
  data: DealerPurchaseHistoryItemDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}