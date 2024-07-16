import { prisma } from '../db.js';
import type { Role } from '@prisma/client';

async function seedRoles() {
  const roles: Role['name'][] = [
    'ADMIN',
    'USER',
    'OWNER',
    'MANAGER',
    'MERCHANT',
    'KITCHEN',
    'CASHIER'
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    });
  }
}

async function main() {
  try {
    await seedRoles();
    await prisma.$disconnect();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void main();
