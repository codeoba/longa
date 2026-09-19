# Longa - Installation Guide

## 🚀 Installation kwenye aaPanel au cPanel

### 1. Upload Backend Files

**aaPanel:**
```bash
# Upload folder 'backend' kwenda:
/home/yourdomain.com/public_html/api/
```

**cPanel:**
```bash
# Upload folder 'backend' kwenda:
/public_html/api/
```

### 2. Setup Database

#### MySQL:
1. Fungua phpMyPanel au phpMyAdmin
2. Tengeneza database mpya: `x_app_db`
3. Import file: `backend/database/migrations.sql`

#### PostgreSQL:
```bash
# Kwenye terminal
createdb x_app_db
psql x_app_db < backend/database/migrations_pgsql.sql
```

### 3. Configure Database Connection

Badilisha `backend/config/database.php`:

```php
return [
    'driver' => 'mysql', // Au 'pgsql' kwa PostgreSQL
    
    'mysql' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'x_app_db',      // Database yako
        'username' => 'your_username',  // Username yako
        'password' => 'your_password',  // Password yako
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ],
    
    // Kwa PostgreSQL:
    'pgsql' => [
        'host' => 'localhost',
        'port' => 5432,
        'database' => 'x_app_db',
        'username' => 'postgres',
        'password' => 'your_password',
        'charset' => 'utf8',
    ],
];
```

### 4. Set Permissions

```bash
# Kwenye terminal
chmod 755 /home/yourdomain.com/public_html/api/
chmod 644 /home/yourdomain.com/public_html/api/.htaccess
chmod 644 /home/yourdomain.com/public_html/api/index.php
```

### 5. Test API

Fungua browser:
```
https://yourdomain.com/api/
```

Unapaswa kuona:
```json
{
  "status": "ok",
  "message": "Longa API is running",
  "version": "1.0.0"
}
```

### 6. Configure Frontend

Badilisha `src/api/phpAdapter.ts`:

```typescript
const API_URL = 'https://yourdomain.com/api'; // URL ya API yako
```

### 7. Build Frontend

```bash
npm run build
```

Upload `dist/` folder kwenda:
```
/home/yourdomain.com/public_html/
```

## 📝 API Endpoints

### Posts
- `GET /posts` - Get all posts
- `GET /posts/{id}` - Get single post
- `POST /posts` - Create post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `POST /posts/{id}/like` - Like post
- `POST /posts/{id}/unlike` - Unlike post
- `POST /posts/{id}/retweet` - Retweet post

### Users
- `GET /users` - Get all users
- `GET /users/{id}` - Get single user
- `GET /users/search?q=query` - Search users
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `POST /users/{id}/follow` - Follow user
- `POST /users/{id}/unfollow` - Unfollow user

### Notifications
- `GET /notifications?user_id={id}` - Get notifications
- `GET /notifications/unread-count?user_id={id}` - Get unread count
- `POST /notifications` - Create notification
- `PUT /notifications/{id}/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read

### Messages
- `GET /messages?user_id={id}` - Get conversations
- `GET /messages/{conversation_id}` - Get messages
- `GET /messages/unread-count?user_id={id}` - Get unread count
- `POST /messages` - Send message
- `PUT /messages/{id}/read` - Mark as read
- `PUT /messages/read-all` - Mark all as read

## 🔧 Troubleshooting

### Error 500 - Internal Server Error
- Check PHP error logs: `/home/yourdomain.com/logs/error.log`
- Verify database credentials in `config/database.php`
- Check file permissions

### CORS Errors
- Update `config/database.php` → `cors.allowed_origins`
- Add your frontend domain

### Database Connection Failed
- Verify database exists
- Check username/password
- Ensure database user has permissions

### .htaccess Not Working
- Ensure `mod_rewrite` is enabled
- Check Apache configuration
- Try restarting Apache

## 📊 Database Tables

- `users` - User profiles
- `posts` - User posts
- `notifications` - Notifications
- `messages` - Direct messages
- `lists` - User lists
- `bookmarks` - Bookmarked posts
- `drafts` - Draft posts
- `communities` - Communities
- `spaces` - Audio spaces
- `settings` - User settings

## 🔐 Security Tips

1. **Disable debug mode** kwa production:
   ```php
   'debug' => false
   ```

2. **Update CORS** kwa domain yako tu:
   ```php
   'allowed_origins' => ['https://yourdomain.com']
   ```

3. **Use HTTPS** kwa production

4. **Implement authentication** (JWT au session-based)

5. **Sanitize inputs** - tumia prepared statements (tayari zimefanywa)

6. **Regular backups** ya database

## 📞 Support

Kwa msaada zaidi:
- Check API logs
- Review error messages
- Verify database structure
- Test endpoints individually

## 🎯 Next Steps

1. ✅ Upload backend files
2. ✅ Setup database
3. ✅ Configure database.php
4. ✅ Test API endpoints
5. ✅ Configure frontend API_URL
6. ✅ Build and upload frontend
7. ✅ Test full application

---

**Note:** Hii ni basic API. Kwa production, ongeza:
- Authentication (JWT/OAuth)
- Rate limiting
- Input validation
- Error handling
- Logging
- Caching
- File upload handling
