<?php
/**
 * RealtimeController - Server-Sent Events (SSE) Live Stream
 */

class RealtimeController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Establish SSE Stream for a user
     * GET /realtime/stream?user_id=123
     */
    public function stream() {
        // Disable output buffering and configure headers for SSE
        if (ob_get_level()) {
            ob_end_clean();
        }

        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache, no-transform');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        // Check authentication or user_id query param
        $userId = $_GET['user_id'] ?? null;
        if (!$userId) {
            $user = Router::getAuthUser();
            if ($user) {
                $userId = $user['id'];
            }
        }

        // Send connected event
        $this->sendEvent('connected', [
            'status' => 'online',
            'user_id' => $userId,
            'time' => time(),
            'message' => 'Realtime SSE stream established'
        ]);

        if (!$userId) {
            $this->sendEvent('ping', ['time' => time()]);
            exit;
        }

        $lastCheck = time() - 3;
        $maxLoops = 15; // stream for ~15 seconds then finish, browser EventSource reconnects automatically

        for ($i = 0; $i < $maxLoops; $i++) {
            // 1. Check for new messages
            $newMessages = $this->db->fetchAll(
                "SELECT m.*, u.name as sender_name, u.handle as sender_handle, u.avatar as sender_avatar
                 FROM messages m
                 JOIN users u ON m.sender_id = u.id
                 WHERE m.receiver_id = ? AND m.created_at >= ?
                 ORDER BY m.created_at ASC",
                [$userId, date('Y-m-d H:i:s', $lastCheck)]
            );

            foreach ($newMessages as $msg) {
                $this->sendEvent('new_message', [
                    'id' => (string)$msg['id'],
                    'conversation_id' => (string)$msg['conversation_id'],
                    'sender_id' => (string)$msg['sender_id'],
                    'sender_name' => $msg['sender_name'],
                    'sender_handle' => $msg['sender_handle'],
                    'sender_avatar' => $msg['sender_avatar'],
                    'content' => $msg['content'],
                    'created_at' => $msg['created_at']
                ]);
            }

            // 2. Check for new notifications
            $newNotifications = $this->db->fetchAll(
                "SELECT n.*, u.name as actor_name, u.handle as actor_handle, u.avatar as actor_avatar
                 FROM notifications n
                 LEFT JOIN users u ON n.actor_id = u.id
                 WHERE n.user_id = ? AND n.created_at >= ?
                 ORDER BY n.created_at ASC",
                [$userId, date('Y-m-d H:i:s', $lastCheck)]
            );

            foreach ($newNotifications as $notif) {
                $this->sendEvent('new_notification', [
                    'id' => (string)$notif['id'],
                    'user_id' => (string)$notif['user_id'],
                    'type' => $notif['type'],
                    'message' => $notif['message'],
                    'actor_name' => $notif['actor_name'] ?? 'Someone',
                    'actor_avatar' => $notif['actor_avatar'] ?? '👤',
                    'created_at' => $notif['created_at']
                ]);
            }

            $lastCheck = time();

            // Send periodic heartbeat ping
            if ($i % 3 === 0) {
                $this->sendEvent('ping', ['time' => time()]);
            }

            if (connection_aborted()) {
                break;
            }

            sleep(1);
        }

        exit;
    }

    private function sendEvent($eventName, $data) {
        echo "event: {$eventName}\n";
        echo "data: " . json_encode($data) . "\n\n";
        if (ob_get_level()) {
            ob_flush();
        }
        flush();
    }
}
