import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealerDashboardController } from './dealer-dashboard.controller';
import { DealerDashboardService } from './dealer-dashboard.service';
import { PurchaseRequest } from '../purchase-requests/entities/purchase_request.entity';
import { Invoice } from '../subscriptions/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequest, Invoice])],
  controllers: [DealerDashboardController],
  providers: [DealerDashboardService],
})
export class DealerDashboardModule {}
