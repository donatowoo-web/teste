<?php
// Trigger deploy: o botao "Publicar" do backoffice chama este ficheiro,
// que acorda o robô do GitHub (workflow "Deploy to Server").
// O token do GitHub vive FORA da pasta publica, em /www/.github_token
// (nunca no codigo nem no browser).

$SECRET   = 'eva-deploy-2026-secret-key';
$GH_REPO  = 'donatowoo-web/teste';
$WORKFLOW = 'deploy.yml';
$BRANCH   = 'master';

// O token do GitHub vive FORA do alcance da web. Procura-o em varios sitios
// (o layout exato do servidor pode variar), o primeiro que existir ganha.
function read_github_token() {
    $candidates = array(
        dirname(__DIR__, 2) . '/.github_token', // um nivel acima da pasta publica
        dirname(__DIR__) . '/.github_token',    // raiz da pasta publica
        '/www/.github_token',
        getenv('HOME') ? getenv('HOME') . '/.github_token' : null,
    );
    foreach ($candidates as $c) {
        if ($c && is_readable($c)) {
            $t = trim((string) file_get_contents($c));
            if ($t !== '') return $t;
        }
    }
    return '';
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$headers = array_change_key_case(getallheaders(), CASE_LOWER);
$auth = isset($headers['x-deploy-secret']) ? $headers['x-deploy-secret'] : '';
if ($auth !== $SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$token = read_github_token();
if (!$token) {
    http_response_code(500);
    echo json_encode(['error' => 'Token do GitHub nao configurado no servidor']);
    exit;
}

$url = "https://api.github.com/repos/$GH_REPO/actions/workflows/$WORKFLOW/dispatches";
$body = json_encode(['ref' => $BRANCH]);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => [
        'Accept: application/vnd.github+json',
        'Authorization: Bearer ' . $token,
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: evaplace-deploy',
        'Content-Type: application/json',
    ],
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($status === 204) {
    echo json_encode([
        'success' => true,
        'message' => 'Publicacao iniciada',
        'dispatchedAt' => gmdate('c'),
    ]);
} else {
    http_response_code(502);
    echo json_encode([
        'error' => 'GitHub respondeu ' . $status,
        'detail' => $err ?: substr((string)$response, 0, 300),
    ]);
}
