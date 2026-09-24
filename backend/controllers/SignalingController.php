<?php
/**
 * SignalingController - WebRTC P2P Signaling for Live Streaming & Spaces
 */

class SignalingController {
    private $storageDir;

    public function __construct() {
        $this->storageDir = dirname(__DIR__) . '/database/webrtc_rooms/';
        if (!is_dir($this->storageDir)) {
            mkdir($this->storageDir, 0755, true);
        }
    }

    /**
     * List active live rooms
     * GET /signaling/rooms
     */
    public function rooms() {
        $rooms = [];
        $files = glob($this->storageDir . '*.json');
        $now = time();

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);
            if ($data && ($now - $data['updated_at']) < 120) { // active within last 2 minutes
                $rooms[] = [
                    'id' => $data['id'],
                    'title' => $data['title'] ?? 'Live Stream',
                    'host_id' => $data['host_id'] ?? 'host',
                    'host_name' => $data['host_name'] ?? 'Host',
                    'host_avatar' => $data['host_avatar'] ?? '👤',
                    'type' => $data['type'] ?? 'video',
                    'viewers' => count($data['viewers'] ?? []),
                    'is_live' => true,
                    'created_at' => $data['created_at']
                ];
            } else {
                @unlink($file);
            }
        }

        jsonResponse(['status' => 'success', 'rooms' => $rooms]);
    }

    /**
     * Host publishes SDP Offer to start room
     * POST /signaling/offer
     */
    public function sendOffer() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $roomId = $input['room_id'] ?? ('room_' . bin2hex(random_bytes(6)));
        $sdp = $input['sdp'] ?? null;

        if (!$sdp) {
            jsonResponse(['error' => 'SDP offer is required'], 400);
        }

        $roomFile = $this->storageDir . $roomId . '.json';
        $roomData = [
            'id' => $roomId,
            'title' => $input['title'] ?? 'Live Broadcast',
            'type' => $input['type'] ?? 'video',
            'host_id' => $input['host_id'] ?? 'host',
            'host_name' => $input['host_name'] ?? 'Host',
            'host_avatar' => $input['host_avatar'] ?? '👤',
            'offer' => $sdp,
            'answers' => [],
            'host_candidates' => [],
            'viewer_candidates' => [],
            'viewers' => [],
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => time()
        ];

        file_put_contents($roomFile, json_encode($roomData, JSON_PRETTY_PRINT));

        jsonResponse([
            'status' => 'success',
            'room_id' => $roomId,
            'message' => 'WebRTC room created and offer stored'
        ], 201);
    }

    /**
     * Viewer sends SDP Answer
     * POST /signaling/answer
     */
    public function sendAnswer() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $roomId = $input['room_id'] ?? null;
        $sdp = $input['sdp'] ?? null;
        $viewerId = $input['viewer_id'] ?? ('viewer_' . bin2hex(random_bytes(4)));

        if (!$roomId || !$sdp) {
            jsonResponse(['error' => 'room_id and sdp answer required'], 400);
        }

        $roomFile = $this->storageDir . $roomId . '.json';
        if (!file_exists($roomFile)) {
            jsonResponse(['error' => 'Room not found or ended'], 404);
        }

        $roomData = json_decode(file_get_contents($roomFile), true);
        $roomData['answers'][$viewerId] = $sdp;
        $roomData['viewers'][$viewerId] = time();
        $roomData['updated_at'] = time();

        file_put_contents($roomFile, json_encode($roomData));

        jsonResponse(['status' => 'success', 'viewer_id' => $viewerId]);
    }

    /**
     * Exchange ICE Candidates
     * POST /signaling/candidate
     */
    public function sendCandidate() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $roomId = $input['room_id'] ?? null;
        $candidate = $input['candidate'] ?? null;
        $role = $input['role'] ?? 'host'; // 'host' or 'viewer'

        if (!$roomId || !$candidate) {
            jsonResponse(['error' => 'room_id and candidate required'], 400);
        }

        $roomFile = $this->storageDir . $roomId . '.json';
        if (!file_exists($roomFile)) {
            jsonResponse(['error' => 'Room not found'], 404);
        }

        $roomData = json_decode(file_get_contents($roomFile), true);
        if ($role === 'host') {
            $roomData['host_candidates'][] = $candidate;
        } else {
            $roomData['viewer_candidates'][] = $candidate;
        }
        $roomData['updated_at'] = time();

        file_put_contents($roomFile, json_encode($roomData));

        jsonResponse(['status' => 'success']);
    }

    /**
     * Poll signaling status for room
     * GET /signaling/poll?room_id=...&role=...
     */
    public function poll() {
        $roomId = $_GET['room_id'] ?? null;
        $role = $_GET['role'] ?? 'viewer';

        if (!$roomId) {
            jsonResponse(['error' => 'room_id required'], 400);
        }

        $roomFile = $this->storageDir . $roomId . '.json';
        if (!file_exists($roomFile)) {
            jsonResponse(['error' => 'Room ended'], 404);
        }

        $roomData = json_decode(file_get_contents($roomFile), true);
        $roomData['updated_at'] = time();
        file_put_contents($roomFile, json_encode($roomData));

        jsonResponse([
            'status' => 'success',
            'offer' => $roomData['offer'] ?? null,
            'answers' => $roomData['answers'] ?? [],
            'host_candidates' => $roomData['host_candidates'] ?? [],
            'viewer_candidates' => $roomData['viewer_candidates'] ?? []
        ]);
    }

    /**
     * Close a room
     * POST /signaling/close
     */
    public function closeRoom() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $roomId = $input['room_id'] ?? null;

        if ($roomId) {
            $roomFile = $this->storageDir . $roomId . '.json';
            if (file_exists($roomFile)) {
                @unlink($roomFile);
            }
        }

        jsonResponse(['status' => 'success', 'message' => 'Room closed']);
    }
}
