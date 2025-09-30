import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequestsService } from './purchase-requests.service';
import { PurchaseRequestsController } from './purchase-requests.controller';
import { PurchaseRequest } from './entities/purchase_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequest])],
  providers: [PurchaseRequestsService],
  controllers: [PurchaseRequestsController],
})
export class PurchaseRequestsModule {}
