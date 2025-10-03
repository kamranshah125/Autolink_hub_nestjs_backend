import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { DealerProfile } from './dealer-profile.entity';
import { Invoice } from '@/modules/subscriptions/entities/invoice.entity';
import { PurchaseRequest } from '@/modules/purchase-requests/entities/purchase_request.entity';
import { Exclude } from 'class-transformer';

export type UserRole = 'admin' | 'dealer' | 'sub-user';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
  
  @Exclude()
  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
emailVerificationToken: string | null;

@Exclude()
@Column({ type: 'timestamp', nullable: true })
emailVerificationExpires: Date | null;

  @Column({ type: 'varchar', default: 'dealer' })
  role: UserRole;

  @OneToOne(() => DealerProfile, (profile) => profile.user, { cascade: true })
  dealerProfile: DealerProfile;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
invoices: Invoice[];

@OneToMany(() => PurchaseRequest, (pr) => pr.user)
purchaseRequests: PurchaseRequest[];
}
