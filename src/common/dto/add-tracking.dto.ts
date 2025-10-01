export class AddTrackingDto {
  status: 'assigned' | 'in_transit' | 'delivered';
  note?: string;
  assignedCompany?: string;   
  trackingNumber?: string;   
}
