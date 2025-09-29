import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from '@/common/dto/create-subscription.dto';
import { UploadSlipDto } from '@/common/dto/upload-slip.dto';
import { FileInterceptor } from '@nestjs/platform-express';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // ===============================
  // 📌 Dealer Side Endpoints
  // ===============================

  // GET all available plans
  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  // Dealer chooses a plan → subscription + invoice create hota hai
  @Post()
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(dto);
  }

  // Dealer uploads bank transfer slip (invoice proof)
  @Patch('invoice/:id/upload-slip')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPaymentSlip(
    @Param('id') invoiceId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.subscriptionsService.uploadPaymentSlip(invoiceId, file);
  }

  // Dealer apni subscriptions list kare
  @Get('my')
  async getMySubscriptions() {
    // TODO: use auth userId
    return this.subscriptionsService.getDealerSubscriptions(1);
  }

  // ===============================
  // 📌 Admin Side Endpoints
  // ===============================

  // Admin: get all pending invoices
  @Get('admin/invoices/pending')
//   @UseGuards(RolesGuard)
//   @Roles('admin')
  async getPendingInvoices() {
    return this.subscriptionsService.getPendingInvoices();
  }

  // Admin: verify invoice (approve/reject payment slip)
  @Patch('admin/invoice/:id/verify')
//   @UseGuards(RolesGuard)
//   @Roles('admin')
  async verifyInvoice(
    @Param('id') invoiceId: number,
    @Body() body: { status: 'paid' | 'rejected' },
  ) {
    return this.subscriptionsService.verifyInvoice(invoiceId, body.status);
  }
}
