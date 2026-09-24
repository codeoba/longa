<?php
/**
 * Mailer - Pure PHP SMTP and HTML Email Dispatcher
 */

class Mailer {
    private static $instance = null;
    private $config;

    private function __construct() {
        $configFile = dirname(__DIR__) . '/config/mail.php';
        $this->config = file_exists($configFile) ? require $configFile : [];
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Send Verification Email
     */
    public function sendVerification($toEmail, $userName, $token) {
        $baseUrl = getenv('APP_URL') ?: (isset($_SERVER['HTTP_HOST']) ? 'http://' . $_SERVER['HTTP_HOST'] : 'http://localhost:5173');
        $verifyUrl = rtrim($baseUrl, '/') . "/?verify={$token}";

        $subject = "Verify your email on Longa";
        $html = "
        <div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #15202b; color: #ffffff; padding: 30px; border-radius: 16px;'>
            <div style='text-align: center; margin-bottom: 25px;'>
                <h1 style='color: #1d9bf0; font-size: 28px; margin: 0;'>Longa</h1>
                <p style='color: #8899a6; font-size: 14px;'>Connect, Share, and Discover</p>
            </div>
            <div style='background: #192734; padding: 25px; border-radius: 12px; border: 1px solid #22303c;'>
                <h2 style='color: #ffffff; margin-top: 0;'>Welcome to Longa, {$userName}!</h2>
                <p style='color: #8899a6; line-height: 1.6;'>Thank you for joining Longa. Please confirm your email address to activate all premium features, live streaming, and interactive communities.</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$verifyUrl}' style='background: #1d9bf0; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;'>Verify Email Address</a>
                </div>
                <p style='color: #8899a6; font-size: 13px;'>Or copy and paste this link in your browser:<br><span style='color: #1d9bf0;'>{$verifyUrl}</span></p>
            </div>
            <p style='color: #8899a6; font-size: 12px; text-align: center; margin-top: 25px;'>If you did not create a Longa account, you can safely ignore this email.</p>
        </div>";

        return $this->send($toEmail, $subject, $html);
    }

    /**
     * Send Password Reset Email
     */
    public function sendPasswordReset($toEmail, $userName, $token) {
        $baseUrl = getenv('APP_URL') ?: (isset($_SERVER['HTTP_HOST']) ? 'http://' . $_SERVER['HTTP_HOST'] : 'http://localhost:5173');
        $resetUrl = rtrim($baseUrl, '/') . "/?reset={$token}";

        $subject = "Reset your Longa password";
        $html = "
        <div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #15202b; color: #ffffff; padding: 30px; border-radius: 16px;'>
            <div style='text-align: center; margin-bottom: 25px;'>
                <h1 style='color: #1d9bf0; font-size: 28px; margin: 0;'>Longa</h1>
            </div>
            <div style='background: #192734; padding: 25px; border-radius: 12px; border: 1px solid #22303c;'>
                <h2 style='color: #ffffff; margin-top: 0;'>Password Reset Request</h2>
                <p style='color: #8899a6; line-height: 1.6;'>Hello {$userName}, we received a request to reset the password for your Longa account.</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$resetUrl}' style='background: #e0245e; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;'>Reset Password</a>
                </div>
                <p style='color: #8899a6; font-size: 13px;'>This link will expire in 1 hour.</p>
            </div>
        </div>";

        return $this->send($toEmail, $subject, $html);
    }

    /**
     * Send Email via SMTP or native fallback
     */
    public function send($to, $subject, $htmlBody) {
        $fromEmail = $this->config['from']['address'] ?? 'no-reply@longa.app';
        $fromName = $this->config['from']['name'] ?? 'Longa';

        // Check if SMTP credentials provided
        $smtp = $this->config['smtp'] ?? [];
        if (!empty($smtp['host']) && $smtp['host'] !== 'localhost' && !empty($smtp['username'])) {
            $smtpResult = $this->sendViaSmtp($to, $subject, $htmlBody, $fromEmail, $fromName, $smtp);
            if ($smtpResult) return true;
        }

        // Native PHP mail() fallback
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            "From: {$fromName} <{$fromEmail}>",
            "Reply-To: {$fromEmail}",
            'X-Mailer: Longa/1.0.0'
        ];

        return @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
    }

    /**
     * Socket-based pure SMTP delivery
     */
    private function sendViaSmtp($to, $subject, $htmlBody, $fromEmail, $fromName, $smtp) {
        $host = $smtp['host'];
        $port = $smtp['port'] ?? 587;
        $timeout = $smtp['timeout'] ?? 10;

        $socket = @fsockopen($host, $port, $errno, $errstr, $timeout);
        if (!$socket) {
            return false;
        }

        $this->readResponse($socket);

        fputs($socket, "EHLO " . gethostname() . "\r\n");
        $this->readResponse($socket);

        if (($smtp['encryption'] ?? '') === 'tls') {
            fputs($socket, "STARTTLS\r\n");
            $this->readResponse($socket);
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            fputs($socket, "EHLO " . gethostname() . "\r\n");
            $this->readResponse($socket);
        }

        if (!empty($smtp['username']) && !empty($smtp['password'])) {
            fputs($socket, "AUTH LOGIN\r\n");
            $this->readResponse($socket);
            fputs($socket, base64_encode($smtp['username']) . "\r\n");
            $this->readResponse($socket);
            fputs($socket, base64_encode($smtp['password']) . "\r\n");
            $this->readResponse($socket);
        }

        fputs($socket, "MAIL FROM: <{$fromEmail}>\r\n");
        $this->readResponse($socket);
        fputs($socket, "RCPT TO: <{$to}>\r\n");
        $this->readResponse($socket);
        fputs($socket, "DATA\r\n");
        $this->readResponse($socket);

        $headers = "MIME-Version: 1.0\r\n"
                 . "Content-Type: text/html; charset=UTF-8\r\n"
                 . "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>\r\n"
                 . "To: <{$to}>\r\n"
                 . "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n\r\n";

        fputs($socket, $headers . $htmlBody . "\r\n.\r\n");
        $this->readResponse($socket);

        fputs($socket, "QUIT\r\n");
        fclose($socket);

        return true;
    }

    private function readResponse($socket) {
        $response = "";
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === " ") break;
        }
        return $response;
    }
}
