<?php
// Test all AI endpoints
$baseUrl = 'http://127.0.0.1:8000';

echo "=== 1. Testing GET /ai/providers ===\n";
$ch = curl_init("$baseUrl/ai/providers");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $httpCode\n";
$providers = json_decode($res, true);
echo "Found " . count($providers['providers'] ?? []) . " providers.\n\n";

echo "=== 2. Testing POST /ai/test-key (Builtin Provider) ===\n";
$ch = curl_init("$baseUrl/ai/test-key");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'provider' => 'builtin',
    'apiKey' => 'none'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$res = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $httpCode\n";
echo "Response: $res\n\n";

echo "=== 3. Testing POST /ai/chat with custom provider ===\n";
$ch = curl_init("$baseUrl/ai/chat");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'prompt' => 'Habari za asubuhi!',
    'provider' => 'builtin'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$res = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $httpCode\n";
echo "Response: $res\n\n";
