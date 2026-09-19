<?php
require_once __DIR__ . '/../core/Database.php';

class NotificationsController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // GET /notifications - Get user notifications
    public function index($params) {
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        
        if (!$userId) {
            jsonResponse(['error' => 'user_id is required'], 400);
        }
        
        $sql = "SELECT n.*, u.name as from_user_name, u.handle as from_user_handle, u.avatar as from_user_avatar
                FROM notifications n
                JOIN users u ON n.from_user_id = u.id
                WHERE n.user_id = ?
                ORDER BY n.created_at DESC
                LIMIT ?";
        $notifications = $this->db->fetchAll($sql, [$userId, $limit]);
        
        jsonResponse(['notifications' => $notifications]);
    }
    
    // POST /notifications - Create notification
    public function store($params) {
        $input = getJsonInput();
        
        $required = ['user_id', 'type', 'from_user_id'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                jsonResponse(['error' => "Field '{$field}' is required"], 400);
            }
        }
        
        $data = [
            'user_id' => $input['user_id'],
            'type' => $input['type'],
            'from_user_id' => $input['from_user_id'],
            'post_id' => $input['post_id'] ?? null,
            'content' => $input['content'] ?? null,
            'read' => false,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $id = $this->db->insert('notifications', $data);
        
        jsonResponse([
            'message' => 'Notification created',
            'notification_id' => $id
        ], 201);
    }
    
    // PUT /notifications/{id}/read - Mark as read
    public function markAsRead($params) {
        $id = $params['id'];
        
        $this->db->update('notifications', ['read' => true], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Notification marked as read']);
    }
    
    // PUT /notifications/read-all - Mark all as read
    public function markAllAsRead($params) {
        $input = getJsonInput();
        $userId = $input['user_id'] ?? null;
        
        if (!$userId) {
            jsonResponse(['error' => 'user_id is required'], 400);
        }
        
        $this->db->update('notifications', ['read' => true], 'user_id = ?', [$userId]);
        
        jsonResponse(['message' => 'All notifications marked as read']);
    }
    
    // GET /notifications/unread-count - Get unread count
    public function unreadCount($params) {
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        if (!$userId) {
            jsonResponse(['error' => 'user_id is required'], 400);
        }
        
        $result = $this->db->fetchOne(
            "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = FALSE",
            [$userId]
        );
        
        jsonResponse(['unread_count' => (int)$result['count']]);
    }
}
