import { DatabaseAdapter, QueryOptions, QueryFilter } from './types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export class SupabaseAdapter implements DatabaseAdapter {
  name = 'supabase';
  private config: SupabaseConfig;
  private supabase: any = null;
  
  constructor(config: SupabaseConfig) {
    this.config = config;
  }
  
  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid bundling Supabase if not used
      const { createClient } = await import('@supabase/supabase-js');
      this.supabase = createClient(this.config.url, this.config.anonKey);
    } catch (error) {
      throw new Error('Supabase not available. Please install @supabase/supabase-js package.');
    }
  }
  
  async disconnect(): Promise<void> {
    this.supabase = null;
  }
  
  isConnected(): boolean {
    return this.supabase !== null;
  }
  
  private buildQuery(collection: string, filters: QueryFilter[], options?: QueryOptions) {
    let query = this.supabase.from(collection).select('*');
    
    // Apply filters
    filters.forEach(filter => {
      switch (filter.operator) {
        case '==':
          query = query.eq(filter.field, filter.value);
          break;
        case '!=':
          query = query.neq(filter.field, filter.value);
          break;
        case '>':
          query = query.gt(filter.field, filter.value);
          break;
        case '>=':
          query = query.gte(filter.field, filter.value);
          break;
        case '<':
          query = query.lt(filter.field, filter.value);
          break;
        case '<=':
          query = query.lte(filter.field, filter.value);
          break;
        case 'in':
          query = query.in(filter.field, filter.value);
          break;
        case 'contains':
          query = query.ilike(filter.field, `%${filter.value}%`);
          break;
        case 'startsWith':
          query = query.ilike(filter.field, `${filter.value}%`);
          break;
      }
    });
    
    // Apply ordering
    if (options?.orderBy) {
      const ascending = options.orderDirection !== 'desc';
      query = query.order(options.orderBy, { ascending });
    }
    
    // Apply pagination
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
    } else if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    return query;
  }
  
  async create<T>(collection: string, data: T): Promise<T & { id: string }> {
    const { data: result, error } = await this.supabase
      .from(collection)
      .insert([{ ...data, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }
  
  async read<T>(collection: string, id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(collection)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }
  
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await this.supabase
      .from(collection)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) return null;
    return result;
  }
  
  async delete(collection: string, id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(collection)
      .delete()
      .eq('id', id);
    
    return !error;
  }
  
  async list<T>(collection: string, options?: QueryOptions): Promise<T[]> {
    const query = this.buildQuery(collection, [], options);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
  
  async query<T>(collection: string, filters: QueryFilter[]): Promise<T[]> {
    const query = this.buildQuery(collection, filters);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
  
  async count(collection: string, filters?: QueryFilter[]): Promise<number> {
    const query = this.buildQuery(collection, filters || []);
    const { count, error } = await query;
    
    if (error) throw error;
    return count || 0;
  }
  
  async batchCreate<T>(collection: string, items: T[]): Promise<T[]> {
    const itemsWithTimestamp = items.map(item => ({
      ...item,
      created_at: new Date().toISOString()
    }));
    
    const { data, error } = await this.supabase
      .from(collection)
      .insert(itemsWithTimestamp)
      .select();
    
    if (error) throw error;
    return data || [];
  }
  
  async batchDelete(collection: string, ids: string[]): Promise<boolean> {
    const { error } = await this.supabase
      .from(collection)
      .delete()
      .in('id', ids);
    
    return !error;
  }
  
  subscribe<T>(collection: string, callback: (data: T[]) => void, filters?: QueryFilter[]): () => void {
    const channel = this.supabase
      .channel(`collection-${collection}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: collection }, (payload: any) => {
        // Reload data on any change
        this.list<T>(collection).then(callback);
      })
      .subscribe();
    
    return () => {
      this.supabase.removeChannel(channel);
    };
  }
  
  async clear(collection: string): Promise<void> {
    const { error } = await this.supabase
      .from(collection)
      .delete()
      .neq('id', '');
    
    if (error) throw error;
  }
  
  async export(collection: string): Promise<any[]> {
    return this.list(collection);
  }
  
  async import(collection: string, data: any[]): Promise<void> {
    await this.clear(collection);
    await this.batchCreate(collection, data);
  }
}
