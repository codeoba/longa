<?php
require_once __DIR__ . '/../core/Database.php';

class UsersController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // GET /users - Get all users
    public function index($params) {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $sql = "SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $users = $this->db->fetchAll($sql, [$limit, $offset]);
        
        jsonResponse(['users' => $users]);
    }
    
    // GET /users/{id} - Get single user
    public function show($params) {
        $id = $params['id'];
        
        $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
        
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        jsonResponse(['user' => $user]);
    }
    
    // POST /users - Create new user
    public function store($params) {
        $input = getJsonInput();
        
        $required = ['name', 'handle', 'email'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                jsonResponse(['error' => "Field '{$field}' is required"], 400);
            }
        }
        
        // Check if handle or email already exists
        $existing = $this->db->fetchOne(
            "SELECT id FROM users WHERE handle = ? OR email = ?",
            [$input['handle'], $input['email']]
        );
        
        if ($existing) {
            jsonResponse(['error' => 'Handle or email already exists'], 409);
        }
        
        $data = [
            'name' => $input['name'],
            'handle' => $input['handle'],
            'email' => $input['email'],
            'avatar' => $input['avatar'] ?? '👤',
            'bio' => $input['bio'] ?? '',
            'verified' => $input['verified'] ?? false,
            'premium' => $input['premium'] ?? false,
            'followers' => 0,
            'following' => 0,
            'posts' => 0,
            'location' => $input['location'] ?? null,
            'website' => $input['website'] ?? null,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $id = $this->db->insert('users', $data);
        
        jsonResponse([
            'message' => 'User created successfully',
            'user_id' => $id
        ], 201);
    }
    
    // PUT /users/{id} - Update user
    public function update($params) {
        $id = $params['id'];
        $input = getJsonInput();
        
        $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $data = [];
        $allowedFields = ['name', 'bio', 'avatar', 'location', 'website', 'verified', 'premium'];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }
        
        if (empty($data)) {
            jsonResponse(['error' => 'No valid fields to update'], 400);
        }
        
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        $this->db->update('users', $data, 'id = ?', [$id]);
        
        jsonResponse(['message' => 'User updated successfully']);
    }
    
    // DELETE /users/{id} - Delete user
    public function destroy($params) {
        $id = $params['id'];
        
        $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $this->db->delete('users', 'id = ?', [$id]);
        
        jsonResponse(['message' => 'User deleted successfully']);
    }
    
    // POST /users/{id}/follow - Follow a user
    public function follow($params) {
        $id = $params['id'];
        $input = getJsonInput();
        $followerId = $input['follower_id'] ?? null;
        
        if (!$followerId) {
            jsonResponse(['error' => 'follower_id is required'], 400);
        }
        
        $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $this->db->update('users', ['followers' => $user['followers'] + 1], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'User followed', 'followers' => $user['followers'] + 1]);
    }
    
    // POST /users/{id}/unfollow - Unfollow a user
    public function unfollow($params) {
        $id = $params['id'];
        
        $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $newFollowers = max(0, $user['followers'] - 1);
        $this->db->update('users', ['followers' => $newFollowers], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'User unfollowed', 'followers' => $newFollowers]);
    }
    
    // GET /users/search - Search users
    public function search($params) {
        $query = isset($_GET['q']) ? $_GET['q'] : '';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        
        if (empty($query)) {
            jsonResponse(['error' => 'Search query is required'], 400);
        }
        
        $sql = "SELECT * FROM users 
                WHERE name LIKE ? OR handle LIKE ? 
                ORDER BY followers DESC 
                LIMIT ?";
        $users = $this->db->fetchAll($sql, ["%{$query}%", "%{$query}%", $limit]);
        
        jsonResponse(['users' => $users]);
    }
}
