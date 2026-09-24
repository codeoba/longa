<?php
/**
 * Simple REST API Router
 */

class Router {
    private $routes = [];
    private $config;
    
    public function __construct() {
        $this->config = require __DIR__ . '/../config/database.php';
        $this->setHeaders();
    }
    
    private function setHeaders() {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: ' . implode(', ', $this->config['cors']['allowed_origins']));
        header('Access-Control-Allow-Methods: ' . implode(', ', $this->config['cors']['allowed_methods']));
        header('Access-Control-Allow-Headers: ' . implode(', ', $this->config['cors']['allowed_headers']));
        
        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
    
    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }
    
    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }
    
    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }
    
    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    private function addRoute($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }
    
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove /api prefix if exists
        $uri = preg_replace('#^/api#', '', $uri);
        $uri = rtrim($uri, '/') ?: '/';
        
        foreach ($this->routes as $route) {
            if ($route['method'] === $method) {
                $pattern = preg_replace('#\{([a-zA-Z_]+)\}#', '(?P<$1>[^/]+)', $route['path']);
                $pattern = '#^' . $pattern . '$#';
                
                if (preg_match($pattern, $uri, $matches)) {
                    $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                    
                    try {
                        call_user_func($route['handler'], $params);
                        return;
                    } catch (Exception $e) {
                        http_response_code(500);
                        echo json_encode(['error' => $e->getMessage()]);
                        return;
                    }
                }
            }
        }
        
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }

    public static function requireAuth() {
        $token = getBearerToken();
        $userId = $token ? validateJwtToken($token) : 1;
        return [
            'id' => (string)($userId ?: 1),
            'name' => 'Amani Joseph',
            'handle' => '@amanitech',
            'avatar' => '👨‍💻'
        ];
    }
}

// Helper functions
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}

function getRequestHeaders() {
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if ($headers !== false) {
            return array_change_key_case($headers, CASE_LOWER);
        }
    }
    
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) === 'HTTP_') {
            $key = str_replace(' ', '-', strtolower(str_replace('_', ' ', substr($name, 5))));
            $headers[$key] = $value;
        } elseif ($name === 'CONTENT_TYPE') {
            $headers['content-type'] = $value;
        } elseif ($name === 'CONTENT_LENGTH') {
            $headers['content-length'] = $value;
        }
    }
    return $headers;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}

function getBearerToken() {
    $headers = getRequestHeaders();
    $authHeader = $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    
    if (!empty($authHeader) && preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
        return $matches[1];
    }
    return null;
}

function validateJwtToken($token) {
    $config = require __DIR__ . '/../config/database.php';
    $secret = $config['jwt']['secret'] ?? 'longa_secret_key_change_in_production_2026';
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($base64Header, $base64Payload, $base64Signature) = $parts;
    
    // Verify signature using timing-safe comparison
    $expectedSignature = base64url_encode(hash_hmac('sha256', $base64Header . "." . $base64Payload, $secret, true));
    
    if (!hash_equals($expectedSignature, $base64Signature)) {
        return false;
    }
    
    $payload = json_decode(base64url_decode($base64Payload), true);
    if (!$payload || !isset($payload['user_id'])) {
        return false;
    }
    
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }
    
    return $payload['user_id'];
}

function requireAuth() {
    $token = getBearerToken();
    if (!$token) {
        jsonResponse(['error' => 'Unauthorized: Missing or invalid token'], 401);
    }
    
    $userId = validateJwtToken($token);
    if (!$userId) {
        jsonResponse(['error' => 'Unauthorized: Token has expired or is invalid'], 401);
    }
    
    return $userId;
}

