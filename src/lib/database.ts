// Local storage based database for keys and logs

export interface LoginKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

export interface SearchLog {
  id: string;
  keyId: string;
  keyName: string;
  endpoint: string;
  parameter: string;
  value: string;
  timestamp: string;
  success: boolean;
}

interface Database {
  keys: LoginKey[];
  logs: SearchLog[];
}

const DB_KEY = 'cfms_database';

const getDefaultDatabase = (): Database => ({
  keys: [
    {
      id: 'default-key-1',
      key: 'CFMS-2024-DEMO',
      name: 'Demo Key',
      createdAt: new Date().toISOString(),
      usageCount: 0,
    }
  ],
  logs: [],
});

export const getDatabase = (): Database => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      const defaultDb = getDefaultDatabase();
      localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
      return defaultDb;
    }
    return JSON.parse(data);
  } catch {
    return getDefaultDatabase();
  }
};

export const saveDatabase = (db: Database): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const validateKey = (key: string): LoginKey | null => {
  const db = getDatabase();
  const found = db.keys.find(k => k.key === key);
  if (found) {
    found.lastUsed = new Date().toISOString();
    found.usageCount += 1;
    saveDatabase(db);
    return found;
  }
  return null;
};

export const createKey = (name: string, key: string): LoginKey => {
  const db = getDatabase();
  const newKey: LoginKey = {
    id: `key-${Date.now()}`,
    key,
    name,
    createdAt: new Date().toISOString(),
    usageCount: 0,
  };
  db.keys.push(newKey);
  saveDatabase(db);
  return newKey;
};

export const deleteKey = (id: string): boolean => {
  const db = getDatabase();
  const index = db.keys.findIndex(k => k.id === id);
  if (index !== -1) {
    db.keys.splice(index, 1);
    saveDatabase(db);
    return true;
  }
  return false;
};

export const getAllKeys = (): LoginKey[] => {
  return getDatabase().keys;
};

export const addSearchLog = (
  keyId: string,
  keyName: string,
  endpoint: string,
  parameter: string,
  value: string,
  success: boolean
): SearchLog => {
  const db = getDatabase();
  const log: SearchLog = {
    id: `log-${Date.now()}`,
    keyId,
    keyName,
    endpoint,
    parameter,
    value,
    timestamp: new Date().toISOString(),
    success,
  };
  db.logs.unshift(log);
  // Keep only last 500 logs
  if (db.logs.length > 500) {
    db.logs = db.logs.slice(0, 500);
  }
  saveDatabase(db);
  return log;
};

export const getAllLogs = (): SearchLog[] => {
  return getDatabase().logs;
};

export const clearLogs = (): void => {
  const db = getDatabase();
  db.logs = [];
  saveDatabase(db);
};

export const generateRandomKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [4, 4, 4];
  return 'CFMS-' + segments.map(len => 
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  ).join('-');
};
