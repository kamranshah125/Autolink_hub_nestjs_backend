import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseRequest } from '../purchase-requests/entities/purchase_request.entity';
import { Invoice } from '../subscriptions/entities/invoice.entity';
import { User } from '../users/entities/user.entity';
import { DealerProfile } from '../users/entities/dealer-profile.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly purchaseRepo: Repository<PurchaseRequest>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(DealerProfile)
    private readonly dealerProfileRepo: Repository<DealerProfile>,
  ) {}

  async getSummary() {
    // ✅ Dealer approvals count from DealerProfile
    const pendingDealerApprovals = await this.dealerProfileRepo.count({
      where: { status: 'pending' },
    });

    // ✅ Pending invoices (payments to verify)
    const pendingPayments = await this.invoiceRepo.count({
      where: { status: 'pending' },
    });

    // ✅ Total revenue (only approved invoices)
    const totalRevenue = await this.invoiceRepo
      .createQueryBuilder('invoice')
      .select('SUM(invoice.amount)', 'sum')
      .where('invoice.status = :status', { status: 'paid' })
      .getRawOne();

    // ✅ Total purchases (purchase requests count)
    const totalPurchases = await this.purchaseRepo.count();

    return {
      pendingDealerApprovals,
      pendingPayments,
      totalRevenue: Number(totalRevenue.sum) || 0,
      totalPurchases,
    };
  }

  async getPurchaseHistory(page = 1, limit = 20) {
    // const [data, total] = await this.purchaseRepo.findAndCount({
    //   relations: ['invoice', 'user'], // user bhi saath laa raha hun
    //   order: { createdAt: 'DESC' },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    const result = await this.purchaseRepo.findAndCount({
      relations: ['user', 'invoice'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const [data, total] = result;

    const transformed = data.map((pr) => ({
      id: pr.id,
      inventoryId: pr.inventoryId,
      status: pr.status,
      bidAmount: pr.bidAmount,
      notes: pr.notes,
      createdAt: pr.createdAt,

      user: {
        id: pr.user.id,
        name: pr.user.name,
        email: pr.user.email,
        // role: pr.user.role,
      },

      invoice: pr.invoice
        ? {
            id: pr.invoice.id,
            amount: pr.invoice.amount,
            status: pr.invoice.status,
            dueDate: pr.invoice.dueDate,
            paymentProofUrl: pr.invoice.paymentProofUrl,
          }
        : null,
    }));

    return {
      data: transformed,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}
