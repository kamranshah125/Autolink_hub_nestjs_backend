// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email before logging in.');
      }
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  // ✅ Send verification email
  async sendVerificationEmail(user: any) {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'MISSING');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 👈 Gmail App Password
      },
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`;

    await transporter.sendMail({
      from: `"Autolink" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify your email',
      html: `
        <p>Hello ${user.name || ''},</p>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  // ✅ Verify email endpoint
  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user || (user.emailVerificationExpires && user.emailVerificationExpires < new Date())) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await this.usersService.save(user);

    return { message: 'Email verified successfully' };
  }
}
