import { DatabaseAdapter, QueryOptions, QueryFilter } from './types';

export class LocalStorageAdapter implements DatabaseAdapter {
  name = 'localStorage';
  private prefix = 'x_app_';
  
  connect(): Promise<void> {
    return Promise.resolve();
  }
  
  disconnect(): Promise<void> {
    return Promise.resolve();
  }
  
  isConnected(): boolean {
    return typeof window !== 'undefined' && window.localStorage !== undefined;
  }
  
  private getKey(collection: string, id?: string): string {
    return id ? `${this.prefix}${collection}_${id}` : `${this.prefix}${collection}`;
  }
  
  private getCollection<T>(collection: string): T[] {
    const data = localStorage.getItem(this.getKey(collection));
    return data ? JSON.parse(data) : [];
  }
  
  private setCollection<T>(collection: string, data: T[]): void {
    localStorage.setItem(this.getKey(collection), JSON.stringify(data));
  }
  
  async create<T>(collection: string, data: T): Promise<T & { id: string }> {
    const items = this.getCollection<T & { id: string }>(collection);
    const newItem = { ...data, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) };
    items.push(newItem);
    this.setCollection(collection, items);
    return newItem;
  }
  
  async read<T>(collection: string, id: string): Promise<T | null> {
    const items = this.getCollection<T & { id: string }>(collection);
    const item = items.find(i => i.id === id);
    return item || null;
  }
  
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    const items = this.getCollection<T & { id: string }>(collection);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...data };
    this.setCollection(collection, items);
    return items[index];
  }
  
  async delete(collection: string, id: string): Promise<boolean> {
    const items = this.getCollection<any>(collection);
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    
    this.setCollection(collection, filtered);
    return true;
  }
  
  async list<T>(collection: string, options?: QueryOptions): Promise<T[]> {
    let items = this.getCollection<T & { id: string }>(collection);
    
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
    
    return items;
  }
  
  async query<T>(collection: string, filters: QueryFilter[]): Promise<T[]> {
    const items = this.getCollection<T & { id: string }>(collection);
    
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
      return this.getCollection(collection).length;
    }
    const items = await this.query(collection, filters);
    return items.length;
  }
  
  async batchCreate<T>(collection: string, items: T[]): Promise<T[]> {
    const existing = this.getCollection<T & { id: string }>(collection);
    const newItems = items.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    this.setCollection(collection, [...existing, ...newItems]);
    return newItems;
  }
  
  async batchDelete(collection: string, ids: string[]): Promise<boolean> {
    const items = this.getCollection<any>(collection);
    const filtered = items.filter(i => !ids.includes(i.id));
    this.setCollection(collection, filtered);
    return true;
  }
  
  subscribe<T>(collection: string, callback: (data: T[]) => void, filters?: QueryFilter[]): () => void {
    // LocalStorage doesn't support real-time, so we use polling
    const interval = setInterval(async () => {
      const data = filters ? await this.query<T>(collection, filters) : await this.list<T>(collection);
      callback(data);
    }, 1000);
    
    return () => clearInterval(interval);
  }
  
  async clear(collection: string): Promise<void> {
    localStorage.removeItem(this.getKey(collection));
  }
  
  async export(collection: string): Promise<any[]> {
    return this.getCollection(collection);
  }
  
  async import(collection: string, data: any[]): Promise<void> {
    this.setCollection(collection, data);
  }
}
