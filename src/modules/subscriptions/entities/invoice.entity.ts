import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { PurchaseRequest } from '@/modules/purchase-requests/entities/purchase_request.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.invoices, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

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
