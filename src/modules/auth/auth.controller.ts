// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';
import * as bcrypt from 'bcrypt';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createDealer({
      name: dto.name,
      email: dto.email,
      password: hashed,
      companyName: dto.companyName,
      taxId: dto.taxId,
      bankDetails: dto.bankDetails,
    });

    // strip password
    const { password, ...result } = user as any;
    return result;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new BadRequestException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new BadRequestException('Invalid credentials');

    // If dealer not approved, optionally block login:
    if (user.role === 'dealer' && user.dealerProfile?.status !== 'approved') {
      // You can choose to prevent login until admin approval.
      return { message: 'Dealer registration pending approval', status: user.dealerProfile?.status };
    }

    return this.authService.login(user);
  }
}
