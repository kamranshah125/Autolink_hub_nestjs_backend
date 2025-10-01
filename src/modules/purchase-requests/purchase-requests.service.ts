import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from '@/modules/subscriptions/entities/invoice.entity';
import { PurchaseRequest } from './entities/purchase_request.entity';
import { CreatePurchaseRequestDto } from '@/common/dto/create-purchase-request.dto';
import { UpdatePurchaseRequestDto } from '@/common/dto/update-purchase-request.dto';

@Injectable()
export class PurchaseRequestsService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly purchaseRepo: Repository<PurchaseRequest>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  // Dealer creates a purchase request
  // async create(dto: CreatePurchaseRequestDto) {
  //   // 1) create request
  //   const request = this.purchaseRepo.create({
  //     userId: dto.userId,
  //     inventoryId: dto.inventoryId,
  //     bidAmount: dto.bidAmount,
  //     notes: dto.notes,
  //     status: 'pending',
  //   });
  //   const savedRequest = await this.purchaseRepo.save(request);

  //   // 2) create invoice linked to purchase request
  //   const invoice = this.invoiceRepo.create({
  //     userId: dto.userId,
  //     purchaseRequest: savedRequest,
  //     amount: dto.bidAmount, // 👈 ya plan.perCarFee + bidAmount, adjust later
  //     status: 'pending',
  //     dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 din ka due date
  //   });
  //   const savedInvoice = await this.invoiceRepo.save(invoice);

  //   return { purchaseRequest: savedRequest, invoice: savedInvoice };
  // }

  async create(dto: CreatePurchaseRequestDto) {
    const request = this.purchaseRepo.create({
      userId: dto.userId,
      inventoryId: dto.inventoryId,
      bidAmount: dto.bidAmount,
      notes: dto.notes,
      status: 'pending',
    });
    const savedRequest = await this.purchaseRepo.save(request);

    const invoice = this.invoiceRepo.create({
      userId: dto.userId,
      purchaseRequest: savedRequest,
      amount: dto.bidAmount,
      status: 'pending',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    });
    const savedInvoice = await this.invoiceRepo.save(invoice);

    // ❌ yahan infinite loop ho raha tha
    // return { purchaseRequest: savedRequest, invoice: savedInvoice };

    // ✅ invoice ke andar purchaseRequest hata do
    const { purchaseRequest, ...invoiceWithoutPR } = savedInvoice;

    return {
      purchaseRequest: savedRequest,
      invoice: invoiceWithoutPR,
    };
  }
  async findAll() {
    return this.purchaseRepo.find({ relations: ['invoice'] });
  }

  async findByUser(userId: number) {
    return this.purchaseRepo.find({
      where: { userId },
      relations: ['invoice'],
    });
  }

  async findOne(id: number) {
    const req = await this.purchaseRepo.findOne({
      where: { id },
      relations: ['invoice'],
    });
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

  // 👇 helper: update status when invoice paid
  async markAsApprovedFromInvoice(purchaseRequestId: number) {
    const req = await this.findOne(purchaseRequestId);
    req.status = 'approved';
    return this.purchaseRepo.save(req);
  }
  async verifyInvoice(invoiceId: number, status: 'paid' | 'rejected') {
    const invoice = await this.invoiceRepo.findOne({
      where: { id: invoiceId },
      relations: ['purchaseRequest'],
    });
    if (!invoice || !invoice.purchaseRequest) {
      throw new NotFoundException('Invoice not found or not linked to a purchase request');
    }

    invoice.status = status;
    await this.invoiceRepo.save(invoice);

    if (status === 'paid') {
      invoice.purchaseRequest.status = 'approved';
      await this.purchaseRepo.save(invoice.purchaseRequest);
    }

    return await this.invoiceRepo.findOne({
      where: { id: invoice.id },
      
    });
  }
}
