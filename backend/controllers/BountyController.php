<?php
/**
 * BountyController - Creator Quests & Engagement Bounties
 */

class BountyController {
    private $storageFile;

    public function __construct() {
        $this->storageFile = dirname(__DIR__) . '/database/bounties.json';
        if (!file_exists($this->storageFile)) {
            $initial = [
                [
                    'id' => 'bounty_1',
                    'creatorId' => '1',
                    'creatorName' => 'Amani Tech',
                    'creatorHandle' => '@longa_user',
                    'creatorAvatar' => '👨‍💻',
                    'title' => '🎨 Redesign our Audio Space Visualizer Waveform',
                    'description' => 'We are seeking the cleanest CSS/Canvas waveform animation for Longa Spaces. Post your GitHub or CodePen link!',
                    'rewardAmount' => 50.00,
                    'currency' => 'USD',
                    'category' => 'Design & Code',
                    'deadline' => date('Y-m-d', strtotime('+7 days')),
                    'status' => 'open',
                    'submissionsCount' => 12,
                    'tags' => ['UI/UX', 'CSS', 'Canvas'],
                    'submissions' => [
                        [
                            'id' => 'sub_1',
                            'bountyId' => 'bounty_1',
                            'userId' => '2',
                            'userName' => 'Zawadi Innovation',
                            'userHandle' => '@zawadi_innov',
                            'userAvatar' => '👩‍🔬',
                            'content' => 'Here is an interactive 60fps dynamic audio reactive shader demo: https://codepen.io/demo/audio-wave',
                            'submittedAt' => date('Y-m-d H:i:s', strtotime('-1 day'))
                        ]
                    ]
                ],
                [
                    'id' => 'bounty_2',
                    'creatorId' => '3',
                    'creatorName' => 'Baraka Digital',
                    'creatorHandle' => '@barakadigital',
                    'creatorAvatar' => '🎨',
                    'title' => '🚀 Best Explainer Thread on Decentralized Social Networks',
                    'description' => 'Write a compelling 5-post thread on Longa explaining why user-owned data is the future. Top thread wins $30!',
                    'rewardAmount' => 30.00,
                    'currency' => 'USD',
                    'category' => 'Content & Writing',
                    'deadline' => date('Y-m-d', strtotime('+3 days')),
                    'status' => 'open',
                    'submissionsCount' => 28,
                    'tags' => ['Writing', 'Thread', 'Web3'],
                    'submissions' => []
                ]
            ];
            file_put_contents($this->storageFile, json_encode($initial, JSON_PRETTY_PRINT));
        }
    }

    /**
     * List bounties
     * GET /bounties
     */
    public function index() {
        $status = $_GET['status'] ?? null;
        $bounties = json_decode(file_get_contents($this->storageFile), true) ?? [];

        if ($status && $status !== 'all') {
            $bounties = array_values(array_filter($bounties, function($b) use ($status) {
                return ($b['status'] ?? 'open') === $status;
            }));
        }

        jsonResponse([
            'status' => 'success',
            'bounties' => $bounties
        ]);
    }

    /**
     * Create a new bounty
     * POST /bounties
     */
    public function store() {
        $user = Router::requireAuth();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $title = trim($input['title'] ?? '');
        $description = trim($input['description'] ?? '');
        $rewardAmount = (float)($input['reward_amount'] ?? 10.00);
        $deadlineDays = (int)($input['deadline_days'] ?? 7);
        $tags = $input['tags'] ?? ['Quest'];

        if (empty($title) || $rewardAmount <= 0) {
            jsonResponse(['error' => 'Title and a valid reward amount are required'], 400);
        }

        $bounties = json_decode(file_get_contents($this->storageFile), true) ?? [];

        $newBounty = [
            'id' => 'bounty_' . bin2hex(random_bytes(6)),
            'creatorId' => (string)$user['id'],
            'creatorName' => $user['name'] ?? 'Creator',
            'creatorHandle' => $user['handle'] ?? '@creator',
            'creatorAvatar' => $user['avatar'] ?? '👤',
            'title' => $title,
            'description' => $description,
            'rewardAmount' => $rewardAmount,
            'currency' => 'USD',
            'category' => $input['category'] ?? 'General Challenge',
            'deadline' => date('Y-m-d', strtotime("+{$deadlineDays} days")),
            'status' => 'open',
            'submissionsCount' => 0,
            'tags' => $tags,
            'submissions' => []
        ];

        array_unshift($bounties, $newBounty);
        file_put_contents($this->storageFile, json_encode($bounties, JSON_PRETTY_PRINT));

        jsonResponse([
            'status' => 'success',
            'bounty' => $newBounty
        ], 201);
    }

    /**
     * Submit entry to bounty
     * POST /bounties/{id}/submit
     */
    public function submit($params) {
        $user = Router::requireAuth();
        $bountyId = $params['id'] ?? null;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $content = trim($input['content'] ?? '');

        if (!$bountyId || empty($content)) {
            jsonResponse(['error' => 'bountyId and content are required'], 400);
        }

        $bounties = json_decode(file_get_contents($this->storageFile), true) ?? [];
        $found = false;

        $submission = [
            'id' => 'sub_' . bin2hex(random_bytes(6)),
            'bountyId' => $bountyId,
            'userId' => (string)$user['id'],
            'userName' => $user['name'] ?? 'Participant',
            'userHandle' => $user['handle'] ?? '@participant',
            'userAvatar' => $user['avatar'] ?? '👤',
            'content' => $content,
            'submittedAt' => date('Y-m-d H:i:s')
        ];

        foreach ($bounties as &$b) {
            if ($b['id'] === $bountyId) {
                if ($b['status'] !== 'open') {
                    jsonResponse(['error' => 'This bounty is no longer accepting submissions'], 400);
                }
                $b['submissions'][] = $submission;
                $b['submissionsCount'] = count($b['submissions']);
                $found = true;
                break;
            }
        }

        if (!$found) {
            jsonResponse(['error' => 'Bounty not found'], 404);
        }

        file_put_contents($this->storageFile, json_encode($bounties, JSON_PRETTY_PRINT));

        jsonResponse([
            'status' => 'success',
            'message' => 'Submission received successfully!',
            'submission' => $submission
        ], 201);
    }

    /**
     * Award winner
     * POST /bounties/{id}/award
     */
    public function award($params) {
        $user = Router::requireAuth();
        $bountyId = $params['id'] ?? null;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $winnerSubmissionId = $input['submission_id'] ?? null;

        if (!$bountyId || !$winnerSubmissionId) {
            jsonResponse(['error' => 'bountyId and submission_id are required'], 400);
        }

        $bounties = json_decode(file_get_contents($this->storageFile), true) ?? [];
        $found = false;
        $awardedBounty = null;

        foreach ($bounties as &$b) {
            if ($b['id'] === $bountyId) {
                if ($b['creatorId'] !== (string)$user['id']) {
                    jsonResponse(['error' => 'Only the bounty creator can award the prize'], 403);
                }
                $b['status'] = 'awarded';
                $b['winnerSubmissionId'] = $winnerSubmissionId;
                foreach ($b['submissions'] as &$sub) {
                    if ($sub['id'] === $winnerSubmissionId) {
                        $sub['isWinner'] = true;
                    }
                }
                $awardedBounty = $b;
                $found = true;
                break;
            }
        }

        if (!$found) {
            jsonResponse(['error' => 'Bounty not found'], 404);
        }

        file_put_contents($this->storageFile, json_encode($bounties, JSON_PRETTY_PRINT));

        jsonResponse([
            'status' => 'success',
            'message' => 'Winner awarded successfully! Escrow released.',
            'bounty' => $awardedBounty
        ]);
    }
}
