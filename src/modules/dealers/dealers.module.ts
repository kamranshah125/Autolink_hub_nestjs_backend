import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealersService } from './dealers.service';
import { DealersController } from './dealers.controller';
import { DealerProfile } from '../users/entities/dealer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DealerProfile])],
  providers: [DealersService],
  controllers: [DealersController],
  exports: [DealersService],
})
export class DealersModule {}
