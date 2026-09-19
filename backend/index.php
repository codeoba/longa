<?php
/**
 * X App API - Main Entry Point
 * 
 * Installation:
 * 1. Upload this folder to your aaPanel/cPanel (e.g., /home/username/public_html/api/)
 * 2. Import database/migrations.sql to your MySQL/PostgreSQL
 * 3. Update config/database.php with your database credentials
 * 4. Access API at: https://yourdomain.com/api/
 */

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Load core files
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/core/Database.php';

// Load controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PostsController.php';
require_once __DIR__ . '/controllers/UsersController.php';
require_once __DIR__ . '/controllers/NotificationsController.php';
require_once __DIR__ . '/controllers/MessagesController.php';

// Initialize router
$router = new Router();

// Initialize controllers
$authController = new AuthController();
$postsController = new PostsController();
$usersController = new UsersController();
$notificationsController = new NotificationsController();
$messagesController = new MessagesController();

// Health check
$router->get('/', function() {
    jsonResponse([
        'status' => 'ok',
        'message' => 'X App API is running',
        'version' => '1.0.0',
        'endpoints' => [
            'auth' => '/auth',
            'posts' => '/posts',
            'users' => '/users',
            'notifications' => '/notifications',
            'messages' => '/messages'
        ]
    ]);
});

// ==================== AUTH ROUTES ====================
$router->post('/auth/register', [$authController, 'register']);
$router->post('/auth/login', [$authController, 'login']);
$router->post('/auth/logout', [$authController, 'logout']);
$router->get('/auth/me', [$authController, 'me']);
$router->post('/auth/verify-email', [$authController, 'verifyEmail']);
$router->post('/auth/forgot-password', [$authController, 'forgotPassword']);
$router->post('/auth/reset-password', [$authController, 'resetPassword']);
$router->put('/auth/change-password', [$authController, 'changePassword']);

// ==================== POSTS ROUTES ====================
$router->get('/posts', [$postsController, 'index']);
$router->get('/posts/{id}', [$postsController, 'show']);
$router->post('/posts', [$postsController, 'store']);
$router->put('/posts/{id}', [$postsController, 'update']);
$router->delete('/posts/{id}', [$postsController, 'destroy']);
$router->post('/posts/{id}/like', [$postsController, 'like']);
$router->post('/posts/{id}/unlike', [$postsController, 'unlike']);
$router->post('/posts/{id}/retweet', [$postsController, 'retweet']);

// ==================== USERS ROUTES ====================
$router->get('/users', [$usersController, 'index']);
$router->get('/users/search', [$usersController, 'search']);
$router->get('/users/{id}', [$usersController, 'show']);
$router->post('/users', [$usersController, 'store']);
$router->put('/users/{id}', [$usersController, 'update']);
$router->delete('/users/{id}', [$usersController, 'destroy']);
$router->post('/users/{id}/follow', [$usersController, 'follow']);
$router->post('/users/{id}/unfollow', [$usersController, 'unfollow']);

// ==================== NOTIFICATIONS ROUTES ====================
$router->get('/notifications', [$notificationsController, 'index']);
$router->get('/notifications/unread-count', [$notificationsController, 'unreadCount']);
$router->post('/notifications', [$notificationsController, 'store']);
$router->put('/notifications/{id}/read', [$notificationsController, 'markAsRead']);
$router->put('/notifications/read-all', [$notificationsController, 'markAllAsRead']);

// ==================== MESSAGES ROUTES ====================
$router->get('/messages', [$messagesController, 'index']);
$router->get('/messages/unread-count', [$messagesController, 'unreadCount']);
$router->get('/messages/{conversation_id}', [$messagesController, 'show']);
$router->post('/messages', [$messagesController, 'store']);
$router->put('/messages/{id}/read', [$messagesController, 'markAsRead']);
$router->put('/messages/read-all', [$messagesController, 'markAllAsRead']);

// Dispatch the request
$router->dispatch();
