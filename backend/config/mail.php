<?php
/**
 * Mail Configuration
 */

return [
    'enabled' => getenv('MAIL_ENABLED') !== 'false',
    
    // Default mailer: 'smtp' or 'mail' or 'log'
    'default' => getenv('MAIL_DRIVER') ?: 'smtp',

    'smtp' => [
        'host' => getenv('SMTP_HOST') ?: 'localhost',
        'port' => (int)(getenv('SMTP_PORT') ?: 587),
        'encryption' => getenv('SMTP_ENCRYPTION') ?: 'tls', // 'tls', 'ssl', or null
        'username' => getenv('SMTP_USER') ?: '',
        'password' => getenv('SMTP_PASS') ?: '',
        'timeout' => 10,
    ],

    'from' => [
        'address' => getenv('MAIL_FROM_ADDRESS') ?: 'no-reply@longa.app',
        'name' => getenv('MAIL_FROM_NAME') ?: 'Longa Social',
    ],
];
