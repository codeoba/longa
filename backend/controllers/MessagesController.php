<?php
require_once __DIR__ . '/../core/Database.php';

class MessagesController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // GET /messages - Get conversations
    public function index($params) {
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        if (!$userId) {
            jsonResponse(['error' => 'user_id is required'], 400);
        }
        
        // Get all conversations for user
        $sql = "SELECT DISTINCT conversation_id, 
                MAX(created_at) as last_message_at
                FROM messages
                WHERE sender_id = ? OR conversation_id LIKE ?
                GROUP BY conversation_id
                ORDER BY last_message_at DESC";
        
        $conversations = $this->db->fetchAll($sql, [$userId, "%{$userId}%"]);
        
        jsonResponse(['conversations' => $conversations]);
    }
    
    // GET /messages/{conversation_id} - Get messages in conversation
    public function show($params) {
        $conversationId = $params['conversation_id'];
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        
        $sql = "SELECT m.*, u.name as sender_name, u.handle as sender_handle, u.avatar as sender_avatar
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE m.conversation_id = ?
                ORDER BY m.created_at DESC
                LIMIT ?";
        $messages = $this->db->fetchAll($sql, [$conversationId, $limit]);
        
        jsonResponse(['messages' => array_reverse($messages)]);
    }
    
    // POST /messages - Send message
    public function store($params) {
        $input = getJsonInput();
        
        $required = ['conversation_id', 'sender_id', 'content'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                jsonResponse(['error' => "Field '{$field}' is required"], 400);
            }
        }
        
        $data = [
            'conversation_id' => $input['conversation_id'],
            'sender_id' => $input['sender_id'],
            'content' => $input['content'],
            'read' => false,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $id = $this->db->insert('messages', $data);
        
        jsonResponse([
            'message' => 'Message sent',
            'message_id' => $id
        ], 201);
    }
    
    // PUT /messages/{id}/read - Mark message as read
    public function markAsRead($params) {
        $id = $params['id'];
        
        $this->db->update('messages', ['read' => true], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Message marked as read']);
    }
    
    // PUT /messages/read-all - Mark all messages in conversation as read
    public function markAllAsRead($params) {
        $input = getJsonInput();
        $conversationId = $input['conversation_id'] ?? null;
        $userId = $input['user_id'] ?? null;
        
        if (!$conversationId || !$userId) {
            jsonResponse(['error' => 'conversation_id and user_id are required'], 400);
        }
        
        $this->db->update(
            'messages',
            ['read' => true],
            'conversation_id = ? AND sender_id != ?',
            [$conversationId, $userId]
        );
        
        jsonResponse(['message' => 'All messages marked as read']);
    }
    
    // GET /messages/unread-count - Get unread messages count
    public function unreadCount($params) {
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        if (!$userId) {
            jsonResponse(['error' => 'user_id is required'], 400);
        }
        
        $result = $this->db->fetchOne(
            "SELECT COUNT(*) as count FROM messages WHERE sender_id != ? AND read = FALSE",
            [$userId]
        );
        
        jsonResponse(['unread_count' => (int)$result['count']]);
    }
}
