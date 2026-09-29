import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimiter';
import { config } from './config/environment';

export const createApp = (): Express => {
  const app = express();

  // Security HTTP Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // Allowed CORS origins
  const allowedOrigins = [
    'https://almasyash.github.io',
    'https://fs-groupz.github.io',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ];

  if (config.clientUrl && !allowedOrigins.includes(config.clientUrl)) {
    allowedOrigins.push(config.clientUrl);
  }

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check allowed origins or any github.io subdomain
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.github.io') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }

      callback(new Error('Blocked by CORS policy: Origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // Direct root health endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Request logging
  if (config.env !== 'test') {
    app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
  }

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global rate limiter for API endpoints
  app.use('/api', apiRateLimiter);

  // API Routes
  app.use('/api', routes);

  // 404 handler
  app.use(notFoundHandler);

  // Centralized error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
