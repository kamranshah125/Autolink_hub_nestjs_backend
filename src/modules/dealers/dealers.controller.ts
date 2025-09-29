import { Controller, Get, UseGuards } from '@nestjs/common';
import { DealersService } from './dealers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('pending')
  async getPendingDealers() {
    return this.dealersService.findPending();
  }
}
