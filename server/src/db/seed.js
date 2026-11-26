import { initDatabase, seedDatabase } from './database.js';

initDatabase();
seedDatabase();
console.log('Database successfully re-seeded with demo records.');
process.exit(0);
