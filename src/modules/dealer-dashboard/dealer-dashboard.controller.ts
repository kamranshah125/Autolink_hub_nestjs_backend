import { Controller, Get, Param, Query } from '@nestjs/common';
import { DealerDashboardService } from './dealer-dashboard.service';

@Controller('dealer-dashboard')
export class DealerDashboardController {
  constructor(private readonly dealerDashboardService: DealerDashboardService) {}

  // Summary endpoint - userId as route param
  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string) {
    return this.dealerDashboardService.getSummary(Number(userId));
  }

  // Purchase history endpoint - userId as route param
  @Get('purchases/:userId')
  async getPurchases(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.dealerDashboardService.getPurchases(
      Number(userId),
      Number(page),
      Number(limit),
    );
  }
}
