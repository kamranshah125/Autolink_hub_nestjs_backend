import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Subscription } from "./subscription.entity";

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Subscription, { nullable: true })
  subscription: Subscription;

  @Column('decimal')
  amount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'rejected';

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ nullable: true })
  paymentProofUrl: string; // bank slip upload
}
