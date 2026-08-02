/**
 * Seed script — creates a default user for local development.
 * Run: npx tsx prisma/seed.ts
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma';

async function main() {
  const email = 'a@gmail.com';
  const password = '12341234';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ User "${email}" already exists — skipping.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  console.log(`✓ Seeded user: ${user.email} (id: ${user.id})`);
}

main()
  .catch(e => { console.error('Seed failed:', e.message); process.exit(1); })
  .finally(() => process.exit(0));
