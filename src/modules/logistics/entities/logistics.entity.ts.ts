import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
 
import { LogisticsTracking } from './logistics-tracking.entity';
import { PurchaseRequest } from '@/modules/purchase-requests/entities/purchase_request.entity';

@Entity('logistics')
export class Logistics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseRequest, { eager: true })
  purchaseRequest: PurchaseRequest;

  @Column()
  userId: number;

  @Column({ nullable: true })
  assignedCompany: string;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ default: 'pending' })
  currentStatus: 'pending' | 'assigned' | 'in_transit' | 'delivered';

  @OneToMany(() => LogisticsTracking, (track) => track.logistics, { cascade: true })
  trackingHistory: LogisticsTracking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
