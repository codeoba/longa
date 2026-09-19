<?php
require_once __DIR__ . '/../core/Database.php';

class AuthController {
    private $db;
    private $config;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->config = require __DIR__ . '/../config/database.php';
    }
    
    // POST /auth/register - Register new user
    public function register($params) {
        $input = getJsonInput();
        
        // Validate required fields
        $required = ['name', 'handle', 'email', 'password'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                jsonResponse(['error' => "Field '{$field}' is required"], 400);
            }
        }
        
        // Validate email
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['error' => 'Invalid email format'], 400);
        }
        
        // Validate password length
        if (strlen($input['password']) < 8) {
            jsonResponse(['error' => 'Password must be at least 8 characters'], 400);
        }
        
        // Validate handle format
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $input['handle'])) {
            jsonResponse(['error' => 'Handle can only contain letters, numbers, and underscores'], 400);
        }
        
        // Check if email already exists
        $existingEmail = $this->db->fetchOne(
            "SELECT id FROM users WHERE email = ?",
            [$input['email']]
        );
        
        if ($existingEmail) {
            jsonResponse(['error' => 'Email already registered'], 409);
        }
        
        // Check if handle already exists
        $existingHandle = $this->db->fetchOne(
            "SELECT id FROM users WHERE handle = ?",
            ['@' . ltrim($input['handle'], '@')]
        );
        
        if ($existingHandle) {
            jsonResponse(['error' => 'Handle already taken'], 409);
        }
        
        // Hash password
        $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);
        
        // Create user
        $data = [
            'name' => $input['name'],
            'handle' => '@' . ltrim($input['handle'], '@'),
            'email' => $input['email'],
            'password_hash' => $passwordHash,
            'avatar' => $input['avatar'] ?? '👤',
            'bio' => $input['bio'] ?? '',
            'verified' => false,
            'premium' => false,
            'followers' => 0,
            'following' => 0,
            'posts' => 0,
            'location' => $input['location'] ?? null,
            'website' => $input['website'] ?? null,
            'email_verified' => false,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $userId = $this->db->insert('users', $data);
        
        // Generate verification token
        $verificationToken = bin2hex(random_bytes(32));
        $this->db->insert('email_verifications', [
            'user_id' => $userId,
            'token' => $verificationToken,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+24 hours'))
        ]);
        
        // TODO: Send verification email
        
        // Generate JWT token
        $token = $this->generateToken($userId);
        
        jsonResponse([
            'message' => 'Registration successful',
            'user' => [
                'id' => $userId,
                'name' => $data['name'],
                'handle' => $data['handle'],
                'email' => $data['email'],
                'avatar' => $data['avatar']
            ],
            'token' => $token,
            'verification_required' => true
        ], 201);
    }
    
    // POST /auth/login - Login user
    public function login($params) {
        $input = getJsonInput();
        
        // Validate input
        if (!isset($input['email']) || !isset($input['password'])) {
            jsonResponse(['error' => 'Email and password are required'], 400);
        }
        
        // Find user by email
        $user = $this->db->fetchOne(
            "SELECT * FROM users WHERE email = ?",
            [$input['email']]
        );
        
        if (!$user) {
            jsonResponse(['error' => 'Invalid credentials'], 401);
        }
        
        // Verify password
        if (!password_verify($input['password'], $user['password_hash'])) {
            jsonResponse(['error' => 'Invalid credentials'], 401);
        }
        
        // Check if email is verified
        if (!$user['email_verified']) {
            jsonResponse([
                'error' => 'Please verify your email first',
                'verification_required' => true
            ], 403);
        }
        
        // Generate JWT token
        $token = $this->generateToken($user['id']);
        
        // Update last login
        $this->db->update('users', [
            'last_login' => date('Y-m-d H:i:s')
        ], 'id = ?', [$user['id']]);
        
        jsonResponse([
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'handle' => $user['handle'],
                'email' => $user['email'],
                'avatar' => $user['avatar'],
                'verified' => (bool)$user['verified'],
                'premium' => (bool)$user['premium']
            ],
            'token' => $token
        ]);
    }
    
    // POST /auth/logout - Logout user
    public function logout($params) {
        // In a real app, you'd invalidate the token here
        // For now, just return success
        jsonResponse(['message' => 'Logout successful']);
    }
    
    // GET /auth/me - Get current user
    public function me($params) {
        $token = $this->getBearerToken();
        
        if (!$token) {
            jsonResponse(['error' => 'Unauthorized'], 401);
        }
        
        $userId = $this->validateToken($token);
        
        if (!$userId) {
            jsonResponse(['error' => 'Invalid token'], 401);
        }
        
        $user = $this->db->fetchOne(
            "SELECT id, name, handle, email, avatar, bio, verified, premium, followers, following, posts, location, website, created_at 
             FROM users WHERE id = ?",
            [$userId]
        );
        
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        jsonResponse(['user' => $user]);
    }
    
    // POST /auth/verify-email - Verify email
    public function verifyEmail($params) {
        $input = getJsonInput();
        
        if (!isset($input['token'])) {
            jsonResponse(['error' => 'Verification token is required'], 400);
        }
        
        // Find verification record
        $verification = $this->db->fetchOne(
            "SELECT * FROM email_verifications WHERE token = ? AND expires_at > NOW()",
            [$input['token']]
        );
        
        if (!$verification) {
            jsonResponse(['error' => 'Invalid or expired token'], 400);
        }
        
        // Mark email as verified
        $this->db->update('users', [
            'email_verified' => true
        ], 'id = ?', [$verification['user_id']]);
        
        // Delete verification record
        $this->db->delete('email_verifications', 'id = ?', [$verification['id']]);
        
        jsonResponse(['message' => 'Email verified successfully']);
    }
    
    // POST /auth/forgot-password - Request password reset
    public function forgotPassword($params) {
        $input = getJsonInput();
        
        if (!isset($input['email'])) {
            jsonResponse(['error' => 'Email is required'], 400);
        }
        
        $user = $this->db->fetchOne(
            "SELECT id FROM users WHERE email = ?",
            [$input['email']]
        );
        
        if (!$user) {
            // Don't reveal if email exists
            jsonResponse(['message' => 'If the email exists, a reset link has been sent']);
        }
        
        // Generate reset token
        $resetToken = bin2hex(random_bytes(32));
        
        // Delete any existing reset tokens
        $this->db->delete('password_resets', 'user_id = ?', [$user['id']]);
        
        // Create new reset token
        $this->db->insert('password_resets', [
            'user_id' => $user['id'],
            'token' => $resetToken,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+1 hour'))
        ]);
        
        // TODO: Send reset email with link: /reset-password?token={resetToken}
        
        jsonResponse(['message' => 'If the email exists, a reset link has been sent']);
    }
    
    // POST /auth/reset-password - Reset password
    public function resetPassword($params) {
        $input = getJsonInput();
        
        if (!isset($input['token']) || !isset($input['password'])) {
            jsonResponse(['error' => 'Token and password are required'], 400);
        }
        
        if (strlen($input['password']) < 8) {
            jsonResponse(['error' => 'Password must be at least 8 characters'], 400);
        }
        
        // Find reset record
        $reset = $this->db->fetchOne(
            "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
            [$input['token']]
        );
        
        if (!$reset) {
            jsonResponse(['error' => 'Invalid or expired token'], 400);
        }
        
        // Update password
        $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);
        $this->db->update('users', [
            'password_hash' => $passwordHash
        ], 'id = ?', [$reset['user_id']]);
        
        // Delete reset token
        $this->db->delete('password_resets', 'id = ?', [$reset['id']]);
        
        jsonResponse(['message' => 'Password reset successfully']);
    }
    
    // PUT /auth/change-password - Change password (authenticated)
    public function changePassword($params) {
        $token = $this->getBearerToken();
        
        if (!$token) {
            jsonResponse(['error' => 'Unauthorized'], 401);
        }
        
        $userId = $this->validateToken($token);
        
        if (!$userId) {
            jsonResponse(['error' => 'Invalid token'], 401);
        }
        
        $input = getJsonInput();
        
        if (!isset($input['current_password']) || !isset($input['new_password'])) {
            jsonResponse(['error' => 'Current password and new password are required'], 400);
        }
        
        // Get current user
        $user = $this->db->fetchOne("SELECT password_hash FROM users WHERE id = ?", [$userId]);
        
        // Verify current password
        if (!password_verify($input['current_password'], $user['password_hash'])) {
            jsonResponse(['error' => 'Current password is incorrect'], 400);
        }
        
        // Validate new password
        if (strlen($input['new_password']) < 8) {
            jsonResponse(['error' => 'New password must be at least 8 characters'], 400);
        }
        
        // Update password
        $passwordHash = password_hash($input['new_password'], PASSWORD_BCRYPT);
        $this->db->update('users', [
            'password_hash' => $passwordHash
        ], 'id = ?', [$userId]);
        
        jsonResponse(['message' => 'Password changed successfully']);
    }
    
    // Helper: Generate JWT token
    private function generateToken($userId) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $userId,
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ]);
        
        $base64Header = base64_encode($header);
        $base64Payload = base64_encode($payload);
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, 'your-secret-key-change-this');
        $base64Signature = base64_encode($signature);
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    // Helper: Validate JWT token
    private function validateToken($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        list($base64Header, $base64Payload, $base64Signature) = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, 'your-secret-key-change-this');
        $base64SignatureCheck = base64_encode($signature);
        
        if ($base64Signature !== $base64SignatureCheck) {
            return false;
        }
        
        // Decode payload
        $payload = json_decode(base64_decode($base64Payload), true);
        
        // Check expiration
        if ($payload['exp'] < time()) {
            return false;
        }
        
        return $payload['user_id'];
    }
    
    // Helper: Get bearer token from headers
    private function getBearerToken() {
        $headers = getallheaders();
        
        if (!isset($headers['Authorization'])) {
            return null;
        }
        
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
        
        return null;
    }
}
