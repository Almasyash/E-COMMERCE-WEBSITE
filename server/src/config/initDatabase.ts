import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prisma from './database';

const findFile = (relativePaths: string[]): string | null => {
  for (const p of relativePaths) {
    const resolved = path.resolve(p);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }
  return null;
};

export const ensureDatabaseSetup = async (): Promise<{ success: boolean; message: string }> => {
  console.log('🔍 Checking PostgreSQL database schema and tables...');

  try {
    // 1. Test if tables exist by querying category count
    const categoryCount = await prisma.category.count();
    console.log(`✅ PostgreSQL tables verified. Found ${categoryCount} categories.`);

    if (categoryCount === 0) {
      console.log('🌱 Database is empty. Running seed...');
      runSeed();
      const updatedCount = await prisma.category.count();
      return { success: true, message: `Database seeded with ${updatedCount} categories.` };
    }

    return { success: true, message: `Database already initialized with ${categoryCount} categories.` };
  } catch (err: any) {
    const isMissingTable =
      err?.code === 'P2021' ||
      err?.message?.includes('does not exist') ||
      err?.message?.includes('relation') ||
      err?.message?.includes('table');

    if (isMissingTable) {
      console.log('⚠️ Prisma tables missing (P2021). Automatically running schema push...');
      runPrismaPush();
      runSeed();

      try {
        const count = await prisma.category.count();
        const prodCount = await prisma.product.count();
        const userCount = await prisma.user.count();
        console.log(`🎉 Schema push and seed complete! Categories: ${count}, Products: ${prodCount}, Users: ${userCount}`);
        return {
          success: true,
          message: `Schema pushed and database seeded successfully. Categories: ${count}, Products: ${prodCount}, Users: ${userCount}`,
        };
      } catch (verifyErr: any) {
        return { success: false, message: `Schema push attempted but verify failed: ${verifyErr.message}` };
      }
    }

    console.error('Database connection/query check error:', err.message);
    return { success: false, message: err.message };
  }
};

export const runPrismaPush = () => {
  const schemaPath = findFile([
    path.join(process.cwd(), 'prisma/schema.prisma'),
    path.join(process.cwd(), '../prisma/schema.prisma'),
    path.join(__dirname, '../../prisma/schema.prisma'),
    path.join(__dirname, '../../../prisma/schema.prisma'),
  ]);

  if (!schemaPath) {
    console.error('❌ Could not locate prisma/schema.prisma');
    return;
  }

  console.log(`🚀 Executing: npx prisma db push --schema="${schemaPath}" --accept-data-loss`);
  try {
    execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, {
      stdio: 'inherit',
      env: process.env,
    });
    console.log('✅ Prisma db push completed successfully.');
  } catch (pushErr: any) {
    console.error('❌ prisma db push error:', pushErr.message);
  }
};

export const runSeed = () => {
  const seedPath = findFile([
    path.join(process.cwd(), 'prisma/seed.ts'),
    path.join(process.cwd(), '../prisma/seed.ts'),
    path.join(__dirname, '../../prisma/seed.ts'),
    path.join(__dirname, '../../../prisma/seed.ts'),
  ]);

  if (!seedPath) {
    console.error('❌ Could not locate prisma/seed.ts');
    return;
  }

  console.log(`🌱 Executing: npx tsx "${seedPath}"`);
  try {
    execSync(`npx tsx "${seedPath}"`, {
      stdio: 'inherit',
      env: process.env,
    });
    console.log('✅ Database seeding completed successfully.');
  } catch (seedErr: any) {
    console.error('❌ Seeding error:', seedErr.message);
  }
};
