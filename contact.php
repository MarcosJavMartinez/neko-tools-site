<?php
require __DIR__ . '/transfers/_lib.php';
send_api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_fail(405, 'method_not_allowed');
}

// El formulario vive en esta misma página: un navegador manda Origin con el
// dominio de la web que hizo el pedido. Si es otra, es un formulario ajeno
// (o un bot copiando el nuestro) intentando mandar mensajes desde acá.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ['https://nekotools.site', 'https://www.nekotools.site'], true)) {
    json_fail(403, 'origin_not_allowed');
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

// Sin esto cualquiera podría llenar la bandeja de entrada (y la cuota de
// envío del hosting) mandando el formulario en bucle.
if (!rate_limit('contact:' . client_key(), 5, 3600) || !rate_limit('contact:global', 40, 86400)) {
    header('Retry-After: 3600');
    json_fail(429, 'too_many_requests');
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_fail(422, 'invalid_input');
}

if (mb_strlen($name) > 120 || mb_strlen($message) > 4000 || mb_strlen($email) > 160) {
    json_fail(422, 'too_long');
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
    json_fail(500, 'send_failed');
}
