import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@autolink.com';
  const existing = await usersService.findByEmail(adminEmail);

  if (!existing) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await usersService.createAdmin({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
    });
    console.log('✅ Admin seeded successfully');
  } else {
    console.log('⚠️ Admin already exists');
  }

  await app.close();
}

bootstrap();
