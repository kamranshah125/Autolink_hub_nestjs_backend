import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from './entities/subscription-plans.entity';
import { Invoice } from './entities/invoice.entity';
import { Subscription } from './entities/subscription.entity';
import { PurchaseRequest } from '../purchase-requests/entities/purchase_request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionPlan, Subscription, Invoice,PurchaseRequest]),  
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService]
})
export class SubscriptionsModule {}
