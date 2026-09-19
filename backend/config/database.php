<?php
/**
 * Database Configuration
 * Badilisha hizi kulingana na database yako
 */

return [
    // Database type: 'mysql' or 'pgsql'
    'driver' => 'mysql',
    
    // MySQL Configuration
    'mysql' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'x_app_db',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ],
    
    // PostgreSQL Configuration
    'pgsql' => [
        'host' => 'localhost',
        'port' => 5432,
        'database' => 'x_app_db',
        'username' => 'postgres',
        'password' => '',
        'charset' => 'utf8',
    ],
    
    // Application Settings
    'app' => [
        'name' => 'Longa API',
        'debug' => true, // Badilisha kuwa false kwa production
        'url' => 'http://localhost:8000',
        'timezone' => 'Africa/Dar_es_Salaam',
        'locale' => 'en',
    ],
    
    // CORS Settings
    'cors' => [
        'allowed_origins' => ['*'], // Badilisha kwa domain yako
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization'],
    ],
];
