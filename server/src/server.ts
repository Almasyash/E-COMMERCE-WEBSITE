import { createApp } from './app';
import { config } from './config/environment';
import prisma from './config/database';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`🚀 ApexCart API Server running in [${config.env}] mode on port ${config.port}`);
  console.log(`📡 Healthcheck available at http://localhost:${config.port}/api/health`);
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
