import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { Logistics } from './entities/logistics.entity.ts';
import { LogisticsTracking } from './entities/logistics-tracking.entity';
import { PurchaseRequest } from '../purchase-requests/entities/purchase_request.entity';
 

@Module({
  imports: [TypeOrmModule.forFeature([Logistics, LogisticsTracking,PurchaseRequest ])],
  controllers: [LogisticsController],
  providers: [LogisticsService],
  exports: [LogisticsService],
})
export class LogisticsModule {}
