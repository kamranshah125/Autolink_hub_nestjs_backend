import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseRequest } from './entities/purchase_request.entity';
import { CreatePurchaseRequestDto } from '@/common/dto/create-purchase-request.dto';
import { UpdatePurchaseRequestDto } from '@/common/dto/update-purchase-request.dto';

@Injectable()
export class PurchaseRequestsService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly purchaseRepo: Repository<PurchaseRequest>,
  ) {}

  async create(dto: CreatePurchaseRequestDto) {
    const request = this.purchaseRepo.create(dto);
    return this.purchaseRepo.save(request);
  }

  async findAll() {
    return this.purchaseRepo.find();
  }

  async findByUser(userId: number) {
    return this.purchaseRepo.find({ where: { userId } });
  }

  async findOne(id: number) {
    const req = await this.purchaseRepo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Purchase request not found');
    return req;
  }

  async update(id: number, dto: UpdatePurchaseRequestDto) {
    const req = await this.findOne(id);
    Object.assign(req, dto);
    return this.purchaseRepo.save(req);
  }

  async remove(id: number) {
    const req = await this.findOne(id);
    return this.purchaseRepo.remove(req);
  }
}
