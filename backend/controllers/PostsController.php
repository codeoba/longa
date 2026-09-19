<?php
require_once __DIR__ . '/../core/Database.php';

class PostsController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // GET /posts - Get all posts
    public function index($params) {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        if ($userId) {
            $sql = "SELECT p.*, u.name as user_name, u.handle as user_handle, u.avatar as user_avatar 
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id 
                    WHERE p.user_id = ? 
                    ORDER BY p.created_at DESC 
                    LIMIT ? OFFSET ?";
            $posts = $this->db->fetchAll($sql, [$userId, $limit, $offset]);
        } else {
            $sql = "SELECT p.*, u.name as user_name, u.handle as user_handle, u.avatar as user_avatar 
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id 
                    ORDER BY p.created_at DESC 
                    LIMIT ? OFFSET ?";
            $posts = $this->db->fetchAll($sql, [$limit, $offset]);
        }
        
        jsonResponse(['posts' => $posts]);
    }
    
    // GET /posts/{id} - Get single post
    public function show($params) {
        $id = $params['id'];
        
        $sql = "SELECT p.*, u.name as user_name, u.handle as user_handle, u.avatar as user_avatar 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                WHERE p.id = ?";
        $post = $this->db->fetchOne($sql, [$id]);
        
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        jsonResponse(['post' => $post]);
    }
    
    // POST /posts - Create new post
    public function store($params) {
        $input = getJsonInput();
        
        $required = ['user_id', 'content'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                jsonResponse(['error' => "Field '{$field}' is required"], 400);
            }
        }
        
        $data = [
            'user_id' => $input['user_id'],
            'content' => $input['content'],
            'image' => $input['image'] ?? null,
            'likes' => 0,
            'retweets' => 0,
            'replies' => 0,
            'views' => 0,
            'bookmarks' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $id = $this->db->insert('posts', $data);
        
        jsonResponse([
            'message' => 'Post created successfully',
            'post_id' => $id
        ], 201);
    }
    
    // PUT /posts/{id} - Update post
    public function update($params) {
        $id = $params['id'];
        $input = getJsonInput();
        
        // Check if post exists
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $data = [];
        $allowedFields = ['content', 'image', 'likes', 'retweets', 'replies', 'views', 'bookmarks'];
        
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
    
    // DELETE /posts/{id} - Delete post
    public function destroy($params) {
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $this->db->delete('posts', 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post deleted successfully']);
    }
    
    // POST /posts/{id}/like - Like a post
    public function like($params) {
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $this->db->update('posts', ['likes' => $post['likes'] + 1], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post liked', 'likes' => $post['likes'] + 1]);
    }
    
    // POST /posts/{id}/unlike - Unlike a post
    public function unlike($params) {
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $newLikes = max(0, $post['likes'] - 1);
        $this->db->update('posts', ['likes' => $newLikes], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post unliked', 'likes' => $newLikes]);
    }
    
    // POST /posts/{id}/retweet - Retweet a post
    public function retweet($params) {
        $id = $params['id'];
        
        $post = $this->db->fetchOne("SELECT * FROM posts WHERE id = ?", [$id]);
        if (!$post) {
            jsonResponse(['error' => 'Post not found'], 404);
        }
        
        $this->db->update('posts', ['retweets' => $post['retweets'] + 1], 'id = ?', [$id]);
        
        jsonResponse(['message' => 'Post retweeted', 'retweets' => $post['retweets'] + 1]);
    }
}
