<?php

require '../config.php';

$short = (!empty($_POST['s']) ? preg_replace('/[^a-z0-9-]/i', '', $_POST['s']) : '');
$long = $_POST['l'];
$data = getData();

// Make sure short and long are supplied.
if (empty($short) || empty($long)) {
  http_response_code(400);
  echo json_encode(
    ['status' => 'error', 'message' => 'Insufficient data supplied'],
    JSON_FORCE_OBJECT
  );
  exit;
}

// Make sure the short URL is valid.
if (!array_key_exists($short, $data)) {
  http_response_code(400);
  echo json_encode(
    ['status' => 'error', 'message' => 'Invalid short URL supplied'],
    JSON_FORCE_OBJECT
  );
  exit;
}

// All checks complete. Update the URL.
$data[$short] = ['l' => $long,  $c => time()];
try {
  setData($data);
  echo json_encode(
    ['status' => 'success', 'message' => 'Short URL updated', 'short' => $short, 'long' => $long],
    JSON_FORCE_OBJECT
  );
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(
    ['status' => 'error', 'message' => 'Unable to update Short URL', 'short' => $short, 'long' => $long],
    JSON_FORCE_OBJECT
  );
}