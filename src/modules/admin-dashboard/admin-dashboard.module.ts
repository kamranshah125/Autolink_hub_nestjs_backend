import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { PurchaseRequest } from '../purchase-requests/entities/purchase_request.entity';
import { Invoice } from '../subscriptions/entities/invoice.entity';
import { User } from '../users/entities/user.entity';
import { DealerProfile } from '../users/entities/dealer-profile.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequest, Invoice, User, DealerProfile])],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule {}
