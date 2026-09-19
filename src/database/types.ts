// Database Interface - Abstract base for all database implementations
export interface DatabaseAdapter {
  name: string;
  
  // Connection
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // CRUD Operations
  create<T>(collection: string, data: T): Promise<T & { id: string }>;
  read<T>(collection: string, id: string): Promise<T | null>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null>;
  delete(collection: string, id: string): Promise<boolean>;
  
  // Query Operations
  list<T>(collection: string, options?: QueryOptions): Promise<T[]>;
  query<T>(collection: string, filters: QueryFilter[]): Promise<T[]>;
  count(collection: string, filters?: QueryFilter[]): Promise<number>;
  
  // Batch Operations
  batchCreate<T>(collection: string, items: T[]): Promise<T[]>;
  batchDelete(collection: string, ids: string[]): Promise<boolean>;
  
  // Real-time
  subscribe<T>(collection: string, callback: (data: T[]) => void, filters?: QueryFilter[]): () => void;
  
  // Utility
  clear(collection: string): Promise<void>;
  export(collection: string): Promise<any[]>;
  import(collection: string, data: any[]): Promise<void>;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface QueryFilter {
  field: string;
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'contains' | 'startsWith';
  value: any;
}

export interface DatabaseConfig {
  type: 'localStorage' | 'indexedDB' | 'firebase' | 'supabase' | 'mongodb' | 'postgresql' | 'mysql';
  config?: any;
}
