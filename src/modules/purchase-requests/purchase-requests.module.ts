import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequestsService } from './purchase-requests.service';
import { PurchaseRequestsController } from './purchase-requests.controller';
import { PurchaseRequest } from './entities/purchase_request.entity';
import { Invoice } from '../subscriptions/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequest,Invoice])],
  providers: [PurchaseRequestsService],
  controllers: [PurchaseRequestsController],
})
export class PurchaseRequestsModule {}
