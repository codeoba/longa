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

function requireAuth() {
    // Simple auth check - implement your own auth logic
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }
    return $headers['Authorization'];
}
