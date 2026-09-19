import { DatabaseConfig } from './types';

// Database configuration
export const databaseConfig: DatabaseConfig = {
  type: 'localStorage', // Default: localStorage
  // Uncomment na ubadilishe kulingana na database unayotumia:
  
  // LocalStorage (default, no config needed)
  // type: 'localStorage',
  
  // IndexedDB (for larger data)
  // type: 'indexedDB',
  // config: {
  //   dbName: 'longa_db',
  //   dbVersion: 1
  // }
  
  // Firebase Firestore
  // type: 'firebase',
  // config: {
  //   apiKey: "your-api-key",
  //   authDomain: "your-project.firebaseapp.com",
  //   projectId: "your-project-id",
  //   storageBucket: "your-project.appspot.com",
  //   messagingSenderId: "your-sender-id",
  //   appId: "your-app-id"
  // }
  
  // Supabase (PostgreSQL)
  // type: 'supabase',
  // config: {
  //   url: "https://your-project.supabase.co",
  //   anonKey: "your-anon-key"
  // }
};

// Collections (tables) used in the app
export const COLLECTIONS = {
  POSTS: 'posts',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
  MESSAGES: 'messages',
  LISTS: 'lists',
  BOOKMARKS: 'bookmarks',
  DRAFTS: 'drafts',
  COMMUNITIES: 'communities',
  SPACES: 'spaces',
  SETTINGS: 'settings',
} as const;

// Helper function to initialize database
export async function initializeDatabase(): Promise<void> {
  const { db } = await import('./DatabaseManager');
  await db.initialize(databaseConfig);
  console.log(`Database initialized: ${databaseConfig.type}`);
}
