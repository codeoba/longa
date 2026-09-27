<?php
/**
 * ReelsController - Short Vertical Video Feed & Creation
 */

class ReelsController {
    private $storageFile;

    public function __construct() {
        $this->storageFile = dirname(__DIR__) . '/database/reels.json';
        if (!file_exists($this->storageFile)) {
            $initial = [
                [
                    'id' => 'reel_1',
                    'creatorId' => '1',
                    'creatorName' => 'Amani Joseph',
                    'creatorHandle' => 'amanitech',
                    'creatorAvatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-code-on-a-computer-screen-monitor-32863-large.mp4',
                    'caption' => 'Why building on Longa in 2026 is faster than ever. Zero server setup, native WebRTC, and real-time SSE! 🚀💻',
                    'likesCount' => 1420,
                    'commentsCount' => 184,
                    'sharesCount' => 92,
                    'audioTrack' => 'Amani Tech • Original Audio - Future Synth',
                    'tags' => ['Coding', 'Tech2026', 'LongaDev'],
                    'createdAt' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'reel_2',
                    'creatorId' => '2',
                    'creatorName' => 'Sarah M.',
                    'creatorHandle' => 'sarahdesigns',
                    'creatorAvatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
                    'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-with-green-screen-mockup-41551-large.mp4',
                    'caption' => 'Testing the new Longa Creator Store UI on mobile. Glassmorphism + responsive micro-interactions are chef kiss ✨',
                    'likesCount' => 2310,
                    'commentsCount' => 312,
                    'sharesCount' => 140,
                    'audioTrack' => 'Sarah Designs • Chill Lo-Fi Beats',
                    'tags' => ['Design', 'UIUX', 'Figma'],
                    'createdAt' => date('Y-m-d H:i:s', strtotime('-1 hour'))
                ],
                [
                    'id' => 'reel_3',
                    'creatorId' => '3',
                    'creatorName' => 'Kibo Robotics',
                    'creatorHandle' => 'kiborobotics',
                    'creatorAvatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-artificial-intelligence-and-technology-hologram-42998-large.mp4',
                    'caption' => 'Autonomous neural network agents running on the edge. The future of decentralized social networking is here.',
                    'likesCount' => 3840,
                    'commentsCount' => 520,
                    'sharesCount' => 420,
                    'audioTrack' => 'Cyberpunk Soundscapes • Neural Waves',
                    'tags' => ['AI', 'Robotics', 'DeepTech'],
                    'createdAt' => date('Y-m-d H:i:s', strtotime('-3 hours'))
                ]
            ];
            file_put_contents($this->storageFile, json_encode($initial, JSON_PRETTY_PRINT));
        }
    }

    /**
     * GET /reels
     */
    public function index() {
        $reels = json_decode(file_get_contents($this->storageFile), true) ?? [];
        jsonResponse([
            'status' => 'success',
            'reels' => $reels
        ]);
    }

    /**
     * POST /reels
     */
    public function store() {
        $token = getBearerToken();
        $userId = $token ? validateJwtToken($token) : null;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $videoUrl = trim($input['videoUrl'] ?? ($input['video_url'] ?? ''));
        $caption = trim($input['caption'] ?? '');
        $audioTrack = trim($input['audioTrack'] ?? ($input['audio_track'] ?? 'Original Audio'));
        $tags = $input['tags'] ?? [];

        if (empty($videoUrl)) {
            jsonResponse(['error' => 'videoUrl is required to publish a reel'], 400);
        }

        $creatorName = $input['creatorName'] ?? ($input['creator_name'] ?? 'Creator');
        $creatorHandle = $input['creatorHandle'] ?? ($input['creator_handle'] ?? '@creator');
        $creatorAvatar = $input['creatorAvatar'] ?? ($input['creator_avatar'] ?? '👤');
        $creatorId = $userId ? (string)$userId : ($input['creatorId'] ?? 'user_' . bin2hex(random_bytes(3)));

        if ($userId) {
            try {
                $db = Database::getInstance();
                $stmt = $db->prepare("SELECT id, name, handle, avatar FROM users WHERE id = :id LIMIT 1");
                $stmt->execute([':id' => $userId]);
                $userDb = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($userDb) {
                    $creatorName = $userDb['name'];
                    $creatorHandle = $userDb['handle'];
                    $creatorAvatar = $userDb['avatar'] ?: '👤';
                    $creatorId = (string)$userDb['id'];
                }
            } catch (Exception $e) {}
        }

        $reels = json_decode(file_get_contents($this->storageFile), true) ?? [];

        $newReel = [
            'id' => 'reel_' . bin2hex(random_bytes(6)),
            'creatorId' => $creatorId,
            'creatorName' => $creatorName,
            'creatorHandle' => $creatorHandle,
            'creatorAvatar' => $creatorAvatar,
            'videoUrl' => $videoUrl,
            'caption' => $caption,
            'likesCount' => 0,
            'commentsCount' => 0,
            'sharesCount' => 0,
            'audioTrack' => $audioTrack,
            'tags' => is_array($tags) ? $tags : [],
            'createdAt' => date('Y-m-d H:i:s')
        ];

        array_unshift($reels, $newReel);
        file_put_contents($this->storageFile, json_encode($reels, JSON_PRETTY_PRINT));

        jsonResponse([
            'status' => 'success',
            'reel' => $newReel
        ], 201);
    }
}
