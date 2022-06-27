<?php

require '../config.php';

// Config
$env = getEnvJson();
$data = getData();
$uri = trim($_SERVER['REQUEST_URI'], '/');
if ($lastSlash = strrpos($uri, '/')) {
  $uri = substr($uri, $lastSlash);
}

// Redirect
if (strlen($uri) > 0 && isset($data[$uri])) {
  http_response_code(REDIRECT_STATUS);
  header('Location: ' . $data[$uri]['l']);
  exit;
}

// Index
readfile(PUBLIC_HTML);
