// dealers.controller.ts
import {
  Controller, Get, Post, UseGuards, UploadedFile, UseInterceptors, Param, Query, Res, Body,
} from '@nestjs/common';
import { DealersService } from './dealers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  // ✅ Admin: Get all dealers with docs
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('kyc-documents')
  async getAllKycDocs() {
    return this.dealersService.getDealersWithKycDocs();
  }

  // ✅ Admin: Get ALL docs for specific dealer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id/kyc-documents')
  async getKycDocs(@Param('id') id: number) {
    return this.dealersService.getKycDocsByDealer(id);
  }

  // ✅ Dealer uploads a document (must provide documentType in body)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('dealer')
  @Post(':id/kyc')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/kyc',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadKyc(
    @Param('id') dealerId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string, // ✅ new field
  ) {
    return this.dealersService.saveKycDocument(
      dealerId,
      file.path,
      documentType,
    );
  }
}
