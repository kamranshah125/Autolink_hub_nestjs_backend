// run with: ts-node -r tsconfig-paths/register src/scripts/seed-admin.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User } from 'src/modules/users/entities/user.entity';
dotenv.config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
});

async function run() {
  await ds.initialize();
  const repo = ds.getRepository(User);
  const existing = await repo.findOne({ where: { email: 'admin@autolink.com' } });
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@123', 10);
    const u = repo.create({ name: 'Admin', email: 'admin@autolink.com', password: hashed, role: 'admin' });
    await repo.save(u);
    console.log('Admin created');
  } else console.log('Admin exists');
  await ds.destroy();
}
run();
