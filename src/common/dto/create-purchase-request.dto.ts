import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePurchaseRequestDto {
  @IsInt()
  @IsNotEmpty()
  userId: number; // dealer userId

  @IsString()
  @IsNotEmpty()
  inventoryId: string; // dummy abhi

  @IsNumber()
  @IsNotEmpty()
  bidAmount: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
