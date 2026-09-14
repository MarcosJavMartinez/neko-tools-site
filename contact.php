<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$website = trim((string) ($_POST['website'] ?? '')); // honeypot: hidden from real visitors

// Bots tend to fill every field, including ones hidden with CSS. If this one
// has anything in it, pretend success and drop the message silently.
if ($website !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_input']);
    exit;
}

if (mb_strlen($name) > 120 || mb_strlen($message) > 4000 || mb_strlen($email) > 160) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'too_long']);
    exit;
}

$to = 'marcos.jvr.martinez@gmail.com';
$subject = '=?UTF-8?B?' . base64_encode('Nuevo mensaje desde nekotools.site') . '?=';

// Strip newlines from header-bound values so nobody can smuggle extra
// headers (BCC, extra To, etc.) through the name/email fields.
$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);

$body = "Nombre: {$safeName}\n" .
        "Email: {$safeEmail}\n\n" .
        "Mensaje:\n{$message}\n";

$headers = "From: Neko Tools <no-reply@nekotools.site>\r\n" .
           "Reply-To: {$safeEmail}\r\n" .
           "Content-Type: text/plain; charset=UTF-8";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}
