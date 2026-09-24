<?php
/**
 * Longa API - Main Entry Point
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

// Support static files when running under PHP built-in web server
if (php_sapi_name() === 'cli-server') {
    $file = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file($file)) {
        return false;
    }
}

// Load core files
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/core/Database.php';

// Load controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PostsController.php';
require_once __DIR__ . '/controllers/UsersController.php';
require_once __DIR__ . '/controllers/NotificationsController.php';
require_once __DIR__ . '/controllers/MessagesController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/RealtimeController.php';
require_once __DIR__ . '/controllers/AiController.php';
require_once __DIR__ . '/controllers/SignalingController.php';
require_once __DIR__ . '/controllers/PaymentController.php';
require_once __DIR__ . '/controllers/StoreController.php';
require_once __DIR__ . '/controllers/BountyController.php';
require_once __DIR__ . '/controllers/AdminController.php';

// Initialize router
$router = new Router();

// Initialize controllers
$authController = new AuthController();
$postsController = new PostsController();
$usersController = new UsersController();
$notificationsController = new NotificationsController();
$messagesController = new MessagesController();
$uploadController = new UploadController();
$realtimeController = new RealtimeController();
$aiController = new AiController();
$signalingController = new SignalingController();
$paymentController = new PaymentController();
$storeController = new StoreController();
$bountyController = new BountyController();
$adminController = new AdminController();

// Health check
$router->get('/', function() {
    jsonResponse([
        'status' => 'ok',
        'message' => 'Longa API is running',
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

// ==================== UPLOAD ROUTES ====================
$router->post('/upload', [$uploadController, 'upload']);

// ==================== REALTIME SSE ROUTES ====================
$router->get('/realtime/stream', [$realtimeController, 'stream']);

// ==================== AI ASSISTANT & IMAGE ROUTES ====================
$router->get('/ai/providers', [$aiController, 'getProviders']);
$router->post('/ai/test-key', [$aiController, 'testKey']);
$router->post('/ai/chat', [$aiController, 'chat']);
$router->post('/ai/generate-image', [$aiController, 'generateImage']);
$router->post('/ai/transform-text', [$aiController, 'transformText']);
$router->post('/ai/co-pilot', [$aiController, 'coPilot']);

// ==================== CREATOR STORE & DIGITAL MARKETPLACE ====================
$router->get('/store/products', [$storeController, 'index']);
$router->post('/store/products', [$storeController, 'store']);
$router->post('/store/buy', [$storeController, 'buy']);

// ==================== CREATOR BOUNTIES & CHALLENGES ====================
$router->get('/bounties', [$bountyController, 'index']);
$router->post('/bounties', [$bountyController, 'store']);
$router->post('/bounties/{id}/submit', [$bountyController, 'submit']);
$router->post('/bounties/{id}/award', [$bountyController, 'award']);

// ==================== WEBRTC SIGNALING ROUTES ====================
$router->get('/signaling/rooms', [$signalingController, 'rooms']);
$router->post('/signaling/offer', [$signalingController, 'sendOffer']);
$router->post('/signaling/answer', [$signalingController, 'sendAnswer']);
$router->post('/signaling/candidate', [$signalingController, 'sendCandidate']);
$router->get('/signaling/poll', [$signalingController, 'poll']);
$router->post('/signaling/close', [$signalingController, 'closeRoom']);

// ==================== PAYMENTS & MONETIZATION ROUTES ====================
$router->post('/payments/create-session', [$paymentController, 'createSession']);
$router->post('/payments/verify', [$paymentController, 'verify']);
$router->post('/payments/tip', [$paymentController, 'tip']);
$router->get('/payments/earnings', [$paymentController, 'earnings']);

// ==================== ADMIN PANEL GOVERNANCE ROUTES ====================
$router->get('/admin/stats', [$adminController, 'getStats']);
$router->get('/admin/features', [$adminController, 'getFeatures']);
$router->post('/admin/features', [$adminController, 'updateFeatures']);
$router->get('/admin/users', [$adminController, 'getUsers']);
$router->post('/admin/users/{id}/action', [$adminController, 'userAction']);
$router->get('/admin/moderation', [$adminController, 'getModeration']);
$router->delete('/admin/posts/{id}', [$adminController, 'deletePost']);
$router->get('/admin/payouts', [$adminController, 'getPayouts']);
$router->post('/admin/payouts/{id}/action', [$adminController, 'processPayout']);
$router->get('/admin/audit-logs', [$adminController, 'getAuditLogs']);

// Dispatch the request
$router->dispatch();
