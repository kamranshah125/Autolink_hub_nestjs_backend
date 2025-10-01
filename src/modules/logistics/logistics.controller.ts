import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { CreateLogisticsDto } from '@/common/dto/create-logistics.dto';
import { AddTrackingDto } from '@/common/dto/add-tracking.dto';


@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post()
  async create(@Body() dto: CreateLogisticsDto) {
    return this.logisticsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.logisticsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.logisticsService.findOne(id);
  }

  @Post(':id/tracking')
  async addTracking(@Param('id') id: number, @Body() dto: AddTrackingDto) {
    return this.logisticsService.addTracking(id, dto);
  }
}
