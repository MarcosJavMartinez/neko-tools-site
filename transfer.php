<?php
// Puente liviano y anónimo para pasar una lista de Neko Lista de un
// dispositivo a otro con un código corto, sin cuenta ni login.
//
// POST { data: [...] }              -> { ok: true, code: "AB12CD" }
// GET  ?code=AB12CD                 -> { ok: true, data: [...] }  (borra al leer)
//
// Los códigos expiran solos a los 15 minutos y son de un solo uso.

require __DIR__ . '/transfers/_lib.php';
send_api_headers();

$allowedOrigins = [
    'https://neko-lista.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    // Un navegador siempre manda Origin en estos pedidos: si es de otra web,
    // no la dejamos usar el endpoint como almacenamiento gratis.
    if (!in_array($origin, $allowedOrigins, true)) {
        json_fail(403, 'origin_not_allowed');
    }
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
const MAX_PRODUCTS = 2000;
const MAX_LIVE_CODES = 500;
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I/L, se confunden al tipear
const STORE_DIR = __DIR__ . '/transfers';

function store_path(string $code): string
{
    return STORE_DIR . '/' . $code . '.json';
}

function live_code_files(): array
{
    return @glob(STORE_DIR . '/[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9].json') ?: [];
}

// Aprovecha cualquier request para ir limpiando archivos vencidos, así no
// hace falta un cron aparte para esto.
function cleanup_expired(): void
{
    $now = time();
    $candidates = array_merge(live_code_files(), @glob(STORE_DIR . '/*.claim') ?: []);
    foreach ($candidates as $file) {
        if ($now - (int) @filemtime($file) > TTL_SECONDS) {
            @unlink($file);
        }
    }
    cleanup_rate_limit_files();
}

function generate_code(): string
{
    $code = '';
    for ($i = 0; $i < 6; $i++) {
        $code .= CODE_ALPHABET[random_int(0, strlen(CODE_ALPHABET) - 1)];
    }
    return $code;
}

// La app ya limpia todo lo que recibe, pero el servidor no confía en eso:
// guarda solo campos conocidos, con tipos y rangos válidos, así nunca
// retransmite datos arbitrarios de un dispositivo a otro.
function sanitize_products(array $items): array
{
    $clean = [];
    foreach (array_slice($items, 0, MAX_PRODUCTS) as $item) {
        if (!is_array($item) || !isset($item['name']) || !is_string($item['name'])) continue;

        $name = trim(mb_substr($item['name'], 0, 200));
        if ($name === '') continue;

        $icon = $item['icon'] ?? '';
        $isImageIcon = is_string($icon) && strlen($icon) <= 60000
            && preg_match('/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+\/]+=*$/', $icon) === 1;
        $isEmojiIcon = is_string($icon) && $icon !== '' && !str_starts_with($icon, 'data:') && mb_strlen($icon) <= 16;
        if (!$isImageIcon && !$isEmojiIcon) {
            $icon = '';
        }

        $product = [
            'id' => (isset($item['id']) && is_string($item['id']) && $item['id'] !== '' && strlen($item['id']) <= 64) ? $item['id'] : bin2hex(random_bytes(6)),
            'name' => $name,
            'quantity' => isset($item['quantity']) && is_numeric($item['quantity']) ? (int) max(1, min(9999, round((float) $item['quantity']))) : 1,
            'price' => isset($item['price']) && is_numeric($item['price']) ? (float) max(0, min(1e9, (float) $item['price'])) : 0.0,
            'purchased' => ($item['purchased'] ?? false) === true,
            'category' => (isset($item['category']) && is_string($item['category'])) ? mb_substr($item['category'], 0, 40) : 'Otros',
            'priority' => ($item['priority'] ?? false) === true,
            'icon' => $icon,
        ];
        if (isset($item['key']) && is_string($item['key']) && preg_match('/^[a-z0-9_]{1,40}$/', $item['key'])) {
            $product['key'] = $item['key'];
        }
        $clean[] = $product;
    }
    return $clean;
}

if (!is_dir(STORE_DIR)) {
    @mkdir(STORE_DIR, 0755, true);
}
cleanup_expired();

$method = $_SERVER['REQUEST_METHOD'];
$ip = client_key();

if ($method === 'POST') {
    if (!rate_limit('post:' . $ip, 30, 600)) {
        header('Retry-After: 600');
        json_fail(429, 'too_many_requests');
    }

    $raw = file_get_contents('php://input');
    if (strlen($raw) > MAX_PAYLOAD_BYTES) {
        json_fail(413, 'payload_too_large');
    }

    $body = json_decode($raw, true);
    if (!is_array($body) || !isset($body['data']) || !is_array($body['data'])) {
        json_fail(422, 'invalid_payload');
    }

    $products = sanitize_products($body['data']);
    if (count($body['data']) > 0 && count($products) === 0) {
        json_fail(422, 'invalid_payload');
    }

    if (count(live_code_files()) >= MAX_LIVE_CODES) {
        header('Retry-After: 300');
        json_fail(503, 'busy');
    }

    $code = generate_code();
    $attempts = 0;
    while (file_exists(store_path($code)) && $attempts < 5) {
        $code = generate_code();
        $attempts++;
    }
    if (file_exists(store_path($code))) {
        json_fail(503, 'busy');
    }

    $written = @file_put_contents(store_path($code), json_encode($products), LOCK_EX);
    if ($written === false) {
        json_fail(500, 'write_failed');
    }
    @chmod(store_path($code), 0600);

    echo json_encode(['ok' => true, 'code' => $code, 'ttlSeconds' => TTL_SECONDS]);
    exit;
}

if ($method === 'GET') {
    // Freno a la adivinación de códigos: pocos intentos fallidos por IP y un
    // tope global, sin importar desde cuántas IPs se pruebe.
    if (!rate_limit('get:' . $ip, 60, 600)
        || !rate_limit('fail:' . $ip, 15, 600, false)
        || !rate_limit('fail:global', 200, 600, false)) {
        header('Retry-After: 600');
        json_fail(429, 'too_many_requests');
    }

    $miss = function (int $status, string $error) use ($ip): void {
        rate_limit('fail:' . $ip, 15, 600);
        rate_limit('fail:global', 200, 600);
        json_fail($status, $error);
    };

    $code = strtoupper(trim((string) ($_GET['code'] ?? '')));
    if (!preg_match('/^[A-Z0-9]{6}$/', $code)) {
        $miss(422, 'invalid_code');
    }

    // Se "reclama" el archivo con un rename (atómico): si llegan dos pedidos
    // a la vez con el mismo código, solo uno lo consigue. Así es de un solo
    // uso de verdad y no hay carrera entre leer y borrar.
    $path = store_path($code);
    $claimed = $path . '.' . bin2hex(random_bytes(4)) . '.claim';
    if (!@rename($path, $claimed)) {
        $miss(404, 'not_found_or_expired');
    }

    $expired = (time() - (int) @filemtime($claimed)) > TTL_SECONDS;
    $contents = $expired ? false : @file_get_contents($claimed);
    @unlink($claimed);

    if ($contents === false || !is_array(json_decode($contents, true))) {
        $miss(404, 'not_found_or_expired');
    }

    echo '{"ok":true,"data":' . $contents . '}';
    exit;
}

json_fail(405, 'method_not_allowed');
