# Database Layer - X App

Sistema ya database inayoweza kufanya kazi na database mbali mbali.

## Supported Databases

### 1. LocalStorage (Default)
- ✅ Rahisi, hakuna backend inayohitajika
- ✅ Inafanya kazi offline
- ⚠️ Data ndogo tu (~5MB limit)
- ⚠️ Hakuna real-time updates

### 2. IndexedDB
- ✅ Inafaa kwa data kubwa
- ✅ Inafanya kazi offline
- ✅ Performance nzuri
- ⚠️ Hakuna real-time updates

### 3. Firebase Firestore
- ✅ Real-time updates
- ✅ Cloud-based
- ✅ Scalable
- ⚠️ Inahitajika internet
- ⚠️ Inahitajika Firebase account

### 4. Supabase (PostgreSQL)
- ✅ Real-time updates
- ✅ SQL database
- ✅ Open source
- ⚠️ Inahitajika internet
- ⚠️ Inahitajika Supabase account

## Jinsi ya Kutumia

### 1. Configuration

Badilisha `src/database/config.ts`:

```typescript
// LocalStorage (default)
export const databaseConfig: DatabaseConfig = {
  type: 'localStorage'
};

// IndexedDB
export const databaseConfig: DatabaseConfig = {
  type: 'indexedDB',
  config: {
    dbName: 'x_app_db',
    dbVersion: 1
  }
};

// Firebase
export const databaseConfig: DatabaseConfig = {
  type: 'firebase',
  config: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  }
};

// Supabase
export const databaseConfig: DatabaseConfig = {
  type: 'supabase',
  config: {
    url: "https://your-project.supabase.co",
    anonKey: "your-anon-key"
  }
};
```

### 2. Initialize Database

Kwenye `src/main.tsx`:

```typescript
import { initializeDatabase } from './database/config';

// Initialize database before app starts
initializeDatabase().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
});
```

### 3. Using React Hooks

```typescript
import { useCollection, useDocument, useDatabase } from './hooks/useDatabase';

// Get all posts
function PostsList() {
  const { data: posts, loading, error } = useCollection('posts');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
}

// Get single post
function PostDetail({ postId }: { postId: string }) {
  const { data: post, loading } = useDocument('posts', postId);
  
  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;
  
  return <div>{post.content}</div>;
}

// Create, Update, Delete
function PostActions() {
  const { create, update, remove, loading } = useDatabase();
  
  const handleCreate = async () => {
    const newPost = await create('posts', {
      content: 'Hello World',
      likes: 0,
      timestamp: new Date()
    });
    console.log('Created:', newPost);
  };
  
  const handleUpdate = async (id: string) => {
    await update('posts', id, { likes: 10 });
  };
  
  const handleDelete = async (id: string) => {
    await remove('posts', id);
  };
  
  return (
    <div>
      <button onClick={handleCreate}>Create Post</button>
    </div>
  );
}
```

### 4. Direct Database Access

```typescript
import { db } from './database';

// Create
const post = await db.create('posts', {
  content: 'Hello World',
  likes: 0
});

// Read
const post = await db.read('posts', 'post-id');

// Update
await db.update('posts', 'post-id', { likes: 10 });

// Delete
await db.delete('posts', 'post-id');

// List all
const posts = await db.list('posts', {
  limit: 10,
  offset: 0,
  orderBy: 'timestamp',
  orderDirection: 'desc'
});

// Query with filters
const likedPosts = await db.query('posts', [
  { field: 'likes', operator: '>', value: 100 },
  { field: 'content', operator: 'contains', value: 'hello' }
]);

// Count
const count = await db.count('posts', [
  { field: 'likes', operator: '>', value: 100 }
]);

// Real-time subscription
const unsubscribe = db.subscribe('posts', (posts) => {
  console.log('Posts updated:', posts);
});

// Stop subscription
unsubscribe();
```

### 5. Backup & Migration

```typescript
import { DatabaseMigration } from './database/migration';

// Download backup
await DatabaseMigration.downloadBackup();

// Restore from file
const file = document.getElementById('file-input').files[0];
await DatabaseMigration.uploadBackup(file);

// Migrate between databases
await DatabaseMigration.migrate(
  { type: 'localStorage' },
  { type: 'indexedDB' }
);
```

## Query Operators

- `==` - Equal
- `!=` - Not equal
- `>` - Greater than
- `>=` - Greater than or equal
- `<` - Less than
- `<=` - Less than or equal
- `in` - Value in array
- `contains` - String contains
- `startsWith` - String starts with

## Collections

- `posts` - User posts
- `users` - User profiles
- `notifications` - Notifications
- `messages` - Direct messages
- `lists` - User lists
- `bookmarks` - Bookmarked posts
- `drafts` - Draft posts
- `communities` - Communities
- `spaces` - Audio spaces
- `settings` - User settings

## Installation (Optional Databases)

### Firebase
```bash
npm install firebase
```

### Supabase
```bash
npm install @supabase/supabase-js
```

## Notes

- LocalStorage na IndexedDB zinafanya kazi offline
- Firebase na Supabase zinahitajika internet connection
- Real-time updates zinapatikana kwenye Firebase na Supabase tu
- Kwa production, tumia Firebase au Supabase kwa data muhimu
- LocalStorage ina limit ya ~5MB
