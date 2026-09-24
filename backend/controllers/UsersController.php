<?php
require_once __DIR__ . '/../core/Database.php';

class UsersController {
    private $db;
    
    // Whitelisted public fields that NEVER leak sensitive columns like password_hash
    private const SAFE_COLUMNS = "id, name, handle, email, avatar, bio, verified, premium, followers, following, posts, location, website, created_at";
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // GET /users - Get all users (sanitized)
    public function index($params) {
        $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 50;
        $offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
        
        $sql = "SELECT " . self::SAFE_COLUMNS . " FROM users ORDER BY created_at DESC LIMIT {$limit} OFFSET {$offset}";
        $users = $this->db->fetchAll($sql);
        
        $users = array_map(function($u) {
            $u['id'] = (string)$u['id'];
            $u['verified'] = (bool)$u['verified'];
            $u['premium'] = (bool)$u['premium'];
            return $u;
        }, $users);
        
        jsonResponse(['users' => $users]);
    }
    
    // GET /users/{id} - Get single user
    public function show($params) {
        $id = $params['id'];
        
        $sql = "SELECT " . self::SAFE_COLUMNS . " FROM users WHERE id = ? OR handle = ?";
        $user = $this->db->fetchOne($sql, [$id, $id]);
        
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $user['id'] = (string)$user['id'];
        $user['verified'] = (bool)$user['verified'];
        $user['premium'] = (bool)$user['premium'];
        
        jsonResponse(['user' => $user]);
    }
    
    // POST /users - Create new user (Admin / internal use; general registration uses /auth/register)
    public function store($params) {
        $input = getJsonInput();
        
        $required = ['name', 'handle', 'email'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                jsonResponse(['error' => "Field '{$field}' is required"], 400);
            }
        }
        
        $handle = '@' . ltrim($input['handle'], '@');
        
        // Check if handle or email already exists
        $existing = $this->db->fetchOne(
            "SELECT id FROM users WHERE handle = ? OR email = ?",
            [$handle, $input['email']]
        );
        
        if ($existing) {
            jsonResponse(['error' => 'Handle or email already exists'], 409);
        }
        
        $password = $input['password'] ?? bin2hex(random_bytes(8));
        $data = [
            'name' => $input['name'],
            'handle' => $handle,
            'email' => $input['email'],
            'password_hash' => password_hash($password, PASSWORD_BCRYPT),
            'avatar' => $input['avatar'] ?? '👤',
            'bio' => $input['bio'] ?? '',
            'verified' => false,
            'premium' => false,
            'followers' => 0,
            'following' => 0,
            'posts' => 0,
            'location' => $input['location'] ?? null,
            'website' => $input['website'] ?? null,
            'email_verified' => true,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $id = $this->db->insert('users', $data);
        
        jsonResponse([
            'message' => 'User created successfully',
            'user_id' => (string)$id
        ], 201);
    }
    
    // PUT /users/{id} - Update user profile (Protected)
    public function update($params) {
        $authenticatedUserId = requireAuth();
        $id = $params['id'];
        
        // Only allow updating own profile
        if ((string)$authenticatedUserId !== (string)$id) {
            jsonResponse(['error' => 'Forbidden: You can only update your own profile'], 403);
        }
        
        $user = $this->db->fetchOne("SELECT id FROM users WHERE id = ?", [$id]);
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $input = getJsonInput();
        $data = [];
        
        // Safe profile fields user can update
        $allowedFields = ['name', 'bio', 'avatar', 'location', 'website'];
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
        
        $updatedUser = $this->db->fetchOne("SELECT " . self::SAFE_COLUMNS . " FROM users WHERE id = ?", [$id]);
        $updatedUser['id'] = (string)$updatedUser['id'];
        $updatedUser['verified'] = (bool)$updatedUser['verified'];
        $updatedUser['premium'] = (bool)$updatedUser['premium'];
        
        jsonResponse(['message' => 'User updated successfully', 'user' => $updatedUser]);
    }
    
    // DELETE /users/{id} - Delete user account (Protected)
    public function destroy($params) {
        $authenticatedUserId = requireAuth();
        $id = $params['id'];
        
        if ((string)$authenticatedUserId !== (string)$id) {
            jsonResponse(['error' => 'Forbidden: You can only delete your own account'], 403);
        }
        
        $user = $this->db->fetchOne("SELECT id FROM users WHERE id = ?", [$id]);
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $this->db->delete('users', 'id = ?', [$id]);
        jsonResponse(['message' => 'User deleted successfully']);
    }
    
    // POST /users/{id}/follow - Follow a user (Protected)
    public function follow($params) {
        $followerId = requireAuth();
        $id = $params['id'];
        
        if ((string)$followerId === (string)$id) {
            jsonResponse(['error' => 'You cannot follow yourself'], 400);
        }
        
        $targetUser = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
        if (!$targetUser) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $this->db->update('users', ['followers' => $targetUser['followers'] + 1], 'id = ?', [$id]);
        
        // Also update following count for current user
        $currentUser = $this->db->fetchOne("SELECT following FROM users WHERE id = ?", [$followerId]);
        if ($currentUser) {
            $this->db->update('users', ['following' => $currentUser['following'] + 1], 'id = ?', [$followerId]);
        }
        
        jsonResponse(['message' => 'User followed', 'followers' => $targetUser['followers'] + 1]);
    }
    
    // POST /users/{id}/unfollow - Unfollow a user (Protected)
    public function unfollow($params) {
        $followerId = requireAuth();
        $id = $params['id'];
        
        $targetUser = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
        if (!$targetUser) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        $newFollowers = max(0, $targetUser['followers'] - 1);
        $this->db->update('users', ['followers' => $newFollowers], 'id = ?', [$id]);
        
        $currentUser = $this->db->fetchOne("SELECT following FROM users WHERE id = ?", [$followerId]);
        if ($currentUser) {
            $newFollowing = max(0, $currentUser['following'] - 1);
            $this->db->update('users', ['following' => $newFollowing], 'id = ?', [$followerId]);
        }
        
        jsonResponse(['message' => 'User unfollowed', 'followers' => $newFollowers]);
    }
    
    // GET /users/search - Search users (sanitized)
    public function search($params) {
        $query = isset($_GET['q']) ? trim($_GET['q']) : '';
        $limit = isset($_GET['limit']) ? max(1, min(50, (int)$_GET['limit'])) : 20;
        
        if (empty($query)) {
            jsonResponse(['error' => 'Search query is required'], 400);
        }
        
        $sql = "SELECT " . self::SAFE_COLUMNS . " FROM users 
                WHERE name LIKE ? OR handle LIKE ? 
                ORDER BY followers DESC 
                LIMIT {$limit}";
        $users = $this->db->fetchAll($sql, ["%{$query}%", "%{$query}%"]);
        
        $users = array_map(function($u) {
            $u['id'] = (string)$u['id'];
            $u['verified'] = (bool)$u['verified'];
            $u['premium'] = (bool)$u['premium'];
            return $u;
        }, $users);
        
        jsonResponse(['users' => $users]);
    }
}

