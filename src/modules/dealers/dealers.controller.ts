import {
  Controller,
  Get,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DealersService } from './dealers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  // ✅ Admin-only: Get all pending dealers
  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get()
async getDealers(@Query('status') status?: string) {
  return this.dealersService.findByStatus(status);
}

  // ✅ Dealer uploads KYC document (stored locally for now)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('dealer')
  @Post(':id/kyc')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/kyc', // local storage folder
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadKyc(
    @Param('id') dealerId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.dealersService.saveKycDocument(dealerId, file.path);
  }
}
