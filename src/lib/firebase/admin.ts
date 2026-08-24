import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApp();
  }

  // 1. Check for serviceAccountKey.json file in project root or path in env
  const rootKeyPath = path.join(process.cwd(), 'serviceAccountKey.json');
  const customKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const filePathToTry = customKeyPath || rootKeyPath;

  if (fs.existsSync(/*turbopackIgnore: true*/ filePathToTry)) {
    try {
      const fileContent = fs.readFileSync(/*turbopackIgnore: true*/ filePathToTry, 'utf-8');
      const serviceAccount = JSON.parse(fileContent);
      console.log(`[Firebase Admin] Initializing with service account file: ${filePathToTry}`);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch (e) {
      console.warn(`[Firebase Admin] Failed to parse service account from ${filePathToTry}:`, e);
    }
  }

  // 2. Check for inline JSON string in environment variable
  const jsonEnvKey = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonEnvKey) {
    try {
      const serviceAccount = JSON.parse(jsonEnvKey);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch (e) {
      console.warn('[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
    }
  }

  // 3. Check for separate FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'smart-mind-app';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (
    clientEmail &&
    privateKey &&
    privateKey.includes('BEGIN PRIVATE KEY') &&
    !privateKey.includes('...')
  ) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
    } catch (e) {
      console.warn('[Firebase Admin] Cert initialization failed:', e);
    }
  }

  // 4. Fallback for development without service account
  return initializeApp({
    projectId,
  });
}

const adminApp = getAdminApp();

export const adminAuth: Auth | null = adminApp ? getAuth(adminApp) : null;
export const adminDb: Firestore | null = adminApp ? getFirestore(adminApp) : null;
export const adminStorage: Storage | null = adminApp ? getStorage(adminApp) : null;
