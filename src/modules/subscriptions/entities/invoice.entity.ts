import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subscription } from './subscription.entity';
import { PurchaseRequest } from '@/modules/purchase-requests/entities/purchase_request.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Subscription, { nullable: true })
  subscription: Subscription;

  @ManyToOne(() => PurchaseRequest, (pr) => pr.invoice, { nullable: true })
  purchaseRequest: PurchaseRequest;

  @Column('decimal')
  amount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'rejected';

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ nullable: true })
  paymentProofUrl: string;
}
