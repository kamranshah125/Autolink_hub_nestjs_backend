import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class DealerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  taxId: string;

  @Column()
  bankDetails: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  kycDocumentPath: string; 

  // Relation back to User
  @OneToOne(() => User, (user) => user.dealerProfile, { eager: true })
  @JoinColumn()
  user: User;
}
