import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PurchaseRequestsService } from './purchase-requests.service';
import { CreatePurchaseRequestDto } from '@/common/dto/create-purchase-request.dto';
import { UpdatePurchaseRequestDto } from '@/common/dto/update-purchase-request.dto';

@Controller('purchase-requests')
export class PurchaseRequestsController {
  constructor(private readonly service: PurchaseRequestsService) {}

  // Dealer creates request
  @Post()
  create(@Body() dto: CreatePurchaseRequestDto) {
    return this.service.create(dto);
  }

  // Admin: see all purchase requests
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Dealer: see own requests
  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.service.findByUser(Number(userId));
  }

  // Get specific request
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  // Update request (dealer can update bid/notes, admin can update status)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePurchaseRequestDto) {
    return this.service.update(Number(id), dto);
  }

  // Delete request (optional)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
