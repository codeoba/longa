<?php
require_once __DIR__ . '/../core/Database.php';

class MessagesController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // GET /messages - Get conversations
    public function index($params) {
        $userId = requireAuth();
        
        // Get all conversations for user
        $sql = "SELECT DISTINCT conversation_id, 
                MAX(created_at) as last_message_at
                FROM messages
                WHERE sender_id = ? OR conversation_id LIKE ?
                GROUP BY conversation_id
                ORDER BY last_message_at DESC";
        
        $conversations = $this->db->fetchAll($sql, [$userId, "%_{$userId}_%"]);
        
        jsonResponse(['conversations' => $conversations]);
    }
    
    // GET /messages/{conversation_id} - Get messages in conversation
    public function show($params) {
        $userId = requireAuth();
        $conversationId = $params['conversation_id'];
        $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 50;
        
        $sql = "SELECT m.*, u.name as sender_name, u.handle as sender_handle, u.avatar as sender_avatar
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE m.conversation_id = ?
                ORDER BY m.created_at DESC
                LIMIT {$limit}";
        $messages = $this->db->fetchAll($sql, [$conversationId]);
        
        jsonResponse(['messages' => array_reverse($messages)]);
    }
    
    // POST /messages - Send message (Protected)
    public function store($params) {
        $authenticatedUserId = requireAuth();
        $input = getJsonInput();
        
        $required = ['conversation_id', 'content'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                jsonResponse(['error' => "Field '{$field}' is required"], 400);
            }
        }
        
        $data = [
            'conversation_id' => $input['conversation_id'],
            'sender_id' => $authenticatedUserId,
            'content' => trim($input['content']),
            'read' => false,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $id = $this->db->insert('messages', $data);
        
        jsonResponse([
            'message' => 'Message sent',
            'message_id' => (string)$id
        ], 201);
    }
    
    // PUT /messages/{id}/read - Mark message as read (Protected)
    public function markAsRead($params) {
        requireAuth();
        $id = $params['id'];
        
        $this->db->update('messages', ['read' => true], 'id = ?', [$id]);
        jsonResponse(['message' => 'Message marked as read']);
    }
    
    // PUT /messages/read-all - Mark all messages in conversation as read (Protected)
    public function markAllAsRead($params) {
        $authenticatedUserId = requireAuth();
        $input = getJsonInput();
        $conversationId = $input['conversation_id'] ?? null;
        
        if (!$conversationId) {
            jsonResponse(['error' => 'conversation_id is required'], 400);
        }
        
        $this->db->update(
            'messages',
            ['read' => true],
            'conversation_id = ? AND sender_id != ?',
            [$conversationId, $authenticatedUserId]
        );
        
        jsonResponse(['message' => 'All messages marked as read']);
    }
    
    // GET /messages/unread-count - Get unread messages count (Protected)
    public function unreadCount($params) {
        $userId = requireAuth();
        
        // Count unread messages in conversations where current user is a participant but not the sender
        $result = $this->db->fetchOne(
            "SELECT COUNT(*) as count FROM messages 
             WHERE sender_id != ? AND read = FALSE AND (conversation_id LIKE ? OR conversation_id LIKE ?)",
            [$userId, "%_{$userId}_%", "{$userId}_%"]
        );
        
        jsonResponse(['unread_count' => (int)($result['count'] ?? 0)]);
    }
}

