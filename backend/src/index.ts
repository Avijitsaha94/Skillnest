import { env } from './config/env';
import { connectDB } from './config/db';
import app from './app';

const PORT = Number(env.PORT);

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
🚀 SkillNest API running
   ├─ Port    : ${PORT}
   ├─ Env     : ${env.NODE_ENV}
   └─ Health  : http://localhost:${PORT}/health
    `);
  });
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

start();
