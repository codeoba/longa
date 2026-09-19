import { useState, useEffect, useCallback } from 'react';
import { db } from '../database';
import { QueryFilter, QueryOptions } from '../database/types';

// Hook kwa kutumia database collection
export function useCollection<T>(
  collection: string,
  filters?: QueryFilter[],
  options?: QueryOptions
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const items = filters
        ? await db.query<T>(collection, filters)
        : await db.list<T>(collection, options);
      setData(items);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [collection, filters, options]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time subscription
  useEffect(() => {
    if (!db.isConnected()) return;

    const unsubscribe = db.subscribe<T>(collection, (newData) => {
      setData(newData);
    }, filters);

    return unsubscribe;
  }, [collection, filters]);

  return {
    data,
    loading,
    error,
    refresh: loadData,
  };
}

// Hook kwa document moja
export function useDocument<T>(collection: string, id: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDocument = useCallback(async () => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const item = await db.read<T>(collection, id);
      setData(item);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [collection, id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  return {
    data,
    loading,
    error,
    refresh: loadDocument,
  };
}

// Hook kwa CRUD operations
export function useDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async <T,>(collection: string, data: T) => {
    try {
      setLoading(true);
      const result = await db.create(collection, data);
      setError(null);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async <T,>(collection: string, id: string, data: Partial<T>) => {
    try {
      setLoading(true);
      const result = await db.update(collection, id, data);
      setError(null);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (collection: string, id: string) => {
    try {
      setLoading(true);
      const result = await db.delete(collection, id);
      setError(null);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    update,
    remove,
    loading,
    error,
  };
}

// Hook kwa database initialization
export function useDatabaseInit() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = async (type: 'localStorage' | 'indexedDB' | 'firebase' | 'supabase', config?: any) => {
    try {
      await db.initialize({ type, config });
      setInitialized(true);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    initialize,
    initialized,
    error,
    isConnected: db.isConnected(),
  };
}
