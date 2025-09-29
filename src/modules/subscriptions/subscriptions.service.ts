import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plans.entity';
import { Subscription } from './entities/subscription.entity';
import { Invoice } from './entities/invoice.entity';
import { CreateSubscriptionDto } from '@/common/dto/create-subscription.dto';
 
@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly plansRepo: Repository<SubscriptionPlan>,

    @InjectRepository(Subscription)
    private readonly subsRepo: Repository<Subscription>,

    @InjectRepository(Invoice)
    private readonly invoicesRepo: Repository<Invoice>,
  ) {}

  // ===============================
  // 📌 Dealer Side
  // ===============================

  // GET all available plans
  async getPlans() {
    return this.plansRepo.find();
  }

  // Dealer chooses a plan
  async createSubscription(dto: CreateSubscriptionDto) {
    const plan = await this.plansRepo.findOne({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = this.subsRepo.create({
      plan,
      userId: dto.userId,
      startDate,
      endDate,
      status: 'pending',
    });
    const savedSub = await this.subsRepo.save(subscription);

    // Create invoice
    const invoice = this.invoicesRepo.create({
      userId: dto.userId,
      subscription: savedSub,
      amount: plan.monthlyFee,
      status: 'pending',
      dueDate: endDate,
    });
    await this.invoicesRepo.save(invoice);

    return { subscription: savedSub, invoice };
  }

  // Dealer uploads bank transfer slip
  async uploadPaymentSlip(invoiceId: number, file: Express.Multer.File) {
    const invoice = await this.invoicesRepo.findOne({
      where: { id: invoiceId },
      relations: ['subscription'],
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    // ⚠️ dev: abhi ke liye file ka naam save kar raha hu
    invoice.paymentProofUrl = file?.filename || 'dummy-slip.png';
    invoice.status = 'pending';
    return this.invoicesRepo.save(invoice);
  }

  // Dealer apni subscriptions list kare
  async getDealerSubscriptions(userId: number) {
    return this.subsRepo.find({
      where: { userId },
      relations: ['plan'],
      order: { startDate: 'DESC' },
    });
  }

  // ===============================
  // 📌 Admin Side
  // ===============================

  // Admin: get all pending invoices
  async getPendingInvoices() {
    return this.invoicesRepo.find({
      where: { status: 'pending' },
      relations: ['subscription', 'subscription.plan'],
    });
  }

  // Admin: verify invoice
  async verifyInvoice(invoiceId: number, status: 'paid' | 'rejected') {
    const invoice = await this.invoicesRepo.findOne({
      where: { id: invoiceId },
      relations: ['subscription'],
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    invoice.status = status;
    await this.invoicesRepo.save(invoice);

    // agar invoice paid hai to subscription active kar do
    if (status === 'paid' && invoice.subscription) {
      invoice.subscription.status = 'active';
      await this.subsRepo.save(invoice.subscription);
    }

    return invoice;
  }
}
