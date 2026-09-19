import { DatabaseAdapter, QueryOptions, QueryFilter } from './types';

export class IndexedDBAdapter implements DatabaseAdapter {
  name = 'indexedDB';
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;
  
  constructor(dbName: string = 'longa_db', dbVersion: number = 1) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }
  
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Object stores will be created on demand
      };
    });
  }
  
  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
  
  isConnected(): boolean {
    return this.db !== null;
  }
  
  private ensureStore(collection: string): Promise<IDBObjectStore> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not connected'));
        return;
      }
      
      // Check if store exists
      if (this.db.objectStoreNames.contains(collection)) {
        const transaction = this.db.transaction([collection], 'readwrite');
        resolve(transaction.objectStore(collection));
      } else {
        // Need to upgrade database to create new store
        this.db.close();
        const request = indexedDB.open(this.dbName, this.dbVersion + 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(collection)) {
            db.createObjectStore(collection, { keyPath: 'id' });
          }
        };
        
        request.onsuccess = () => {
          this.db = request.result;
          this.dbVersion++;
          const transaction = this.db.transaction([collection], 'readwrite');
          resolve(transaction.objectStore(collection));
        };
        
        request.onerror = () => reject(request.error);
      }
    });
  }
  
  async create<T>(collection: string, data: T): Promise<T & { id: string }> {
    const store = await this.ensureStore(collection);
    const item = { ...data, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) };
    
    return new Promise((resolve, reject) => {
      const request = store.add(item);
      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }
  
  async read<T>(collection: string, id: string): Promise<T | null> {
    const store = await this.ensureStore(collection);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
  
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    const existing = await this.read<T & { id: string }>(collection, id);
    if (!existing) return null;
    
    const updated = { ...existing, ...data };
    const store = await this.ensureStore(collection);
    
    return new Promise((resolve, reject) => {
      const request = store.put(updated);
      request.onsuccess = () => resolve(updated);
      request.onerror = () => reject(request.error);
    });
  }
  
  async delete(collection: string, id: string): Promise<boolean> {
    const store = await this.ensureStore(collection);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
  
  async list<T>(collection: string, options?: QueryOptions): Promise<T[]> {
    const store = await this.ensureStore(collection);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        let items = request.result;
        
        // Apply ordering
        if (options?.orderBy) {
          items.sort((a, b) => {
            const aVal = (a as any)[options.orderBy!];
            const bVal = (b as any)[options.orderBy!];
            const direction = options.orderDirection === 'desc' ? -1 : 1;
            return aVal > bVal ? direction : aVal < bVal ? -direction : 0;
          });
        }
        
        // Apply pagination
        if (options?.offset) {
          items = items.slice(options.offset);
        }
        if (options?.limit) {
          items = items.slice(0, options.limit);
        }
        
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  async query<T>(collection: string, filters: QueryFilter[]): Promise<T[]> {
    const items = await this.list<T & { id: string }>(collection);
    
    return items.filter(item => {
      return filters.every(filter => {
        const value = (item as any)[filter.field];
        
        switch (filter.operator) {
          case '==': return value === filter.value;
          case '!=': return value !== filter.value;
          case '>': return value > filter.value;
          case '>=': return value >= filter.value;
          case '<': return value < filter.value;
          case '<=': return value <= filter.value;
          case 'in': return filter.value.includes(value);
          case 'contains': return String(value).includes(filter.value);
          case 'startsWith': return String(value).startsWith(filter.value);
          default: return true;
        }
      });
    });
  }
  
  async count(collection: string, filters?: QueryFilter[]): Promise<number> {
    if (!filters || filters.length === 0) {
      const store = await this.ensureStore(collection);
      return new Promise((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    const items = await this.query(collection, filters);
    return items.length;
  }
  
  async batchCreate<T>(collection: string, items: T[]): Promise<T[]> {
    const store = await this.ensureStore(collection);
    const newItems = items.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    
    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      let completed = 0;
      
      newItems.forEach(item => {
        const request = store.add(item);
        request.onsuccess = () => {
          completed++;
          if (completed === newItems.length) {
            resolve(newItems);
          }
        };
        request.onerror = () => reject(request.error);
      });
    });
  }
  
  async batchDelete(collection: string, ids: string[]): Promise<boolean> {
    const store = await this.ensureStore(collection);
    
    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      let completed = 0;
      
      ids.forEach(id => {
        const request = store.delete(id);
        request.onsuccess = () => {
          completed++;
          if (completed === ids.length) {
            resolve(true);
          }
        };
        request.onerror = () => reject(request.error);
      });
    });
  }
  
  subscribe<T>(collection: string, callback: (data: T[]) => void, filters?: QueryFilter[]): () => void {
    // IndexedDB doesn't support real-time, use polling
    const interval = setInterval(async () => {
      const data = filters ? await this.query<T>(collection, filters) : await this.list<T>(collection);
      callback(data);
    }, 1000);
    
    return () => clearInterval(interval);
  }
  
  async clear(collection: string): Promise<void> {
    const store = await this.ensureStore(collection);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async export(collection: string): Promise<any[]> {
    return this.list(collection);
  }
  
  async import(collection: string, data: any[]): Promise<void> {
    await this.clear(collection);
    await this.batchCreate(collection, data);
  }
}
