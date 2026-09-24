<?php
/**
 * UploadController - Media & File Upload Handler
 */

class UploadController {
    private $uploadDir;
    private $allowedMimes = [
        // Images
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
        // Videos
        'video/mp4'  => 'mp4',
        'video/webm' => 'webm',
        // Audio
        'audio/mpeg' => 'mp3',
        'audio/mp3'  => 'mp3',
        'audio/wav'  => 'wav',
        'audio/ogg'  => 'ogg',
        'audio/webm' => 'webm'
    ];
    private $maxFileSize = 25 * 1024 * 1024; // 25 MB

    public function __construct() {
        $this->uploadDir = dirname(__DIR__) . '/uploads/';
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    /**
     * Upload media file (multipart/form-data or base64 JSON)
     */
    public function upload() {
        // 1. Handle Multipart / $_FILES upload
        if (isset($_FILES['file']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
            return $this->handleMultipartUpload($_FILES['file']);
        }

        // 2. Handle JSON Base64 upload
        $raw = file_get_contents('php://input');
        $json = json_decode($raw, true);
        if ($json && isset($json['data'])) {
            return $this->handleBase64Upload($json['data'], $json['filename'] ?? null);
        }

        jsonResponse([
            'error' => 'No file uploaded or invalid payload. Send multipart with field "file" or JSON with "data".'
        ], 400);
    }

    private function handleMultipartUpload($file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'Upload error code: ' . $file['error']], 400);
        }

        if ($file['size'] > $this->maxFileSize) {
            jsonResponse(['error' => 'File size exceeds limit of 25MB'], 400);
        }

        // Validate MIME type with finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!isset($this->allowedMimes[$mime])) {
            jsonResponse(['error' => 'Unsupported file format: ' . $mime], 400);
        }

        $ext = $this->allowedMimes[$mime];
        $filename = bin2hex(random_bytes(16)) . '.' . $ext;
        $destination = $this->uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            jsonResponse(['error' => 'Failed to save uploaded file'], 500);
        }

        $url = $this->getFileUrl($filename);
        jsonResponse([
            'status' => 'success',
            'url' => $url,
            'filename' => $filename,
            'mime' => $mime,
            'size' => $file['size']
        ], 201);
    }

    private function handleBase64Upload($dataUri, $originalName = null) {
        if (preg_match('/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-\+\.]+);base64,(.+)$/', $dataUri, $matches)) {
            $mime = $matches[1];
            $base64Data = $matches[2];
            $binary = base64_decode($base64Data);

            if ($binary === false) {
                jsonResponse(['error' => 'Invalid base64 payload'], 400);
            }

            if (strlen($binary) > $this->maxFileSize) {
                jsonResponse(['error' => 'File size exceeds limit of 25MB'], 400);
            }

            $ext = isset($this->allowedMimes[$mime]) ? $this->allowedMimes[$mime] : 'bin';
            $filename = bin2hex(random_bytes(16)) . '.' . $ext;
            $destination = $this->uploadDir . $filename;

            if (file_put_contents($destination, $binary) === false) {
                jsonResponse(['error' => 'Failed to save base64 file'], 500);
            }

            $url = $this->getFileUrl($filename);
            jsonResponse([
                'status' => 'success',
                'url' => $url,
                'filename' => $filename,
                'mime' => $mime,
                'size' => strlen($binary)
            ], 201);
        }

        jsonResponse(['error' => 'Invalid Data URI format'], 400);
    }

    private function getFileUrl($filename) {
        $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
        return $scheme . '://' . $host . '/uploads/' . $filename;
    }
}
