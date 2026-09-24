# Longa - Premium Social Platform

Longa ni premium social platform kamili yenye backend ya PHP inayofanya kazi kwenye aaPanel au cPanel na MySQL/PostgreSQL.

## 🎯 Features

### Frontend (React + TypeScript + Tailwind)
- ✅ Dark/Light mode
- ✅ Posts, Comments, Likes, Retweets
- ✅ User profiles
- ✅ Notifications
- ✅ Direct messages
- ✅ Bookmarks
- ✅ Lists
- ✅ Communities
- ✅ Spaces (audio rooms)
- ✅ Longa AI native assistant
- ✅ Analytics dashboard
- ✅ Drafts
- ✅ Polls
- ✅ Search
- ✅ Keyboard shortcuts

### Backend (PHP)
- ✅ RESTful API
- ✅ MySQL support
- ✅ PostgreSQL support
- ✅ CORS enabled
- ✅ Security headers
- ✅ URL rewriting
- ✅ Sample data

## 📁 Project Structure

```
x-app/
├── backend/                    # PHP Backend API
│   ├── config/
│   │   └── database.php       # Database configuration
│   ├── controllers/
│   │   ├── PostsController.php
│   │   ├── UsersController.php
│   │   ├── NotificationsController.php
│   │   └── MessagesController.php
│   ├── core/
│   │   ├── Database.php       # Database connection
│   │   └── Router.php         # API router
│   ├── database/
│   │   ├── migrations.sql     # MySQL migrations
│   │   └── migrations_pgsql.sql # PostgreSQL migrations
│   ├── .htaccess              # Apache config
│   ├── index.php              # API entry point
│   ├── INSTALLATION.md        # Installation guide
│   └── README.md              # This file
│
├── src/                        # React Frontend
│   ├── api/
│   │   └── phpAdapter.ts      # API adapter
│   ├── components/            # React components
│   ├── database/              # Local database layer
│   ├── hooks/                 # React hooks
│   ├── services/              # Business logic
│   ├── App.tsx                # Main app
│   └── main.tsx               # Entry point
│
└── dist/                       # Build output
```

## 🚀 Quick Start

### 1. Setup Backend

```bash
# Upload backend folder to your hosting
# aaPanel: /home/yourdomain.com/public_html/api/
# cPanel: /public_html/api/

# Setup database
# MySQL: Import backend/database/migrations.sql
# PostgreSQL: Import backend/database/migrations_pgsql.sql

# Configure database
# Edit backend/config/database.php
```

### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Configure API URL
# Edit src/api/phpAdapter.ts
const API_URL = 'https://yourdomain.com/api';

# Build
npm run build

# Upload dist/ to your hosting
```

### 3. Test

Visit: `https://yourdomain.com`

## 📖 Documentation

- [Installation Guide](backend/INSTALLATION.md)
- [API Documentation](backend/README.md)
- [Database Schema](backend/database/migrations.sql)

## 🔧 Configuration

### Backend (backend/config/database.php)

```php
return [
    'driver' => 'mysql', // or 'pgsql'
    
    'mysql' => [
        'host' => 'localhost',
        'database' => 'longa_db',
        'username' => 'root',
        'password' => '',
    ],
    
    'pgsql' => [
        'host' => 'localhost',
        'database' => 'longa_db',
        'username' => 'postgres',
        'password' => '',
    ],
];
```

### Frontend (src/api/phpAdapter.ts)

```typescript
const API_URL = 'https://yourdomain.com/api';
```

## 📊 API Endpoints

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `POST /posts/{id}/like` - Like post
- `POST /posts/{id}/retweet` - Retweet post

### Users
- `GET /users` - Get all users
- `GET /users/{id}` - Get user
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `POST /users/{id}/follow` - Follow user

### Notifications
- `GET /notifications` - Get notifications
- `POST /notifications` - Create notification
- `PUT /notifications/{id}/read` - Mark as read

### Messages
- `GET /messages` - Get conversations
- `POST /messages` - Send message
- `PUT /messages/{id}/read` - Mark as read

## 🎨 Themes

### Dark Mode (Default)
- Background: `#15202b` (dark blue-gray)
- Text: White
- Borders: `#38444d`

### Light Mode
- Background: `#ffffff`
- Text: `#0f1419`
- Borders: `#e1e8ed`

Toggle in Settings → Dark mode

## 🔐 Security

- ✅ Prepared statements (SQL injection protection)
- ✅ CORS configuration
- ✅ Security headers
- ✅ Input validation
- ✅ File access protection

### Production Checklist
- [ ] Disable debug mode
- [ ] Update CORS origins
- [ ] Use HTTPS
- [ ] Implement authentication
- [ ] Add rate limiting
- [ ] Enable error logging
- [ ] Regular backups

## 📦 Dependencies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React
- Framer Motion

### Backend
- PHP 7.4+
- MySQL 5.7+ or PostgreSQL 10+
- Apache with mod_rewrite

## 🐛 Troubleshooting

### Backend not working
- Check PHP error logs
- Verify database credentials
- Check file permissions (755 for folders, 644 for files)
- Ensure .htaccess is enabled

### Frontend not connecting
- Verify API_URL is correct
- Check CORS settings
- Test API endpoints directly
- Check browser console for errors

### Database errors
- Verify database exists
- Check user permissions
- Import migrations.sql
- Check table structure

## 📝 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📞 Support

For issues and questions:
- Check documentation
- Review error logs
- Test API endpoints
- Check database structure

## 🎉 Credits

Built with:
- React
- TypeScript
- Tailwind CSS
- PHP
- MySQL/PostgreSQL

---

**Note:** Hii ni full-stack application. Kwa production, ongeza:
- Authentication system
- File upload handling
- Email notifications
- Caching layer
- CDN integration
- Monitoring & analytics
