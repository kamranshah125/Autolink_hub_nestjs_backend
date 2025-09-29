import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealerProfile } from '../users/entities/dealer-profile.entity';

@Injectable()
export class DealersService {
  constructor(
    @InjectRepository(DealerProfile)
    private dealerRepo: Repository<DealerProfile>,
  ) {}

  async findPending() {
    return this.dealerRepo.find({
      where: { status: 'pending' },
      relations: ['user'], // fetch related user info
    });
  }
}
