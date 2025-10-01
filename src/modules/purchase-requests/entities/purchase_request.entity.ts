import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { User } from '@/modules/users/user.entity'; // assuming tumhare paas user module hai 
import { Invoice } from '@/modules/subscriptions/entities/invoice.entity';
 
@Entity('purchase_requests')
export class PurchaseRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // dealer ka user id

  @Column()
  inventoryId: string; // dummy id abhi, baad me Manheim se aayega

  @Column({ default: 'pending' })
  status:
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'purchased'
    | 'in_transit'
    | 'delivered';

  @Column({ type: 'decimal', nullable: true })
  bidAmount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @OneToOne(() => Invoice, (invoice) => invoice.purchaseRequest)
  invoice: Invoice;
}
