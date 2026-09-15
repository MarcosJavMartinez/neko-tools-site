<?php
// Puente liviano y anónimo para pasar una lista de Neko Lista de un
// dispositivo a otro con un código corto, sin cuenta ni login.
//
// POST { data: [...] }              -> { ok: true, code: "AB12CD" }
// GET  ?code=AB12CD                 -> { ok: true, data: [...] }  (borra al leer)
//
// Los códigos expiran solos a los 15 minutos y son de un solo uso.

header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = [
    'https://neko-lista.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const TTL_SECONDS = 15 * 60;
const MAX_PAYLOAD_BYTES = 200 * 1024;
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I/L, se confunden al tipear
const STORE_DIR = __DIR__ . '/transfers';

function store_path(string $code): string
{
    return STORE_DIR . '/' . $code . '.json';
}

// Aprovecha cualquier request para ir limpiando archivos vencidos, así no
// hace falta un cron aparte para esto.
function cleanup_expired(): void
{
    $files = @glob(STORE_DIR . '/*.json');
    if (!$files) return;
    $now = time();
    foreach ($files as $file) {
        if ($now - filemtime($file) > TTL_SECONDS) {
            @unlink($file);
        }
    }
}

function generate_code(): string
{
    $code = '';
    for ($i = 0; $i < 6; $i++) {
        $code .= CODE_ALPHABET[random_int(0, strlen(CODE_ALPHABET) - 1)];
    }
    return $code;
}

if (!is_dir(STORE_DIR)) {
    @mkdir(STORE_DIR, 0755, true);
}
cleanup_expired();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    if (strlen($raw) > MAX_PAYLOAD_BYTES) {
        http_response_code(413);
        echo json_encode(['ok' => false, 'error' => 'payload_too_large']);
        exit;
    }

    $body = json_decode($raw, true);
    if (!is_array($body) || !isset($body['data']) || !is_array($body['data'])) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'invalid_payload']);
        exit;
    }

    $code = generate_code();
    $attempts = 0;
    while (file_exists(store_path($code)) && $attempts < 5) {
        $code = generate_code();
        $attempts++;
    }

    $written = @file_put_contents(store_path($code), json_encode($body['data']), LOCK_EX);
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'write_failed']);
        exit;
    }

    echo json_encode(['ok' => true, 'code' => $code, 'ttlSeconds' => TTL_SECONDS]);
    exit;
}

if ($method === 'GET') {
    $code = strtoupper(trim((string) ($_GET['code'] ?? '')));
    if (!preg_match('/^[A-Z0-9]{6}$/', $code)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'invalid_code']);
        exit;
    }

    $path = store_path($code);
    if (!file_exists($path) || (time() - filemtime($path) > TTL_SECONDS)) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'not_found_or_expired']);
        exit;
    }

    $contents = file_get_contents($path);
    @unlink($path); // de un solo uso

    echo '{"ok":true,"data":' . $contents . '}';
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
