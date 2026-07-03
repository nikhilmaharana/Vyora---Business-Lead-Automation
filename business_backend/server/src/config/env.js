import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

const dotenvResult = dotenv.config({ path: envPath });

export const envLoaded = !dotenvResult.error;
export const envFilePath = envPath;
export const envError = dotenvResult.error || null;

export function logEnvironmentStatus() {
  if (envLoaded) {
    console.log('✓ dotenv loaded');
  } else {
    console.error('✗ dotenv failed to load:', envError?.message || 'Unknown error');
  }

  console.log(`✓ .env file path: ${envFilePath}`);
  console.log(`✓ EMAIL_USER ${process.env.EMAIL_USER ? `found (${process.env.EMAIL_USER})` : 'missing'}`);
  console.log(`✓ EMAIL_APP_PASSWORD ${process.env.EMAIL_APP_PASSWORD ? 'found' : 'missing'}`);
  console.log(`✓ EMAIL_PROVIDER = ${process.env.EMAIL_PROVIDER || 'not set'}`);
  console.log(`✓ OTP_MODE = ${process.env.OTP_MODE || 'not set'}`);
  console.log(`✓ NODE_ENV = ${process.env.NODE_ENV || 'not set'}`);
}
