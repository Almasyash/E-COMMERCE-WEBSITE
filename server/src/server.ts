import { createApp } from './app';
import { config } from './config/environment';
import prisma from './config/database';
import { ensureDatabaseSetup } from './config/initDatabase';

const app = createApp();

const server = app.listen(config.port, async () => {
  console.log(`🚀 ApexCart API Server running in [${config.env}] mode on port ${config.port}`);
  console.log(`📡 Healthcheck available at http://localhost:${config.port}/api/health`);

  // Automatically check PostgreSQL tables and run schema push + seed if missing
  ensureDatabaseSetup().catch((e) => {
    console.error('Database setup error on startup:', e);
  });
});

// Graceful shutdown handling
const handleShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully terminating server...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Database connections closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default server;
