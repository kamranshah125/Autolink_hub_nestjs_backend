// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DealerProfile } from './entities/dealer-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(DealerProfile) private dealerRepo: Repository<DealerProfile>,
  ) {}

  async createDealer(data: {
    name: string;
    email: string;
    password: string;
    companyName?: string;
    taxId?: string;
    bankDetails?: string;
  }): Promise<User> {
    const dealerProfile = this.dealerRepo.create({
      companyName: data.companyName,
      taxId: data.taxId,
      bankDetails: data.bankDetails,
      status: 'pending',
    });

    const user = this.usersRepo.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'dealer',
      dealerProfile,
    });

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({
      where: { email },
      relations: ['dealerProfile'],
    });
  }

  async findById(id: number) {
    return this.usersRepo.findOne({ where: { id }, relations: ['dealerProfile'] });
  }

  async createAdmin(data: { name: string; email: string; password: string }) {
    const user = this.usersRepo.create({ ...data, role: 'admin' });
    return this.usersRepo.save(user);
  }

  async setDealerStatus(userId: number, status: 'pending' | 'approved' | 'rejected') {
    const profile = await this.dealerRepo.findOne({ where: { id: userId }, relations: ['user'] });
    if (!profile) throw new NotFoundException('Dealer profile not found');
    profile.status = status;
    return this.dealerRepo.save(profile);
  }
}
