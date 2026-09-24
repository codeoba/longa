<?php
require_once __DIR__ . '/../core/Database.php';

class PostsController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // GET /posts - Get all posts
    public function index($params) {
        $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 20;
        $offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        if ($userId) {
            $sql = "SELECT p.*, u.name as user_name, u.handle as user_handle, u.avatar as user_avatar, u.verified as user_verified, u.premium as user_premium 
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id 
                    WHERE p.user_id = ? 
                    ORDER BY p.created_at DESC 
                    LIMIT {$limit} OFFSET {$offset}";
            $posts = $this->db->fetchAll($sql, [$userId]);
        } else {
            $sql = "SELECT p.*, u.name as user_name, u.handle as user_handle, u.avatar as user_avatar, u.verified as user_verified, u.premium as user_premium 
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id 
                    ORDER BY p.created_at DESC 
                    LIMIT {$limit} OFFSET {$offset}";
            $posts = $this->db->fetchAll($sql);
        }
        
        $posts = array_map(function($p) {
            $p['id'] = (string)$p['id'];
            $p['user_id'] = (string)$p['user_id'];
            $p['likes'] = (int)$p['likes'];
            $p['retweets'] = (int)$p['retweets'];
            $p['replies'] = (int)$p['replies'];
            $p['views'] = (int)$p['views'];
            $p['bookmarks'] = (int)$p['bookmarks'];
            $p['pinned'] = (bool)($p['pinned'] ?? false);
            return $p;
        }, $posts);
        
        jsonResponse(['posts' => $posts]);
    }
    
    // GET /posts/{id} - Get single post
    public function show($params) {
        $id = $params['id'];
        
        $sql = "SELECT p.*, u.name as user_name, u.handle as user_handle, u.avatar as user_avatar, u.verified as user_verified, u.premium as user_premium 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                WHERE p.id = ?";
        $post = $this->db->fetchOne($sql, [$id]);
        
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $post['id'] = (string)$post['id'];
        $post['user_id'] = (string)$post['user_id'];
        $post['likes'] = (int)$post['likes'];
        $post['retweets'] = (int)$post['retweets'];
        $post['replies'] = (int)$post['replies'];
        $post['views'] = (int)$post['views'];
        $post['bookmarks'] = (int)$post['bookmarks'];
        
        jsonResponse(['post' => $post]);
    }
    
    // POST /posts - Create new post (Protected)
    public function store($params) {
        $authenticatedUserId = requireAuth();
        $input = getJsonInput();
        
        if (!isset($input['content']) || empty(trim($input['content']))) {
            jsonResponse(['error' => "Field 'content' is required"], 400);
        }
        
        $content = trim($input['content']);
        if (mb_strlen($content) > 1000) {
            jsonResponse(['error' => 'Post content exceeds maximum length'], 400);
        }
        
        $data = [
            'user_id' => $authenticatedUserId,
            'content' => $content,
            'image' => $input['image'] ?? null,
            'likes' => 0,
            'retweets' => 0,
            'replies' => 0,
            'views' => 0,
            'bookmarks' => 0,
            'pinned' => false,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $id = $this->db->insert('posts', $data);
        
        // Also increment posts count for user
        $this->db->query("UPDATE users SET posts = posts + 1 WHERE id = ?", [$authenticatedUserId]);
        
        jsonResponse([
            'message' => 'Post created successfully',
            'post_id' => (string)$id
        ], 201);
    }
    
    // PUT /posts/{id} - Update post (Protected)
    public function update($params) {
        $authenticatedUserId = requireAuth();
        $id = $params['id'];
        $input = getJsonInput();
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        // Only author can edit post
        if ((string)$post['user_id'] !== (string)$authenticatedUserId) {
            jsonResponse(['error' => 'Forbidden: You can only edit your own posts'], 403);
        }
        
        $data = [];
        $allowedFields = ['content', 'image', 'pinned'];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }
        
        if (empty($data)) {
            jsonResponse(['error' => 'No valid fields to update'], 400);
        }
        
        $data['updated_at'] = date('Y-m-d H:i:s');
        $this->db->update('posts', $data, 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post updated successfully']);
    }
    
    // DELETE /posts/{id} - Delete post (Protected)
    public function destroy($params) {
        $authenticatedUserId = requireAuth();
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        // Only author can delete post
        if ((string)$post['user_id'] !== (string)$authenticatedUserId) {
            jsonResponse(['error' => 'Forbidden: You can only delete your own posts'], 403);
        }
        
        $this->db->delete('posts', 'id = ?', [$id]);
        
        // Decrement user posts count
        $this->db->query("UPDATE users SET posts = GREATEST(0, posts - 1) WHERE id = ?", [$post['user_id']]);
        
        jsonResponse(['message' => 'Post deleted successfully']);
    }
    
    // POST /posts/{id}/like - Like a post (Protected)
    public function like($params) {
        $userId = requireAuth();
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $newLikes = $post['likes'] + 1;
        $this->db->update('posts', ['likes' => $newLikes], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post liked', 'likes' => $newLikes]);
    }
    
    // POST /posts/{id}/unlike - Unlike a post (Protected)
    public function unlike($params) {
        $userId = requireAuth();
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $newLikes = max(0, $post['likes'] - 1);
        $this->db->update('posts', ['likes' => $newLikes], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post unliked', 'likes' => $newLikes]);
    }
    
    // POST /posts/{id}/retweet - Retweet a post (Protected)
    public function retweet($params) {
        $userId = requireAuth();
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $newRetweets = $post['retweets'] + 1;
        $this->db->update('posts', ['retweets' => $newRetweets], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post retweeted', 'retweets' => $newRetweets]);
    }
}

