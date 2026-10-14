<?php
// Puente para pasar los datos de Neko Finanzas de un dispositivo a otro con
// un código, sin cuenta ni login. Igual que transfer.php (Neko Lista), pero
// el servidor nunca ve los datos: la app los cifra antes de mandarlos y la
// clave viaja solo en el código que la persona copia o escanea. Acá llega un
// bloque ilegible que se guarda unos minutos y se borra al leerlo.
//
// POST { v: 1, salt, iv, data, proof }  -> { ok: true, code: "AB12CD", ttlSeconds }
// GET  ?code=AB12CD&proof=…              -> { ok: true, payload: { v, salt, iv, data } }  (borra al leer)
// GET  ?check=AB12CD                     -> { ok: true, active, salt }  (no lo consume)
//
// salt, iv, data y proof van en base64. proof sale de la misma clave que
// cifra (la app la deriva del código): sirve para que un código mal escrito
// no gaste el envío. Si no coincide, el bloque queda donde está. Los códigos son de un solo uso y vencen
// solos a los 15 minutos.

require __DIR__ . '/transfers/_lib.php';
send_api_headers();

$allowedOrigins = [
    'https://neko-finanzas.vercel.app',
    'http://localhost:5199',
    'http://127.0.0.1:5199',
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
// Un backup cifrado y comprimido de varios años de movimientos ronda unos
// cientos de KB; el tope deja margen sin volverlo un depósito de archivos.
const MAX_PAYLOAD_BYTES = 3 * 1024 * 1024;
const MAX_LIVE_CODES = 300;
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I/L, se confunden al tipear
// Carpeta propia: transfer.php (Neko Lista) no ve estos archivos ni al revés.
const STORE_DIR = __DIR__ . '/transfers/finanzas';

function store_path(string $code): string
{
    return STORE_DIR . '/' . $code . '.json';
}

function live_code_files(): array
{
    return @glob(STORE_DIR . '/[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9].json') ?: [];
}

function cleanup_expired(): void
{
    $now = time();
    $candidates = array_merge(live_code_files(), @glob(STORE_DIR . '/*.claim') ?: []);
    foreach ($candidates as $file) {
        if ($now - (int) @filemtime($file) > TTL_SECONDS) {
            @unlink($file);
        }
    }
    if (random_int(1, 5) === 1) {
        cleanup_rate_limit_files();
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

// Solo se acepta la forma exacta del bloque cifrado: base64 de largos
// conocidos. No hay nada más que limpiar porque el contenido es ilegible.
function base64_field($value, int $minBytes, int $maxBytes): ?string
{
    if (!is_string($value) || $value === '' || preg_match('/^[A-Za-z0-9+\/]+={0,2}$/', $value) !== 1) {
        return null;
    }
    $bytes = base64_decode($value, true);
    if ($bytes === false || strlen($bytes) < $minBytes || strlen($bytes) > $maxBytes) {
        return null;
    }
    return $value;
}

if (!is_dir(STORE_DIR)) {
    @mkdir(STORE_DIR, 0755, true);
}
cleanup_expired();

$method = $_SERVER['REQUEST_METHOD'];
$ip = client_key();

if ($method === 'POST') {
    if (!rate_limit('fin-post:' . $ip, 20, 600)) {
        header('Retry-After: 600');
        json_fail(429, 'too_many_requests');
    }

    $raw = file_get_contents('php://input');
    if (strlen($raw) > MAX_PAYLOAD_BYTES) {
        json_fail(413, 'payload_too_large');
    }

    $body = json_decode($raw, true);
    $salt = is_array($body) ? base64_field($body['salt'] ?? null, 16, 16) : null;
    $iv = is_array($body) ? base64_field($body['iv'] ?? null, 12, 12) : null;
    $data = is_array($body) ? base64_field($body['data'] ?? null, 17, MAX_PAYLOAD_BYTES) : null;
    $proof = is_array($body) ? base64_field($body['proof'] ?? null, 16, 16) : null;
    if (($body['v'] ?? null) !== 1 || $salt === null || $iv === null || $data === null || $proof === null) {
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

    $stored = json_encode(['v' => 1, 'salt' => $salt, 'iv' => $iv, 'data' => $data, 'proof' => $proof]);
    if (@file_put_contents(store_path($code), $stored, LOCK_EX) === false) {
        json_fail(500, 'write_failed');
    }
    @chmod(store_path($code), 0600);

    echo json_encode(['ok' => true, 'code' => $code, 'ttlSeconds' => TTL_SECONDS]);
    exit;
}

if ($method === 'GET') {
    // Freno a la adivinación de códigos: pocos intentos fallidos por IP y un
    // tope global, sin importar desde cuántas IPs se pruebe. (Igual, sin la
    // clave del código completo lo que se baja no se puede leer.)
    $isCheck = isset($_GET['check']);
    $requestBucket = $isCheck ? 'fin-check:' : 'fin-get:';
    $requestMax = $isCheck ? 240 : 60;

    if (!rate_limit($requestBucket . $ip, $requestMax, 600)
        || !rate_limit('fin-fail:' . $ip, 15, 600, false)
        || !rate_limit('fin-fail:global', 200, 600, false)) {
        header('Retry-After: 600');
        json_fail(429, 'too_many_requests');
    }

    $miss = function (int $status, string $error) use ($ip): void {
        rate_limit('fin-fail:' . $ip, 15, 600);
        rate_limit('fin-fail:global', 200, 600);
        json_fail($status, $error);
    };

    $codeParam = $isCheck ? ($_GET['check'] ?? '') : ($_GET['code'] ?? '');
    $code = is_string($codeParam) ? strtoupper(trim($codeParam)) : '';
    if (!preg_match('/^[A-Z0-9]{6}$/', $code)) {
        $miss(422, 'invalid_code');
    }

    if ($isCheck) {
        $checkPath = store_path($code);
        $age = file_exists($checkPath) ? time() - (int) @filemtime($checkPath) : PHP_INT_MAX;
        if ($age <= TTL_SECONDS) {
            // La sal no es secreta: la app la necesita para calcular la prueba.
            $stored = json_decode((string) @file_get_contents($checkPath), true);
            echo json_encode(['ok' => true, 'active' => true, 'remainingSeconds' => TTL_SECONDS - $age, 'salt' => is_array($stored) ? ($stored['salt'] ?? null) : null]);
            exit;
        }
        rate_limit('fin-fail:' . $ip, 15, 600);
        rate_limit('fin-fail:global', 200, 600);
        echo json_encode(['ok' => true, 'active' => false]);
        exit;
    }

    // Primero se mira que la clave sea la correcta, sin consumir nada: un
    // código mal escrito cuenta como intento fallido pero no gasta el envío.
    $path = store_path($code);
    $proofParam = $_GET['proof'] ?? '';
    $peek = file_exists($path) ? json_decode((string) @file_get_contents($path), true) : null;
    if (!is_array($peek) || !is_string($proofParam) || !isset($peek['proof']) || !hash_equals((string) $peek['proof'], $proofParam)) {
        $miss(404, is_array($peek) ? 'wrong_key' : 'not_found_or_expired');
    }

    // Se "reclama" el archivo con un rename (atómico): si llegan dos pedidos
    // a la vez con el mismo código, solo uno lo consigue.
    $claimed = $path . '.' . bin2hex(random_bytes(4)) . '.claim';
    if (!@rename($path, $claimed)) {
        $miss(404, 'not_found_or_expired');
    }

    $expired = (time() - (int) @filemtime($claimed)) > TTL_SECONDS;
    $contents = $expired ? false : @file_get_contents($claimed);
    @unlink($claimed);

    $payload = $contents === false ? null : json_decode($contents, true);
    if (!is_array($payload)) {
        $miss(404, 'not_found_or_expired');
    }
    unset($payload['proof']);

    echo json_encode(['ok' => true, 'payload' => $payload]);
    exit;
}

json_fail(405, 'method_not_allowed');
