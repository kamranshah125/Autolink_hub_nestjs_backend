// dealer-dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PurchaseRequest } from '../purchase-requests/entities/purchase_request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Invoice } from '../subscriptions/entities/invoice.entity';
import { DealerSummaryDto } from '@/common/dto/dealer-summary.dto';
import { DealerPurchaseHistoryResponseDto } from '@/common/dto/dealer-purchase-history.dto';


@Injectable()
export class DealerDashboardService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  async getSummary(userId: number): Promise<DealerSummaryDto> {
    const pendingRequests = await this.prRepo.count({
      where: { userId, status: 'pending' },
    });

    const approvedInTransit = await this.prRepo.count({
      where: { userId, status: In(['approved', 'in_transit']) },
    });

    const pendingPayments = await this.invoiceRepo.count({
      where: { userId, status: 'pending' },
    });

    const totalSpentResult = await this.invoiceRepo
      .createQueryBuilder('invoice')
      .select('SUM(invoice.amount)', 'sum')
      .where('invoice.userId = :userId', { userId })
      .andWhere('invoice.status = :status', { status: 'paid' })
      .getRawOne();
    const totalSpent = Number(totalSpentResult?.sum) || 0;

    return {
      pendingRequests,
      approvedInTransit,
      pendingPayments,
      totalSpent,
    };
  }

  async getPurchases(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<DealerPurchaseHistoryResponseDto> {
    const [data, total] = await this.prRepo.findAndCount({
      where: { userId },
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const transformed = data.map((pr) => ({
      id: pr.id,
      inventoryId: pr.inventoryId,
      status: pr.status,
      bidAmount: pr.bidAmount,
      createdAt: pr.createdAt,
      invoice: pr.invoice
        ? {
            id: pr.invoice.id,
            amount: pr.invoice.amount,
            status: pr.invoice.status,
          }
        : null,
    }));

    return { data: transformed, meta: { page, limit, total } };
  }
}
