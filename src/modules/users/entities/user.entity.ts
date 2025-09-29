// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { DealerProfile } from './dealer-profile.entity';

export type UserRole = 'admin' | 'dealer' | 'sub-user';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'dealer' })
  role: UserRole;

  @OneToOne(() => DealerProfile, (profile) => profile.user, { cascade: true })
  dealerProfile: DealerProfile;
}
