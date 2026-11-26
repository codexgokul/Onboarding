import { createApp } from './src/app.js';
import { initDatabase, seedDatabase } from './src/db/database.js';
import { config } from './src/config/index.js';

console.log('----------------------------------------------------');
console.log('🚀 TalentFlow Employee Onboarding Backend Server');
console.log(`📁 Database: SQLite (${config.dbPath})`);
console.log(`🌍 Environment: ${config.nodeEnv}`);
console.log('----------------------------------------------------');

// Initialize database schema and verify seed
initDatabase();

const app = createApp();

app.listen(config.port, () => {
  console.log(`✨ Server listening on http://localhost:${config.port}`);
  console.log(`📡 REST API Root:   http://localhost:${config.port}/api`);
  console.log(`🏥 Health Check:    http://localhost:${config.port}/api/health`);
  console.log('----------------------------------------------------');
});
