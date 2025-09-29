// src/users/users.controller.ts
import { Controller, Get, UseGuards, Req, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/guards/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // any logged-in user
  @Get('me')
  getMe(@Req() req) {
    const user = req.user;
    delete (user as any).password;
    return user;
  }

  // admin only -> list users (example)
  @Get()
  @Roles('admin')
  async getAll() {
    // implement listing (add repo method if needed)
    return { message: 'list users (implement as needed)' };
  }

  // admin: approve dealer
  @Patch('dealer/:id/status')
  @Roles('admin')
  async setDealerStatus(@Param('id') id: number, @Body() body: { status: 'approved' | 'rejected' | 'pending' }) {
    return this.usersService.setDealerStatus(+id, body.status);
  }
}
