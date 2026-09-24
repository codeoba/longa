<?php
/**
 * Database Configuration
 * Badilisha hizi kulingana na database yako
 */

return [
    // Database type: 'mysql' or 'pgsql'
    'driver' => getenv('DB_DRIVER') ?: 'mysql',
    
    // MySQL Configuration
    'mysql' => [
        'host' => getenv('DB_HOST') ?: 'localhost',
        'port' => (int)(getenv('DB_PORT') ?: 3306),
        'database' => getenv('DB_NAME') ?: 'sql_twitt_9x4n90',
        'username' => getenv('DB_USER') ?: 'sql_twitt_9x4n90',
        'password' => getenv('DB_PASS') !== false ? getenv('DB_PASS') : '6f87ef40fbce6',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ],
    
    // PostgreSQL Configuration
    'pgsql' => [
        'host' => getenv('DB_HOST') ?: 'localhost',
        'port' => (int)(getenv('DB_PORT') ?: 5432),
        'database' => getenv('DB_NAME') ?: 'longa_db',
        'username' => getenv('DB_USER') ?: 'postgres',
        'password' => getenv('DB_PASS') !== false ? getenv('DB_PASS') : '',
        'charset' => 'utf8',
    ],
    
    // Security & Auth Settings
    'jwt' => [
        'secret' => getenv('JWT_SECRET') ?: 'longa_secret_key_change_in_production_2026',
        'expiry' => 86400 * 7, // 7 days
    ],

    // Application Settings
    'app' => [
        'name' => 'Longa API',
        'debug' => getenv('APP_DEBUG') === 'true' || true,
        'url' => getenv('APP_URL') ?: 'https://twitter.mdandu.com',
        'timezone' => 'Africa/Dar_es_Salaam',
        'locale' => 'en',
        'require_email_verification' => getenv('REQUIRE_EMAIL_VERIFICATION') === 'true', // false by default so users can login immediately
    ],
    
    // CORS Settings
    'cors' => [
        'allowed_origins' => ['*'], // Badilisha kwa domain yako katika production
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    ],
];

