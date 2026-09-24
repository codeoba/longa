<?php
/**
 * StoreController - Creator Marketplace & Digital Products
 */

class StoreController {
    private $storageFile;

    public function __construct() {
        $this->storageFile = dirname(__DIR__) . '/database/store_products.json';
        if (!file_exists($this->storageFile)) {
            $initial = [
                [
                    'id' => 'prod_1',
                    'creatorId' => '1',
                    'creatorName' => 'Amani Tech',
                    'creatorHandle' => '@longa_user',
                    'creatorAvatar' => '👨‍💻',
                    'title' => '🚀 Full-Stack React & PHP SaaS Starter Kit',
                    'description' => 'Complete clean architecture boilerplate with JWT auth, Tailwind v4, and database migrations.',
                    'price' => 29.00,
                    'currency' => 'USD',
                    'category' => 'code',
                    'coverImage' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
                    'salesCount' => 142,
                    'rating' => 4.9,
                    'tags' => ['React', 'PHP', 'Boilerplate']
                ],
                [
                    'id' => 'prod_2',
                    'creatorId' => '2',
                    'creatorName' => 'Zawadi Innovation',
                    'creatorHandle' => '@zawadi_innov',
                    'creatorAvatar' => '👩‍🔬',
                    'title' => '🤖 AI Prompt Engineering Master Guide 2026',
                    'description' => '150+ battle-tested prompts for coding, content generation, and audience growth.',
                    'price' => 15.00,
                    'currency' => 'USD',
                    'category' => 'ebook',
                    'coverImage' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
                    'salesCount' => 380,
                    'rating' => 5.0,
                    'tags' => ['AI', 'Guide', 'Prompts']
                ],
                [
                    'id' => 'prod_3',
                    'creatorId' => '3',
                    'creatorName' => 'Baraka Digital',
                    'creatorHandle' => '@barakadigital',
                    'creatorAvatar' => '🎨',
                    'title' => '🎨 Modern Minimalist Mobile UI Kit (Figma)',
                    'description' => 'Over 200+ clean responsive mobile components, dark and light modes, ready for production.',
                    'price' => 35.00,
                    'currency' => 'USD',
                    'category' => 'design',
                    'coverImage' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop',
                    'salesCount' => 89,
                    'rating' => 4.8,
                    'tags' => ['Figma', 'UI/UX', 'Design']
                ]
            ];
            file_put_contents($this->storageFile, json_encode($initial, JSON_PRETTY_PRINT));
        }
    }

    /**
     * List marketplace products
     * GET /store/products
     */
    public function index() {
        $category = $_GET['category'] ?? null;
        $creatorId = $_GET['creator_id'] ?? null;

        $products = json_decode(file_get_contents($this->storageFile), true) ?? [];

        if ($category && $category !== 'all') {
            $products = array_values(array_filter($products, function($p) use ($category) {
                return ($p['category'] ?? '') === $category;
            }));
        }

        if ($creatorId) {
            $products = array_values(array_filter($products, function($p) use ($creatorId) {
                return ($p['creatorId'] ?? '') === (string)$creatorId;
            }));
        }

        jsonResponse([
            'status' => 'success',
            'products' => $products
        ]);
    }

    /**
     * Create product
     * POST /store/products
     */
    public function store() {
        $token = getBearerToken();
        $userId = $token ? validateJwtToken($token) : null;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $title = trim($input['title'] ?? '');
        $description = trim($input['description'] ?? '');
        $price = (float)($input['price'] ?? 0);
        $category = $input['category'] ?? 'ebook';
        $coverImage = $input['cover_image'] ?? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';
        $tags = $input['tags'] ?? ['Digital'];

        if (empty($title) || $price <= 0) {
            jsonResponse(['error' => 'Title and a valid price (> 0) are required'], 400);
        }

        $products = json_decode(file_get_contents($this->storageFile), true) ?? [];

        $newProduct = [
            'id' => 'prod_' . bin2hex(random_bytes(6)),
            'creatorId' => (string)$user['id'],
            'creatorName' => $user['name'] ?? 'Creator',
            'creatorHandle' => $user['handle'] ?? '@creator',
            'creatorAvatar' => $user['avatar'] ?? '👤',
            'title' => $title,
            'description' => $description,
            'price' => $price,
            'currency' => 'USD',
            'category' => $category,
            'coverImage' => $coverImage,
            'salesCount' => 0,
            'rating' => 5.0,
            'tags' => $tags
        ];

        array_unshift($products, $newProduct);
        file_put_contents($this->storageFile, json_encode($products, JSON_PRETTY_PRINT));

        jsonResponse([
            'status' => 'success',
            'product' => $newProduct
        ], 201);
    }

    /**
     * Purchase product
     * POST /store/buy
     */
    public function buy() {
        $token = getBearerToken();
        $userId = $token ? validateJwtToken($token) : 1;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $productId = $input['product_id'] ?? ($input['productId'] ?? null);
        $paymentMethod = $input['payment_method'] ?? ($input['paymentMethod'] ?? 'card');

        if (!$productId) {
            jsonResponse(['error' => 'product_id is required'], 400);
        }

        $products = json_decode(file_get_contents($this->storageFile), true) ?? [];
        $found = false;
        $boughtProduct = null;

        foreach ($products as &$p) {
            if ($p['id'] === $productId) {
                $p['salesCount'] = ($p['salesCount'] ?? 0) + 1;
                $boughtProduct = $p;
                $found = true;
                break;
            }
        }

        if (!$found) {
            jsonResponse(['error' => 'Product not found'], 404);
        }

        file_put_contents($this->storageFile, json_encode($products, JSON_PRETTY_PRINT));

        $orderReference = 'ORD_' . strtoupper(bin2hex(random_bytes(6)));

        jsonResponse([
            'status' => 'success',
            'message' => 'Purchase completed successfully!',
            'order_reference' => $orderReference,
            'product' => $boughtProduct,
            'download_url' => 'https://api.longa.app/downloads/' . $orderReference
        ]);
    }
}
