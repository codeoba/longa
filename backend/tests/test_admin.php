<?php
$baseUrl = 'http://127.0.0.1:8000';

echo "=== 1. Testing GET /admin/stats ===\n";
$res = file_get_contents("$baseUrl/admin/stats");
$data = json_decode($res, true);
echo "Status: " . ($data['status'] ?? 'unknown') . "\n";
echo "Total Users: " . ($data['kpis']['total_users'] ?? 'N/A') . "\n";
echo "Total Revenue: $" . number_format($data['kpis']['total_revenue_usd'] ?? 0, 2) . "\n\n";

echo "=== 2. Testing GET /admin/features ===\n";
$res = file_get_contents("$baseUrl/admin/features");
$data = json_decode($res, true);
echo "AI Suite Enabled: " . (($data['features']['ai_suite_enabled'] ?? false) ? 'YES' : 'NO') . "\n";
echo "WebRTC Calling Enabled: " . (($data['features']['webrtc_calling_enabled'] ?? false) ? 'YES' : 'NO') . "\n\n";

echo "=== 3. Testing POST /admin/features (Toggle kill-switch) ===\n";
$ch = curl_init("$baseUrl/admin/features");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'features' => ['whisper_messages_enabled' => true, 'platform_commission_pct' => 12]
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$res = curl_exec($ch);
curl_close($ch);
echo "Response: $res\n\n";

echo "=== 4. Testing GET /admin/users ===\n";
$res = file_get_contents("$baseUrl/admin/users");
$data = json_decode($res, true);
echo "Found " . count($data['users'] ?? []) . " users.\n\n";

echo "=== 5. Testing GET /admin/audit-logs ===\n";
$res = file_get_contents("$baseUrl/admin/audit-logs");
$data = json_decode($res, true);
echo "Found " . count($data['logs'] ?? []) . " audit logs.\n\n";
