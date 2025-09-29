import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Starter, Pro, Premium

  @Column('decimal')
  monthlyFee: number;

  @Column('decimal')
  perCarFee: number;

  @Column('int')
  maxUsers: number;
}
// Remove custom Column decorator, use the one from typeorm import above.

