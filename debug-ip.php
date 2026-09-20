<?php
// TEMPORAL: diagnóstico de qué IP ve el servidor detrás del CDN. Se borra en el próximo commit.
header('Content-Type: application/json');
header('Cache-Control: no-store');
$out = ['REMOTE_ADDR' => $_SERVER['REMOTE_ADDR'] ?? null];
foreach ($_SERVER as $k => $v) {
    if (preg_match('/FORWARD|REAL_IP|CLIENT_IP|CONNECTING|_IP$|^HTTP_X_|^HTTP_CDN|^HTTP_VIA|HTTP_TRUE/i', $k)) {
        $out[$k] = $v;
    }
}
echo json_encode($out);
