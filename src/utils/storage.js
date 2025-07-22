import { LocalStorage } from 'node-localstorage';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create cache directory path
const STORAGE_PATH = path.join(__dirname, '../../.cache');

// Ensure cache directory exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

// Initialize localStorage simulator for Node.js
const localStorage = new LocalStorage(STORAGE_PATH);

export default localStorage;
