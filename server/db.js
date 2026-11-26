import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

export function getDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return {
      employees: [],
      tasks: [],
      emailRequests: [],
      softwareCatalog: [],
      softwarePermissions: [],
      activityLogs: []
    };
  }
}

export function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}

export function logActivity(action, actor, target, details) {
  const db = getDb();
  const entry = {
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    action,
    actor,
    target,
    details
  };
  db.activityLogs = [entry, ...(db.activityLogs || [])].slice(0, 100);
  saveDb(db);
  return entry;
}
