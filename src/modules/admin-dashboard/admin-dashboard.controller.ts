import { Controller, Get, Query } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';

@Controller('admin/dashboard')
export class AdminDashboardController {
  
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('summary')
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('purchase-history')
  async getPurchaseHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.dashboardService.getPurchaseHistory(Number(page), Number(limit));
  }
}
