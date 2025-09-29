import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  userId: number; // development phase: manually pass karna

  @IsInt()
  @IsNotEmpty()
  planId: number; // subscription plan id
}
