<?php
// Trigger deploy: o botao "Publicar" do backoffice chama este ficheiro,
// que acorda o robô do GitHub (workflow "Deploy to Server").
// O token do GitHub vive FORA da pasta publica, em /www/.github_token
// (nunca no codigo nem no browser).

$SECRET   = 'eva-deploy-2026-secret-key';
$GH_REPO  = 'donatowoo-web/teste';
$WORKFLOW = 'deploy.yml';
$BRANCH   = 'master';
$TOKEN_FILE = dirname(__DIR__, 2) . '/.github_token'; // /www/.github_token

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$headers = getallheaders();
$auth = isset($headers['X-Deploy-Secret']) ? $headers['X-Deploy-Secret'] : '';
if ($auth !== $SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$token = @trim(@file_get_contents($TOKEN_FILE));
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
