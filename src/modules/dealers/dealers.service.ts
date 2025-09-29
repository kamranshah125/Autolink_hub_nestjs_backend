import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealerProfile } from '../users/entities/dealer-profile.entity';

@Injectable()
export class DealersService {
  constructor(
    @InjectRepository(DealerProfile)
    private dealerRepo: Repository<DealerProfile>,
  ) {}

  async findByStatus(status?: string) {
  if (!status || status === 'all') {
    // Return ALL dealers regardless of status
    return this.dealerRepo.find({
      relations: ['user'],
    });
  }

  // Return filtered by status
  return this.dealerRepo.find({
    where: { status: status as 'pending' | 'approved' | 'rejected' },
    relations: ['user'],
  });
}
async saveKycDocument(dealerId: number, filePath: string) {
    // 👇 Ensure dealer exists
    const dealer = await this.dealerRepo.findOne({
      where: { user: { id: dealerId } },
      relations: ['user'],
    });

    if (!dealer) {
      throw new NotFoundException(`Dealer with ID ${dealerId} not found`);
    }

    dealer.kycDocumentPath = filePath;
    return this.dealerRepo.save(dealer);
  }

}
