import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';

export class UpdatePurchaseRequestDto {
  @IsOptional()
  @IsNumber()
  bidAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected', 'purchased', 'in_transit', 'delivered'])
  status?: string;
}
