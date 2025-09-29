import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { SubscriptionPlan } from "./subscription-plans.entity";

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubscriptionPlan, { eager: true })
  plan: SubscriptionPlan;

  @Column()
  userId: number; //  

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'active' | 'expired' | 'cancelled';
}
