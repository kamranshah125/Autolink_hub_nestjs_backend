import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Logistics } from './logistics.entity.ts';
 
@Entity('logistics_tracking')
export class LogisticsTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Logistics, (log) => log.trackingHistory)
  logistics: Logistics;

  @Column()
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered';

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
