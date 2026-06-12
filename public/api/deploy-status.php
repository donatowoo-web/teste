<?php
// Estado da publicacao: o backoffice consulta este ficheiro a cada 5s
// para mostrar "Na fila / A construir / Publicado".
// Le o estado real do workflow no GitHub (token server-side).

$GH_REPO  = 'donatowoo-web/teste';
$WORKFLOW = 'deploy.yml';
$TOKEN_FILE = dirname(__DIR__, 2) . '/.github_token'; // /www/.github_token

header('Content-Type: application/json');
header('Cache-Control: no-store');

$token = @trim(@file_get_contents($TOKEN_FILE));
if (!$token) {
    http_response_code(500);
    echo json_encode(['error' => 'Token do GitHub nao configurado no servidor']);
    exit;
}

// "since" = momento em que o botao foi carregado; so contam runs a partir dai
$since = isset($_GET['since']) ? strtotime($_GET['since']) : 0;

$url = "https://api.github.com/repos/$GH_REPO/actions/workflows/$WORKFLOW/runs?per_page=5";
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => [
        'Accept: application/vnd.github+json',
        'Authorization: Bearer ' . $token,
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: evaplace-deploy',
    ],
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $status !== 200) {
    http_response_code(502);
    echo json_encode(['error' => 'GitHub respondeu ' . $status]);
    exit;
}

$data = json_decode($response, true);
$runs = isset($data['workflow_runs']) ? $data['workflow_runs'] : [];

// Procurar o run mais recente criado depois do clique (com 30s de folga)
$run = null;
foreach ($runs as $r) {
    if (!$since || strtotime($r['created_at']) >= $since - 30) {
        $run = $r;
        break;
    }
}

if (!$run) {
    // Ainda nao apareceu no GitHub — esta na fila
    echo json_encode(['state' => 'QUEUED']);
    exit;
}

$ghStatus = $run['status'];          // queued | in_progress | completed
$conclusion = $run['conclusion'];    // success | failure | cancelled | null

if ($ghStatus === 'completed') {
    if ($conclusion === 'success') {
        $state = 'READY';
    } elseif ($conclusion === 'cancelled') {
        $state = 'CANCELED';
    } else {
        $state = 'ERROR';
    }
} elseif ($ghStatus === 'in_progress') {
    $state = 'BUILDING';
} else {
    $state = 'QUEUED';
}

echo json_encode(['state' => $state]);
