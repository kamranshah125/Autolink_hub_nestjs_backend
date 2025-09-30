import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { DealerProfile } from '../users/entities/dealer-profile.entity';

@Injectable()
export class DealersService {
  constructor(
    @InjectRepository(DealerProfile)
    private dealerRepo: Repository<DealerProfile>,
  ) {}

  // ✅ Get dealers with at least one document uploaded
  async getDealersWithKycDocs() {
    return this.dealerRepo.find({
      where: { documents: Not(IsNull()) },
      relations: ['user'],
    });
  }

  // ✅ Get all docs for a specific dealer
  async getKycDocsByDealer(id: number) {
    const dealer = await this.dealerRepo.findOne({ where: { id } });
    if (!dealer || !dealer.documents || dealer.documents.length === 0) {
      throw new NotFoundException('KYC documents not found for this dealer');
    }
    return dealer.documents;
  }

  // ✅ Status filter
  async findByStatus(status?: string) {
    if (!status || status === 'all') {
      return this.dealerRepo.find({
        relations: ['user'],
      });
    }

    return this.dealerRepo.find({
      where: { status: status as 'pending' | 'approved' | 'rejected' },
      relations: ['user'],
    });
  }

  // ✅ Save / append KYC document
  async saveKycDocument(dealerId: number, filePath: string, documentType: string) {
    const dealer = await this.dealerRepo.findOne({
      where: { user: { id: dealerId } },
      relations: ['user'],
    });

    if (!dealer) {
      throw new NotFoundException(`Dealer with ID ${dealerId} not found`);
    }

    if (!documentType) {
      throw new BadRequestException('documentType is required');
    }

    // Initialize if null
    if (!dealer.documents) {
      dealer.documents = [];
    }

    // Push new doc
    dealer.documents.push({
      type: documentType,
      path: filePath.replace(/\\/g, '/'),
    });

    return this.dealerRepo.save(dealer);
  }

  // ✅ Admin approve dealer
  async approveDealer(id: number) {
    const dealer = await this.dealerRepo.findOne({ where: { id } });
    if (!dealer) throw new NotFoundException('Dealer not found');

    dealer.status = 'approved';
    return this.dealerRepo.save(dealer);
  }

  // ✅ Admin reject dealer
  async rejectDealer(id: number, reason: string) {
    const dealer = await this.dealerRepo.findOne({ where: { id } });
    if (!dealer) throw new NotFoundException('Dealer not found');

    dealer.status = 'rejected';
    dealer.rejectionReason = reason;
    return this.dealerRepo.save(dealer);
  }
}
