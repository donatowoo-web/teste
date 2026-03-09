<?php
// Deploy webhook for evaplace.pt backoffice
// Receives a tar.gz of the build output and deploys it

$SECRET = 'eva-deploy-2026-secret-key';

// Check secret
$headers = getallheaders();
$authHeader = isset($headers['X-Deploy-Secret']) ? $headers['X-Deploy-Secret'] : '';

if ($authHeader !== $SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: X-Deploy-Secret, Content-Type');
    exit;
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['build']) || $_FILES['build']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No build file uploaded']);
    exit;
}

$tmpFile = $_FILES['build']['tmp_name'];
$wwwDir = dirname(__DIR__);
$outDir = $wwwDir . '/out';
$oldDir = $wwwDir . '/out_old';
$newDir = $wwwDir . '/out_new';

try {
    // Extract to new dir
    if (is_dir($newDir)) {
        shell_exec("rm -rf " . escapeshellarg($newDir));
    }
    mkdir($newDir, 0755, true);
    
    $result = shell_exec("tar -xzf " . escapeshellarg($tmpFile) . " -C " . escapeshellarg($newDir) . " 2>&1");
    
    // Swap directories
    if (is_dir($oldDir)) {
        shell_exec("rm -rf " . escapeshellarg($oldDir));
    }
    
    if (is_dir($outDir)) {
        rename($outDir, $oldDir);
    }
    
    rename($newDir, $outDir);
    
    echo json_encode([
        'success' => true,
        'message' => 'Deploy completed',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
