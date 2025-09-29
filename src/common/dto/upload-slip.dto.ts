import { IsNotEmpty, IsString } from 'class-validator';

export class UploadSlipDto {
  @IsString()
  @IsNotEmpty()
  fileUrl: string; // abhi ke liye file ka dummy URL store karenge
}