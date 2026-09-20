<?php
// Helpers compartidos por transfer.php y contact.php. Vive dentro de
// transfers/ (que .htaccess bloquea por HTTP) y solo define funciones.

function send_api_headers(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    header('Referrer-Policy: no-referrer');
    header('Vary: Origin');
    header_remove('X-Powered-By');
}

function json_fail(int $status, string $error): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $error]);
    exit;
}

// Contador simple por "bucket" (ej: "post:1.2.3.4") dentro de una ventana de
// tiempo, guardado en un archivo chico con lock para que dos requests
// simultáneos no se pisen. Devuelve true si todavía está dentro del límite.
// Con $consume = false solo mira el contador, sin sumar.
function rate_limit(string $bucket, int $max, int $windowSeconds, bool $consume = true): bool
{
    $file = __DIR__ . '/_rl_' . hash('sha256', $bucket) . '.json';
    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return true; // si no se puede escribir, mejor no bloquear a usuarios reales
    }

    flock($handle, LOCK_EX);
    $state = json_decode((string) stream_get_contents($handle), true);
    $now = time();

    if (!is_array($state) || !isset($state['start'], $state['count']) || $now - (int) $state['start'] >= $windowSeconds) {
        $state = ['start' => $now, 'count' => 0];
    }

    if ($consume) {
        $state['count']++;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($state));
        fflush($handle);
    }

    flock($handle, LOCK_UN);
    fclose($handle);

    return $state['count'] <= $max;
}

// Detrás del CDN de Hostinger REMOTE_ADDR ya es la IP real del visitante (se
// verificó); X-Forwarded-For NO se usa porque el cliente puede falsificarlo.
// Las IPv6 se agrupan por bloque /64: una casa recibe un /64 entero y podría
// rotar de dirección adentro de él para esquivar el límite.
function client_key(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $packed = @inet_pton($ip);
    if ($packed !== false && strlen($packed) === 16) {
        return bin2hex(substr($packed, 0, 8)) . '/64';
    }
    return $ip;
}

// Borra contadores de rate limit viejos (los códigos de transferencia los
// limpia transfer.php con su propio TTL, que es mucho más corto).
function cleanup_rate_limit_files(int $olderThanSeconds = 7200): void
{
    $files = @glob(__DIR__ . '/_rl_*.json');
    if (!$files) return;
    $now = time();
    foreach ($files as $file) {
        if ($now - (int) @filemtime($file) > $olderThanSeconds) {
            @unlink($file);
        }
    }
}
