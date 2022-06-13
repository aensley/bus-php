<?php

// Config
$env = json_decode(file_get_contents('../.env.json'), true);
$data = json_decode(file_get_contents('../.data.json'), true);
$uri = trim($_SERVER['REQUEST_URI'], '/');
if ($lastSlash = strrpos($uri, '/')) {
  $uri = substr($uri, $lastSlash);
}

// Redirect
if (isset($data[$uri])) {
  http_response_code(301); // Moved Permanently
  header('Location: ' . $data[$uri]['l']);
  exit;
}

// Index
$index = file_get_contents('.index.html');
echo str_replace('{{site-name}}', $env['public-domain'], $index);
