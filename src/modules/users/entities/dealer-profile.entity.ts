// src/entities/dealer-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export type DealerStatus = 'pending' | 'approved' | 'rejected';

@Entity()
export class DealerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  bankDetails: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: DealerStatus;

  @OneToOne(() => User, (user) => user.dealerProfile)
  @JoinColumn()
  user: User;
}
