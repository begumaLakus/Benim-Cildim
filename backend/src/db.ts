import { PrismaClient } from '@prisma/client';

/**
 * Tum uygulamada tek bir Prisma Client ornegi kullanilir — ts-node-dev'in
 * hot-reload'unda her degisiklikte yeni baglanti acilmasini onler.
 */
export const prisma = new PrismaClient();
