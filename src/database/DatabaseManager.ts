import { DatabaseAdapter, DatabaseConfig } from './types';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { IndexedDBAdapter } from './IndexedDBAdapter';
import { FirebaseAdapter, FirebaseConfig } from './FirebaseAdapter';
import { SupabaseAdapter, SupabaseConfig } from './SupabaseAdapter';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private adapter: DatabaseAdapter | null = null;
  private config: DatabaseConfig | null = null;
  
  private constructor() {}
  
  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }
  
  async initialize(config: DatabaseConfig): Promise<void> {
    this.config = config;
    
    switch (config.type) {
      case 'localStorage':
        this.adapter = new LocalStorageAdapter();
        break;
      case 'indexedDB':
        this.adapter = new IndexedDBAdapter(
          config.config?.dbName || 'longa_db',
          config.config?.dbVersion || 1
        );
        break;
      case 'firebase':
        this.adapter = new FirebaseAdapter(config.config as FirebaseConfig);
        break;
      case 'supabase':
        this.adapter = new SupabaseAdapter(config.config as SupabaseConfig);
        break;
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
    
    await this.adapter.connect();
  }
  
  getAdapter(): DatabaseAdapter {
    if (!this.adapter) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.adapter;
  }
  
  async disconnect(): Promise<void> {
    if (this.adapter) {
      await this.adapter.disconnect();
      this.adapter = null;
    }
  }
  
  isConnected(): boolean {
    return this.adapter?.isConnected() || false;
  }
  
  // Convenience methods
  async create<T>(collection: string, data: T): Promise<T & { id: string }> {
    return this.getAdapter().create(collection, data);
  }
  
  async read<T>(collection: string, id: string): Promise<T | null> {
    return this.getAdapter().read(collection, id);
  }
  
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    return this.getAdapter().update(collection, id, data);
  }
  
  async delete(collection: string, id: string): Promise<boolean> {
    return this.getAdapter().delete(collection, id);
  }
  
  async list<T>(collection: string, options?: any): Promise<T[]> {
    return this.getAdapter().list(collection, options);
  }
  
  async query<T>(collection: string, filters: any[]): Promise<T[]> {
    return this.getAdapter().query(collection, filters);
  }
  
  async count(collection: string, filters?: any[]): Promise<number> {
    return this.getAdapter().count(collection, filters);
  }
  
  async batchCreate<T>(collection: string, items: T[]): Promise<T[]> {
    return this.getAdapter().batchCreate(collection, items);
  }
  
  async batchDelete(collection: string, ids: string[]): Promise<boolean> {
    return this.getAdapter().batchDelete(collection, ids);
  }
  
  subscribe<T>(collection: string, callback: (data: T[]) => void, filters?: any[]): () => void {
    return this.getAdapter().subscribe(collection, callback, filters);
  }
  
  async clear(collection: string): Promise<void> {
    return this.getAdapter().clear(collection);
  }
  
  async export(collection: string): Promise<any[]> {
    return this.getAdapter().export(collection);
  }
  
  async import(collection: string, data: any[]): Promise<void> {
    return this.getAdapter().import(collection, data);
  }
}

// Export singleton instance
export const db = DatabaseManager.getInstance();
