import { DatabaseAdapter, QueryOptions, QueryFilter } from './types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export class FirebaseAdapter implements DatabaseAdapter {
  name = 'firebase';
  private config: FirebaseConfig;
  private db: any = null;
  private firebase: any = null;
  
  constructor(config: FirebaseConfig) {
    this.config = config;
  }
  
  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid bundling Firebase if not used
      // @ts-ignore - Firebase is optional
      const firebase = await import(/* @vite-ignore */ 'firebase/app');
      // @ts-ignore - Firebase is optional
      const firestore = await import(/* @vite-ignore */ 'firebase/firestore');
      
      this.firebase = { firebase, firestore };
      
      // Initialize Firebase
      const app = firebase.initializeApp(this.config);
      this.db = firestore.getFirestore(app);
    } catch (error) {
      throw new Error('Firebase not available. Please install firebase package.');
    }
  }
  
  async disconnect(): Promise<void> {
    this.db = null;
    this.firebase = null;
  }
  
  isConnected(): boolean {
    return this.db !== null;
  }
  
  private getCollectionRef(collection: string) {
    const { firestore } = this.firebase;
    return firestore.collection(this.db, collection);
  }
  
  private getDocRef(collection: string, id: string) {
    const { firestore } = this.firebase;
    return firestore.doc(this.db, `${collection}/${id}`);
  }
  
  private buildQuery(collection: string, filters: QueryFilter[], options?: QueryOptions) {
    const { firestore } = this.firebase;
    let query = this.getCollectionRef(collection);
    
    // Apply filters
    filters.forEach(filter => {
      let operator = filter.operator;
      if (filter.operator === '==') operator = '==';
      else if (filter.operator === '!=') operator = '!=';
      else if (filter.operator === '>') operator = '>';
      else if (filter.operator === '>=') operator = '>=';
      else if (filter.operator === '<') operator = '<';
      else if (filter.operator === '<=') operator = '<=';
      else if (filter.operator === 'in') operator = 'in';
      
      query = firestore.query(query, firestore.where(filter.field, operator, filter.value));
    });
    
    // Apply ordering
    if (options?.orderBy) {
      const direction = options.orderDirection === 'desc' ? 'desc' : 'asc';
      query = firestore.query(query, firestore.orderBy(options.orderBy, direction));
    }
    
    // Apply pagination
    if (options?.limit) {
      query = firestore.query(query, firestore.limit(options.limit));
    }
    
    if (options?.offset) {
      query = firestore.query(query, firestore.offset(options.offset));
    }
    
    return query;
  }
  
  async create<T>(collection: string, data: T): Promise<T & { id: string }> {
    const { firestore } = this.firebase;
    const docRef = await firestore.addDoc(this.getCollectionRef(collection), {
      ...data,
      createdAt: firestore.serverTimestamp()
    });
    
    return { ...data, id: docRef.id } as T & { id: string };
  }
  
  async read<T>(collection: string, id: string): Promise<T | null> {
    const { firestore } = this.firebase;
    const docSnap = await firestore.getDoc(this.getDocRef(collection, id));
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }
  
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    const { firestore } = this.firebase;
    const docRef = this.getDocRef(collection, id);
    
    await firestore.updateDoc(docRef, {
      ...data,
      updatedAt: firestore.serverTimestamp()
    });
    
    return this.read<T>(collection, id);
  }
  
  async delete(collection: string, id: string): Promise<boolean> {
    const { firestore } = this.firebase;
    await firestore.deleteDoc(this.getDocRef(collection, id));
    return true;
  }
  
  async list<T>(collection: string, options?: QueryOptions): Promise<T[]> {
    const { firestore } = this.firebase;
    const query = this.buildQuery(collection, [], options);
    const querySnapshot = await firestore.getDocs(query);
    
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
  
  async query<T>(collection: string, filters: QueryFilter[]): Promise<T[]> {
    const { firestore } = this.firebase;
    const query = this.buildQuery(collection, filters);
    const querySnapshot = await firestore.getDocs(query);
    
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
  
  async count(collection: string, filters?: QueryFilter[]): Promise<number> {
    const items = await this.query(collection, filters || []);
    return items.length;
  }
  
  async batchCreate<T>(collection: string, items: T[]): Promise<T[]> {
    const { firestore } = this.firebase;
    const batch = firestore.writeBatch(this.db);
    const results: (T & { id: string })[] = [];
    
    items.forEach(item => {
      const docRef = firestore.doc(this.getCollectionRef(collection));
      batch.set(docRef, { ...item, createdAt: firestore.serverTimestamp() });
      results.push({ ...item, id: docRef.id } as T & { id: string });
    });
    
    await batch.commit();
    return results;
  }
  
  async batchDelete(collection: string, ids: string[]): Promise<boolean> {
    const { firestore } = this.firebase;
    const batch = firestore.writeBatch(this.db);
    
    ids.forEach(id => {
      const docRef = this.getDocRef(collection, id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    return true;
  }
  
  subscribe<T>(collection: string, callback: (data: T[]) => void, filters?: QueryFilter[]): () => void {
    const { firestore } = this.firebase;
    const query = this.buildQuery(collection, filters || []);
    
    const unsubscribe = firestore.onSnapshot(query, (snapshot: any) => {
      const data = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    });
    
    return unsubscribe;
  }
  
  async clear(collection: string): Promise<void> {
    const items = await this.list(collection);
    const ids = items.map((item: any) => item.id);
    await this.batchDelete(collection, ids);
  }
  
  async export(collection: string): Promise<any[]> {
    return this.list(collection);
  }
  
  async import(collection: string, data: any[]): Promise<void> {
    await this.clear(collection);
    await this.batchCreate(collection, data);
  }
}
