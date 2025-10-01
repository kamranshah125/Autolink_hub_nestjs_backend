import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logistics } from './entities/logistics.entity.ts';
import { PurchaseRequest } from '../purchase-requests/entities/purchase_request.entity';
import { LogisticsTracking } from './entities/logistics-tracking.entity';
import { AddTrackingDto } from '@/common/dto/add-tracking.dto';
import { CreateLogisticsDto } from '@/common/dto/create-logistics.dto';
 

@Injectable()
export class LogisticsService {
  constructor(
    @InjectRepository(Logistics)
    private readonly logisticsRepo: Repository<Logistics>,
    @InjectRepository(PurchaseRequest)
    private readonly purchaseRepo: Repository<PurchaseRequest>,
    @InjectRepository(LogisticsTracking)
    private readonly trackingRepo: Repository<LogisticsTracking>,
  ) {}

  async create(dto: CreateLogisticsDto) {
    const purchaseRequest = await this.purchaseRepo.findOne({ where: { id: dto.purchaseRequestId } });
    if (!purchaseRequest) throw new NotFoundException('Purchase request not found');

    const logistics = this.logisticsRepo.create({
      userId: dto.userId,
      purchaseRequest,
      currentStatus: 'pending',
    });

    const savedLogistics = await this.logisticsRepo.save(logistics);

    const initialTrack = this.trackingRepo.create({
      logistics: savedLogistics,
      status: 'pending',
      note: dto.notes || 'Logistics request created',
    });
    await this.trackingRepo.save(initialTrack);

    return this.findOne(savedLogistics.id);
  }

  async findAll() {
    return this.logisticsRepo.find({ relations: ['trackingHistory'] });
  }

  async findOne(id: number) {
    return this.logisticsRepo.findOne({ where: { id }, relations: ['trackingHistory'] });
  }

//   async addTracking(id: number, dto: AddTrackingDto) {
//     const logistics = await this.findOne(id);
//     if (!logistics) throw new NotFoundException('Logistics not found');

//     logistics.currentStatus = dto.status;
//     await this.logisticsRepo.save(logistics);

//     const track = this.trackingRepo.create({
//       logistics,
//       status: dto.status,
//       note: dto.note,
//     });
//     await this.trackingRepo.save(track);

//     return this.findOne(id);
//   }

async addTracking(id: number, dto: AddTrackingDto) {
  const logistics = await this.findOne(id);
  if (!logistics) throw new NotFoundException('Logistics not found');

  // update main logistics record
  logistics.currentStatus = dto.status;

  if (dto.assignedCompany) logistics.assignedCompany = dto.assignedCompany;
  if (dto.trackingNumber) logistics.trackingNumber = dto.trackingNumber;

  await this.logisticsRepo.save(logistics);

  // add tracking history
  const track = this.trackingRepo.create({
    logistics,
    status: dto.status,
    note: dto.note,
  });
  await this.trackingRepo.save(track);

  return this.findOne(id);
}

}
