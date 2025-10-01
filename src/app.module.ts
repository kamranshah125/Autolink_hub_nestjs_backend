import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './modules/app.controller';
import { AppService } from './modules/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/user.entity';
import { DealerProfile } from './modules/users/entities/dealer-profile.entity';
import { UsersModule } from './modules/users/users.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { DealersModule } from './modules/dealers/dealers.module';
import { PurchaseRequestsModule } from './modules/purchase-requests/purchase-requests.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
 
 @Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, DealerProfile]),
    AuthModule,
    UsersModule,
    SubscriptionsModule,
    DealersModule,
    PurchaseRequestsModule,
    LogisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
